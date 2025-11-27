import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPDF } from "@/lib/extractors/pdf-extractor";
import { OpenRouterClient } from "@/lib/llm/openrouter-client";
import { buildAssessmentPrompt } from "@/lib/llm/prompts";
import * as cheerio from "cheerio";

export const maxDuration = 60; // Allow up to 60 seconds for processing

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const jobDescriptionInput = formData.get("jobDescription") as string;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        if (!jobDescriptionInput) {
            return NextResponse.json(
                { error: "No job description or URL provided" },
                { status: 400 }
            );
        }

        // 1. Extract text from Resume
        const buffer = Buffer.from(await file.arrayBuffer());
        let resumeText = "";

        if (file.type === "application/pdf") {
            const result = await extractTextFromPDF(buffer);
            if (!result.success || !result.full_text) {
                return NextResponse.json(
                    { error: "Failed to extract text from PDF" },
                    { status: 500 }
                );
            }
            resumeText = result.full_text;
        } else {
            // For now only PDF is supported based on existing extractors, 
            // but we can add DOCX support if the extractor is available and exported.
            // Assuming PDF for now as per previous context.
            return NextResponse.json(
                { error: "Only PDF files are currently supported for assessment" },
                { status: 400 }
            );
        }

        // 2. Process Job Description (Text Only)
        let jobDescriptionText = jobDescriptionInput.trim();

        // Basic validation
        if (jobDescriptionText.length < 50) {
            return NextResponse.json(
                { error: "Job description is too short. Please provide at least 50 characters of text." },
                { status: 400 }
            );
        }

        // 3. Generate Assessment with LLM
        const client = new OpenRouterClient();
        // Use default model (gpt-4o-mini)

        const prompt = buildAssessmentPrompt(resumeText, jobDescriptionText);

        const completion = await client.chatCompletion(
            [{ role: "user", content: prompt }],
            0.2, // Temperature (low for consistency)
            undefined, // Use default max tokens
            0.8 // Top_P (narrower sampling for precision)
        );

        if (!completion.success || !completion.content) {
            throw new Error(completion.error || "Failed to generate assessment");
        }

        // 4. Parse JSON response
        let assessmentData;
        try {
            // Clean up markdown code blocks if present
            const cleanContent = completion.content.replace(/```json\n?|\n?```/g, "").trim();
            assessmentData = JSON.parse(cleanContent);
        } catch (error) {
            console.error("Failed to parse LLM response as JSON:", completion.content);
            return NextResponse.json(
                { error: "Failed to generate a valid assessment report" },
                { status: 500 }
            );
        }

        return NextResponse.json(assessmentData);

    } catch (error) {
        console.error("Assessment error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "An internal error occurred" },
            { status: 500 }
        );
    }
}
