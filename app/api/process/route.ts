/**
 * Main Resume Processing API Route
 * Handles file upload, extraction, LLM processing, Federal validation, and DOCX generation
 */

import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/extractors/pdf-extractor";
import { extractTextFromDOCX } from "@/lib/extractors/docx-extractor";
import { OpenRouterClient } from "@/lib/llm/openrouter-client";
import {
  buildStructuredResumePrompt,
  getStructuredSystemMessage,
  parseStructuredResumeResponse,
} from "@/lib/llm/prompts-structured";
import {
  buildJobMatchingPrompt,
  getJobMatchingSystemMessage,
  parseJobMatchResponse,
} from "@/lib/llm/prompts-matching";
import { generateStructuredResume } from "@/lib/generators/structured-docx-generator";
import { detectFileType, generateOutputFilename } from "@/lib/utils/file-helpers";
import { validateConfig } from "@/lib/utils/constants";
import {
  validateResumeContent,
  validateJobDescription,
  sanitizeResumeContent,
  performEarlyRejectionChecks,
} from "@/lib/utils/security-validators";

export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for Vercel Pro

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("📄 Processing file:", file.name);
    if (jobDescription) {
      console.log("🎯 Job tailoring mode enabled");
      console.log(`   Job description length: ${jobDescription.length} characters`);
    } else {
      console.log("📋 Standard federal compliance mode");
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Detect file type
    const fileType = detectFileType(file.name);

    if (fileType === "unknown") {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a PDF or DOCX file." },
        { status: 400 }
      );
    }

    // Extract text from file
    let extractResult;
    if (fileType === "pdf") {
      extractResult = await extractTextFromPDF(buffer);
    } else {
      extractResult = await extractTextFromDOCX(buffer);
    }

    if (!extractResult.success || !extractResult.full_text) {
      return NextResponse.json(
        { error: `Failed to extract text: ${extractResult.error || "Unknown error"}` },
        { status: 500 }
      );
    }

    const resumeText = extractResult.full_text;
    const originalPages = extractResult.total_pages || 0;

    console.log(`✅ Extracted ${resumeText.length.toLocaleString()} characters from ${originalPages} page(s)`);

    // =========================================================================
    // EARLY REJECTION GATE - NO LLM TOKEN WASTE
    // All validation checks that trigger rejection run here BEFORE any expensive operations
    // =========================================================================

    console.log("🚪 Running early rejection gate (length, gibberish, profanity, injection)...");
    const earlyCheck = performEarlyRejectionChecks(resumeText);

    if (!earlyCheck.passed) {
      console.error(`❌ Early rejection: ${earlyCheck.rejectionType}`);
      console.error(`   Reason: ${earlyCheck.error}`);
      if (earlyCheck.details.length > 0) {
        console.error("   Details:");
        earlyCheck.details.forEach((detail) => {
          console.error(`     - ${detail}`);
        });
      }

      return NextResponse.json(
        {
          error: earlyCheck.error,
          rejectionType: earlyCheck.rejectionType,
        },
        { status: 400 }
      );
    }

    console.log("✅ All early validation checks passed - resume is valid for processing");

    // =========================================================================
    // LIGHT SANITIZATION (only for borderline patterns)
    // Critical patterns already caught above, this only strips suspicious lines
    // =========================================================================

    console.log("🔍 Sanitizing borderline suspicious patterns...");
    const sanitizationResult = sanitizeResumeContent(resumeText);

    // Sanitization should only strip borderline patterns now (critical already caught)
    if (!sanitizationResult.isSafe) {
      // This should rarely happen now, but keep as fallback
      console.warn("⚠️  Unexpected sanitization failure (should have been caught by early gate)");
      return NextResponse.json(
        { error: "Resume validation failed", rejectionType: "injection" },
        { status: 400 }
      );
    }

    // Log what was sanitized (should be minimal now)
    if (sanitizationResult.removedPatterns.length > 0) {
      console.warn(`⚠️  Sanitized ${sanitizationResult.removedPatterns.length} borderline pattern(s):`);
      sanitizationResult.removedPatterns.forEach((pattern) => {
        console.warn(`   - ${pattern}`);
      });
    } else {
      console.log("✅ No borderline patterns to sanitize");
    }

    // IMPORTANT: Use sanitized text for all subsequent processing
    const cleanResumeText = sanitizationResult.sanitized;
    console.log("✅ Resume content validated and sanitized successfully");

    // =========================================================================
    // EXPENSIVE OPERATIONS (only for validated content)
    // =========================================================================

    // Validate job description if provided
    if (jobDescription) {
      console.log("🔍 Validating job description...");
      const jobValidation = validateJobDescription(jobDescription);
      if (!jobValidation.isValid) {
        console.error("❌ Job description validation failed:", jobValidation.reason);
        return NextResponse.json(
          { error: jobValidation.reason },
          { status: 400 }
        );
      }
      console.log("✅ Job description passed");
    }

    console.log("✅ All content validation passed");

    // =========================================================================
    // PRE-SCREENING: JOB MATCH ANALYSIS (Tailored Mode Only)
    // =========================================================================

    if (jobDescription) {
      console.log("🎯 Pre-screening: Analyzing job-resume match...");

      const matchPrompt = buildJobMatchingPrompt(cleanResumeText, jobDescription);
      const matchSystemMessage = getJobMatchingSystemMessage();

      const llmClient = new OpenRouterClient();
      const matchResult = await llmClient.chatCompletion([
        { role: "system", content: matchSystemMessage },
        { role: "user", content: matchPrompt },
      ]);

      if (!matchResult.success || !matchResult.content) {
        console.warn("⚠️  Job match pre-screening failed, continuing with processing");
        // Continue anyway - don't block on pre-screening failure
      } else {
        const matchAnalysis = parseJobMatchResponse(matchResult.content);

        if (matchAnalysis && !matchAnalysis.canProceed) {
          console.log("❌ NO_MATCH detected - returning mismatch response");
          return NextResponse.json(
            {
              mismatch: true,
              matchLevel: matchAnalysis.matchLevel,
              reason: matchAnalysis.reason,
              canProceedStandard: true,
            },
            { status: 200 }
          );
        } else if (matchAnalysis) {
          console.log(`✅ Match level: ${matchAnalysis.matchLevel} - proceeding with tailoring`);
        }
      }
    }

    // =========================================================================
    // MAIN PROCESSING: LLM CONTENT EXTRACTION
    // =========================================================================

    console.log("🤖 Sending to LLM for structured content extraction...");
    const prompt = buildStructuredResumePrompt(cleanResumeText, jobDescription || undefined);
    const systemMessage = getStructuredSystemMessage();

    // Send to LLM
    const llmClient = new OpenRouterClient();
    const llmResult = await llmClient.chatCompletion([
      { role: "system", content: systemMessage },
      { role: "user", content: prompt },
    ]);

    if (!llmResult.success || !llmResult.content) {
      return NextResponse.json(
        { error: `Failed to extract resume content: ${llmResult.error || "No content returned"}` },
        { status: 500 }
      );
    }

    console.log("✅ Received response from LLM");

    // Parse JSON response
    console.log("🔍 Parsing structured JSON data...");
    const structuredData = parseStructuredResumeResponse(llmResult.content);

    if (!structuredData) {
      console.error("Failed to parse LLM response. Raw response:");
      console.error(llmResult.content.substring(0, 500) + "...");

      return NextResponse.json(
        {
          error: "Failed to parse structured resume data from LLM response",
          details: "The LLM did not return valid JSON. Check server logs for details.",
        },
        { status: 500 }
      );
    }

    console.log("✅ Successfully parsed structured data");
    console.log(`   - Contact: ${structuredData.contactInfo.name}`);
    console.log(`   - Work Experience: ${structuredData.workExperience.length} positions`);
    console.log(`   - Education: ${structuredData.education.length} degrees`);

    // Validate structured data (allow placeholders)
    const validationIssues: string[] = [];
    if (!structuredData.contactInfo.name) {
      validationIssues.push("Missing contact name");
    }
    // Note: email, phone, location can use placeholders like [EMAIL], [PHONE], [LOCATION]
    // So we only warn if completely missing, not if using placeholders

    if (validationIssues.length > 0) {
      console.warn("⚠️  Validation issues:", validationIssues);
    }

    // Generate DOCX with deterministic template
    console.log("📝 Generating DOCX with Salomone template...");
    const docxResult = await generateStructuredResume(structuredData);

    if (!docxResult.success || !docxResult.buffer) {
      return NextResponse.json(
        { error: `Failed to generate DOCX: ${docxResult.error || "Unknown error"}` },
        { status: 500 }
      );
    }

    // Generate filename
    const filename = generateOutputFilename();

    console.log("✅ DOCX generated successfully");

    // Return DOCX file directly
    return new NextResponse(docxResult.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxResult.buffer.length.toString(),
        "X-Original-Pages": originalPages.toString(),
        "X-Validation-Issues": validationIssues.length.toString(),
        "X-Content-Sanitized": sanitizationResult.removedPatterns.length > 0 ? "true" : "false",
        "X-Patterns-Removed": sanitizationResult.removedPatterns.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error processing resume:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
