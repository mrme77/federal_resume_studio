/**
 * DOCX Extraction Module
 * Extracts text content from Word documents (.docx files)
 */

import mammoth from "mammoth";

export interface ExtractResult {
  success: boolean;
  full_text?: string;
  error?: string;
  total_pages?: number;
  metadata?: {
    page_count: number;
    word_count: number;
  };
}

/**
 * Extracts text from DOCX buffer
 * @param buffer - DOCX file as Buffer
 * @returns Extraction result with text and metadata
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<ExtractResult> {
  try {
    // Extract text using mammoth
    const result = await mammoth.extractRawText({ buffer });

    const fullText = result.value;

    // Count approximate pages (assuming ~500 words per page)
    const wordCount = fullText.split(/\s+/).filter((word) => word.length > 0).length;
    const estimatedPages = Math.max(1, Math.floor(wordCount / 500));

    return {
      success: true,
      full_text: fullText.trim(),
      total_pages: estimatedPages,
      metadata: {
        page_count: estimatedPages,
        word_count: wordCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error during DOCX extraction",
      full_text: "",
      total_pages: 0,
      metadata: {
        page_count: 0,
        word_count: 0,
      },
    };
  }
}

/**
 * Cleans and normalizes extracted text
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
export function cleanText(text: string): string {
  // Remove excessive whitespace
  let cleaned = text.replace(/\s+/g, " ");

  // Normalize line breaks
  cleaned = cleaned.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  return cleaned.trim();
}
