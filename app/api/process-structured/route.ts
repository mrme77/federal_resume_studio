/**
 * Structured Resume Processing API Route
 * New workflow: Parser → LLM (JSON) → Template Generator
 * Deterministic formatting with structured content
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
import { generateStructuredResume } from "@/lib/generators/structured-docx-generator";
import { detectFileType, generateOutputFilename } from "@/lib/utils/file-helpers";
import { validateConfig } from "@/lib/utils/constants";


export const runtime = "nodejs";
export const maxDuration = 60; // 60 seconds for Vercel Pro

export async function POST(request: NextRequest) {
  try {
    // Validate configuration
    validateConfig();

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    console.log("📄 Processing file:", file.name);

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

    // =========================================================================
    // STEP 1: EXTRACT TEXT FROM FILE (Parser)
    // =========================================================================

    console.log("📖 Extracting text from", fileType.toUpperCase(), "file...");

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
    console.log(`✅ Extracted ${resumeText.length} characters from ${originalPages} page(s)`);

    // =========================================================================
    // STEP 2: LLM CONTENT EXTRACTION (Returns JSON)
    // =========================================================================

    console.log("🤖 Sending to LLM for structured content extraction...");

    const prompt = buildStructuredResumePrompt(resumeText);
    const systemMessage = getStructuredSystemMessage();

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
      // Log the raw response for debugging
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

    // =========================================================================
    // STEP 3: VALIDATE STRUCTURED DATA
    // =========================================================================

    console.log("🔍 Validating structured data...");

    const validationIssues: string[] = [];

    // Check required fields
    if (!structuredData.contactInfo.name) {
      validationIssues.push("Missing contact name");
    }
    if (!structuredData.contactInfo.email) {
      validationIssues.push("Missing contact email");
    }
    if (!structuredData.contactInfo.phone) {
      validationIssues.push("Missing contact phone");
    }
    if (!structuredData.workExperience || structuredData.workExperience.length === 0) {
      validationIssues.push("Missing work experience");
    }
    if (!structuredData.education || structuredData.education.length === 0) {
      validationIssues.push("Missing education");
    }

    // Check work experience details
    if (structuredData.workExperience) {
      structuredData.workExperience.forEach((job, index) => {
        if (!job.title) validationIssues.push(`Job ${index + 1}: Missing title`);
        if (!job.hoursPerWeek) validationIssues.push(`Job ${index + 1}: Missing hours per week`);
        if (!job.startDate) validationIssues.push(`Job ${index + 1}: Missing start date`);
        if (!job.endDate) validationIssues.push(`Job ${index + 1}: Missing end date`);
        if (!job.responsibilities || job.responsibilities.length === 0) {
          validationIssues.push(`Job ${index + 1}: Missing responsibilities`);
        }
      });
    }

    if (validationIssues.length > 0) {
      console.warn("⚠️  Validation issues found:");
      validationIssues.forEach((issue) => console.warn(`   - ${issue}`));
    } else {
      console.log("✅ All required fields present");
    }

    // =========================================================================
    // STEP 4: GENERATE DOCX WITH DETERMINISTIC TEMPLATE
    // =========================================================================

    console.log("📝 Generating DOCX with deterministic template...");

    const docxResult = await generateStructuredResume(structuredData);

    if (!docxResult.success || !docxResult.buffer) {
      return NextResponse.json(
        { error: `Failed to generate DOCX: ${docxResult.error || "Unknown error"}` },
        { status: 500 }
      );
    }

    console.log("✅ DOCX generated successfully");

    // Generate filename
    const filename = generateOutputFilename();

    // Return DOCX file directly
    return new NextResponse(docxResult.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docxResult.buffer.length.toString(),
        "X-Original-Pages": originalPages.toString(),
        "X-Validation-Issues": validationIssues.length.toString(),
      },
    });
  } catch (error) {
    console.error("❌ Error processing resume:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
