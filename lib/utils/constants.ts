/**
 * Configuration constants for Federal Resume Reformatter
 * Manages API keys, model selection, and application settings
 */

// API Configuration
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";
export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Privacy & Security
// Zero Data Retention (ZDR) is enforced at the OpenRouter account level
// This ensures resume data is NOT retained by AI providers
// No code-level enforcement needed as it's configured in the API account settings

// Model Selection
// Recommended models for this task:
// - meta-llama/llama-3.3-70b-instruct: Powerful Llama model, excellent instruction following
// - google/gemini-2.5-flash-lite: Fast, cost-effective Google model
// - openai/gpt-4o-mini: Fast, cost-effective, excellent for text analysis
// - anthropic/claude-3.5-sonnet: Superior at following formatting guidelines
// - openai/gpt-4o: Most powerful but slower/more expensive
export const DEFAULT_MODEL = "meta-llama/llama-3.3-70b-instruct";
// export const DEFAULT_MODEL = "openai/gpt-4o-mini";  // OpenAI alternative
// export const DEFAULT_MODEL = "google/gemini-2.5-flash-lite";  // Google alternative

// File Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [".pdf", ".docx", ".doc"];
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

// Resume Settings
export const MAX_PAGES = 2;
export const TARGET_FORMAT = "DOCX";

// Processing Settings
export const TEMPERATURE = 0.3; // Lower for more consistent formatting
export const MAX_TOKENS = 4000;

// Custom headers for OpenRouter
export const OPENROUTER_HEADERS = {
  "HTTP-Referer": "https://github.com/federal-resume-reformatter",
  "X-Title": "Federal Resume Reformatter",
};

/**
 * Validates configuration
 * @throws Error if configuration is invalid
 */
export function validateConfig(): void {
  if (!OPENROUTER_API_KEY) {
    throw new Error("OPENROUTER_API_KEY environment variable not set");
  }
}
