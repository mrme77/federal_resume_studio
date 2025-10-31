/**
 * File validation and helper utilities
 */

import { ALLOWED_FILE_TYPES, ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "./constants";

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates uploaded file
 */
export function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file extension
  const fileExt = getFileExtension(file.name);
  if (!ALLOWED_FILE_TYPES.includes(fileExt)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
    };
  }

  // Check MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file MIME type. Expected: ${ALLOWED_MIME_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Gets file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return "";
  return filename.substring(lastDot).toLowerCase();
}

/**
 * Detects file type from filename or buffer
 */
export function detectFileType(filename: string): "pdf" | "docx" | "unknown" {
  const ext = getFileExtension(filename);

  if (ext === ".pdf") return "pdf";
  if (ext === ".docx" || ext === ".doc") return "docx";

  return "unknown";
}

/**
 * Generates output filename with timestamp
 */
export function generateOutputFilename(): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0].replace("T", "_");
  return `reformatted_resume_${timestamp}.docx`;
}
