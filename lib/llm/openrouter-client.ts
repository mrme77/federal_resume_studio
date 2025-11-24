/**
 * OpenRouter LLM Client
 * Handles communication with OpenRouter API for resume analysis and reformatting
 */

import OpenAI from "openai";
import {
  OPENROUTER_API_KEY,
  OPENROUTER_BASE_URL,
  DEFAULT_MODEL,
  TEMPERATURE,
  MAX_TOKENS,
  OPENROUTER_HEADERS,
} from "../utils/constants";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface ChatCompletionResult {
  success: boolean;
  content?: string;
  error?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterClient {
  private client: OpenAI;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    const key = apiKey || OPENROUTER_API_KEY;

    if (!key) {
      throw new Error("OpenRouter API key is required");
    }

    // Initialize OpenAI client with OpenRouter endpoint
    this.client = new OpenAI({
      baseURL: OPENROUTER_BASE_URL,
      apiKey: key,
      defaultHeaders: OPENROUTER_HEADERS,
    });

    this.model = model || DEFAULT_MODEL;
  }

  /**
   * Sends a chat completion request to OpenRouter
   * @param messages - Array of chat messages
   * @param temperature - Sampling temperature (optional)
   * @param maxTokens - Maximum tokens to generate (optional)
   * @param topP - Nucleus sampling probability (optional)
   * @returns Chat completion result
   */
  async chatCompletion(
    messages: ChatMessage[],
    temperature?: number,
    maxTokens?: number,
    topP?: number
  ): Promise<ChatCompletionResult> {
    const temp = temperature !== undefined ? temperature : TEMPERATURE;
    const tokens = maxTokens !== undefined ? maxTokens : MAX_TOKENS;

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: temp,
        max_tokens: tokens,
        top_p: topP,
      });

      // Verify we have the expected structure
      if (!completion.choices || completion.choices.length === 0) {
        return {
          success: false,
          error: "Invalid response structure: no choices returned",
          content: "",
        };
      }

      const content = completion.choices[0].message.content;

      if (!content) {
        return {
          success: false,
          error: "No content in response",
          content: "",
        };
      }

      return {
        success: true,
        content: content,
        model: completion.model || this.model,
        usage: completion.usage
          ? {
            prompt_tokens: completion.usage.prompt_tokens,
            completion_tokens: completion.usage.completion_tokens,
            total_tokens: completion.usage.total_tokens,
          }
          : undefined,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorType = error instanceof Error ? error.constructor.name : "Error";

      return {
        success: false,
        error: `${errorType}: ${errorMsg}`,
        content: "",
      };
    }
  }

  /**
   * Updates the model being used
   * @param model - New model identifier
   */
  setModel(model: string): void {
    this.model = model;
  }

  /**
   * Gets the current model
   * @returns Current model identifier
   */
  getModel(): string {
    return this.model;
  }
}
