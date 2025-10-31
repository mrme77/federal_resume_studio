/**
 * PDF Extraction Module
 * Extracts text content from uploaded resume PDFs using pdf2json
 */

import PDFParser from "pdf2json";

export interface ExtractResult {
  success: boolean;
  full_text?: string;
  error?: string;
  total_pages?: number;
}

/**
 * Extracts text from a PDF buffer using pdf2json.
 * @param buffer - PDF file as a Buffer.
 * @returns A Promise that resolves with the extraction result.
 */
export function extractTextFromPDF(buffer: Buffer): Promise<ExtractResult> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, 1);

    pdfParser.on("pdfParser_dataError", (errData: any) => {
      const error = new Error(errData.parserError || "Unknown PDF parsing error");
      console.error(error);
      resolve({
        success: false,
        error: error.message,
        full_text: "",
        total_pages: 0,
      });
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        if (!pdfData || !pdfData.Pages) {
          throw new Error("Invalid PDF data structure received from parser.");
        }

        const total_pages = pdfData.Pages.length;
        let full_text = "";

        pdfData.Pages.forEach((page: any) => {
          if (!page.Texts) return;
          // Sort texts by their Y and then X coordinates
          const texts = page.Texts.sort((a: any, b: any) => {
            if (a.y < b.y) return -1;
            if (a.y > b.y) return 1;
            if (a.x < b.x) return -1;
            if (a.x > b.x) return 1;
            return 0;
          });

          let lastY = -1;
          let line = '';
          texts.forEach((text: any, index: number) => {
            const decodedText = decodeURIComponent(text.R[0].T).trim();
            if (decodedText) {
              // If Y position is significantly different, it's a new line
              if (lastY !== -1 && Math.abs(text.y - lastY) > 0.5) {
                  full_text += line + '\n';
                  line = '';
              }
              line += decodedText + ' ';
              lastY = text.y;
            }
          });
          full_text += line.trim() + '\n\n'; // Add remaining line and space between pages
        });
        
        const cleanedText = full_text
          .replace(/\r\n/g, "\n") // Normalize line endings
          .replace(/\r/g, "\n")
          .replace(/\n{3,}/g, "\n\n") // Reduce excessive line breaks
          .trim();

        resolve({
          success: true,
          full_text: cleanedText,
          total_pages: total_pages,
        });
      } catch (error) {
        console.error("Error processing PDF data:", error);
        resolve({
          success: false,
          error: error instanceof Error ? error.message : "Failed to process PDF data",
          full_text: "",
          total_pages: 0,
        });
      }
    });

    // Load the PDF buffer
    pdfParser.parseBuffer(buffer);
  });
}