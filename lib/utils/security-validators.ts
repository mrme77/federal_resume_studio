/**
 * Security validation utilities
 * Validates user input for prompt injection, malicious content, and quality issues
 */

/**
 * Detects potential prompt injection attempts in job descriptions
 * @param text - The job description text to validate
 * @returns Object with isValid flag and reason if invalid
 */
export function validateJobDescription(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: false, reason: "Job description cannot be empty" };
  }

  // Check minimum length (at least 50 chars recommended)
  if (text.trim().length < 50) {
    return {
      isValid: false,
      reason: "Job description is too short. Please provide at least 50 characters.",
    };
  }

  // Detect prompt injection patterns
  const injectionPatterns = [
    /ignore\s+(previous|all|above|prior)\s+(instructions|prompts|commands)/i,
    /system\s*:/i,
    /assistant\s*:/i,
    /\[INST\]/i,
    /\[\/INST\]/i,
    /<\|.*?\|>/,
    /you\s+are\s+now/i,
    /your\s+new\s+(role|instructions|task)/i,
    /forget\s+(everything|all|previous)/i,
    /disregard\s+(previous|all|above)/i,
  ];

  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        reason: "Invalid job description detected. Please provide a legitimate job posting.",
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates resume text content quality
 * @param text - Extracted resume text
 * @returns Object with isValid flag and reason if invalid
 */
export function validateResumeContent(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: false, reason: "Resume is empty or could not be read" };
  }

  // Check minimum content length
  if (text.trim().length < 100) {
    return {
      isValid: false,
      reason: "Resume content is too short. Please upload a complete resume.",
    };
  }

  // Detect gibberish (excessive repeated characters)
  const gibberishPattern = /(.)\1{20,}/; // Same character repeated 20+ times
  if (gibberishPattern.test(text)) {
    return {
      isValid: false,
      reason: "Resume contains invalid or corrupted content.",
    };
  }

  // Detect excessive profanity or inappropriate content
  const profanityPatterns = [
    /\b(fuck|shit|bitch|ass|damn|cunt|bastard)\b/gi,
  ];

  let profanityCount = 0;
  for (const pattern of profanityPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      profanityCount += matches.length;
    }
  }

  // Allow occasional profanity (e.g., company names with "Badass" etc.)
  // but block if excessive (> 5 instances)
  if (profanityCount > 5) {
    return {
      isValid: false,
      reason: "Resume contains inappropriate content.",
    };
  }

  // Check for suspicious patterns that suggest test/junk data
  const suspiciousPatterns = [
    /test\s*test\s*test/i,
    /lorem\s*ipsum/i,
    /asdf/gi,
    /qwerty/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    const matches = text.match(pattern);
    if (matches && matches.length > 2) {
      return {
        isValid: false,
        reason: "Resume appears to contain test or placeholder data.",
      };
    }
  }

  return { isValid: true };
}

/**
 * Validates file size before upload
 * @param fileSizeBytes - Size of file in bytes
 * @param maxSizeMB - Maximum allowed size in MB (default 5MB)
 * @returns Object with isValid flag and reason if invalid
 */
export function validateFileSize(
  fileSizeBytes: number,
  maxSizeMB: number = 5
): {
  isValid: boolean;
  reason?: string;
} {
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (fileSizeBytes > maxBytes) {
    return {
      isValid: false,
      reason: `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller file.`,
    };
  }

  if (fileSizeBytes === 0) {
    return {
      isValid: false,
      reason: "File is empty. Please upload a valid resume.",
    };
  }

  return { isValid: true };
}

/**
 * Validates resume text length to prevent context overflow
 * @param text - Extracted resume text
 * @param maxCharacters - Maximum allowed characters (default 200,000 ≈ 30 pages)
 * @returns Object with isValid flag and reason if invalid
 */
export function validateResumeLength(
  text: string,
  maxCharacters: number = 200000
): {
  isValid: boolean;
  reason?: string;
} {
  const charCount = text.length;

  if (charCount > maxCharacters) {
    const pages = Math.ceil(charCount / 6700); // Rough estimate: ~6700 chars per page
    return {
      isValid: false,
      reason: `Resume is too long (${charCount.toLocaleString()} characters, approximately ${pages} pages). Maximum is ${maxCharacters.toLocaleString()} characters (approximately 30 pages). Please upload a shorter version focusing on recent and relevant experience.`,
    };
  }

  return { isValid: true };
}

/**
 * Detects prompt injection attempts in resume content
 * Uses context-aware detection to avoid false positives on legitimate technical terms
 * @param text - Extracted resume text
 * @returns Object with isValid flag and reason if invalid
 */
export function validateResumeForInjection(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: true }; // Empty is handled by other validators
  }

  // Define clear injection patterns that should be blocked
  const injectionPatterns = [
    // Direct instruction override attempts
    /\bignore\s+(previous|all|above|prior)\s+(instructions|prompts|commands|rules)\b/i,
    /\bdisregard\s+(previous|all|above|prior)\s+(instructions|prompts|commands|rules)\b/i,
    /\bforget\s+(everything|all|previous|prior)\s+(instructions|prompts|commands)?\b/i,

    // Role/identity manipulation
    /\byou\s+are\s+now\s+(a|an|the)\b/i,
    /\byour\s+new\s+(role|task|instruction|job)\s+(is|:)\b/i,
    /\bact\s+as\s+if\s+you\s+(are|were)\b/i,

    // System prompt manipulation (context-aware)
    /^system\s*:/im, // Only at start of line
    /\n\s*system\s*:/i, // Or after newline

    // Chat template markers
    /\[INST\]/i,
    /\[\/INST\]/i,
    /<\|im_start\|>/i,
    /<\|im_end\|>/i,
    /<\|system\|>/i,
    /<\|user\|>/i,
    /<\|assistant\|>/i,

    // Direct output manipulation
    /\breturn\s+all\s+(data|information|content)\b/i,
    /\bprint\s+(all|everything|your)\s+(instructions|prompts|rules)\b/i,
    /\bshow\s+(me\s+)?(your|the)\s+(instructions|prompts|system\s+message)\b/i,
  ];

  // Check for injection patterns
  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      // Additional context check for false positives
      const match = text.match(pattern);
      if (match) {
        const matchedText = match[0].toLowerCase();

        // Allow legitimate technical usage
        const legitimateContexts = [
          /system\s+(architecture|design|engineer|administrator|analyst)/i,
          /instruction\s+(manual|guide|document|set)/i,
          /role\s*:\s*\w+\s+(engineer|manager|developer)/i, // Job titles
        ];

        let isLegitimate = false;
        for (const legitPattern of legitimateContexts) {
          // Check surrounding context (50 chars before and after)
          const matchIndex = text.toLowerCase().indexOf(matchedText);
          const contextStart = Math.max(0, matchIndex - 50);
          const contextEnd = Math.min(text.length, matchIndex + matchedText.length + 50);
          const context = text.substring(contextStart, contextEnd);

          if (legitPattern.test(context)) {
            isLegitimate = true;
            break;
          }
        }

        if (!isLegitimate) {
          return {
            isValid: false,
            reason:
              "Resume contains suspicious content that appears to be prompt injection. Please remove any instructions or commands directed at AI systems and resubmit.",
          };
        }
      }
    }
  }

  return { isValid: true };
}

/**
 * Fast check for profanity and test/placeholder data
 * Used in early rejection gate to avoid LLM token waste
 * @param text - Extracted resume text
 * @returns Validation result
 */
export function detectProfanityAndTestData(text: string): {
  isValid: boolean;
  reason?: string;
} {
  if (!text || text.trim().length === 0) {
    return { isValid: true };
  }

  // Detect excessive profanity (allow occasional, block excessive)
  const profanityPatterns = /\b(fuck|shit|bitch|ass|damn|cunt|bastard)\b/gi;
  const matches = text.match(profanityPatterns);
  if (matches && matches.length > 5) {
    return {
      isValid: false,
      reason: "Resume contains inappropriate content.",
    };
  }

  // Detect test/placeholder data patterns
  const suspiciousPatterns = [
    { pattern: /test\s*test\s*test/i, name: "test repetition" },
    { pattern: /lorem\s*ipsum/i, name: "Lorem Ipsum placeholder" },
    { pattern: /asdf/gi, name: "keyboard mashing" },
    { pattern: /qwerty/gi, name: "keyboard pattern" },
  ];

  for (const { pattern, name } of suspiciousPatterns) {
    const patternMatches = text.match(pattern);
    if (patternMatches && patternMatches.length > 2) {
      return {
        isValid: false,
        reason: `Resume appears to contain test or placeholder data (${name} detected).`,
      };
    }
  }

  return { isValid: true };
}

/**
 * Fast check for critical injection patterns that require immediate rejection
 * Used in early rejection gate to avoid LLM token waste
 * @param text - Extracted resume text
 * @returns Detection result with patterns found
 */
export function detectCriticalInjection(text: string): {
  hasCritical: boolean;
  patterns: string[];
} {
  if (!text || text.trim().length === 0) {
    return { hasCritical: false, patterns: [] };
  }

  const patterns: string[] = [];

  // Critical patterns that should NEVER appear in legitimate resumes
  const criticalPatterns = [
    { regex: /\[INST\]/i, name: "Chat template marker [INST]" },
    { regex: /\[\/INST\]/i, name: "Chat template marker [/INST]" },
    { regex: /<\|im_start\|>/i, name: "Chat template start marker" },
    { regex: /<\|im_end\|>/i, name: "Chat template end marker" },
    { regex: /<\|system\|>/i, name: "System role marker" },
    { regex: /<\|user\|>/i, name: "User role marker" },
    { regex: /<\|assistant\|>/i, name: "Assistant role marker" },
  ];

  for (const { regex, name } of criticalPatterns) {
    if (regex.test(text)) {
      patterns.push(name);
    }
  }

  // Check for multiple injection attempts (3+ = deliberate attack)
  const injectionAttempts = text.match(
    /\b(ignore|disregard|forget)\s+(previous|all|above)\s+(instructions|prompts|commands)/gi
  );
  if (injectionAttempts && injectionAttempts.length >= 3) {
    patterns.push(`${injectionAttempts.length} instruction override attempts detected`);
  }

  // Detect HTML comment injections (hidden instructions)
  const htmlCommentInjections = text.match(
    /<!--[\s\S]*?(ignore|override|injection|instruction|system|prompt|respond|print|execute|eval)[\s\S]*?-->/gi
  );
  if (htmlCommentInjections && htmlCommentInjections.length > 0) {
    patterns.push(`${htmlCommentInjections.length} HTML comment injection(s) detected`);
  }

  // Detect base64-encoded payloads (common obfuscation technique)
  // Look for base64: followed by suspicious base64 strings
  const base64Pattern = /base64\s*:\s*([A-Za-z0-9+/]{20,}={0,2})/gi;
  const base64Matches = text.match(base64Pattern);
  if (base64Matches && base64Matches.length > 0) {
    // Try to decode and check for injection keywords
    for (const match of base64Matches) {
      try {
        const base64String = match.replace(/base64\s*:\s*/i, '');
        const decoded = Buffer.from(base64String, 'base64').toString('utf-8');

        // Check if decoded content contains injection keywords
        if (
          /ignore|override|system|instruction|prompt|execute|eval|respond|print/i.test(decoded)
        ) {
          patterns.push(`Base64-encoded injection attempt detected (decoded suspicious content)`);
          break;
        }
      } catch {
        // Invalid base64 or decoding error - suspicious but not critical
      }
    }
  }

  // Detect structured override attempts (JSON/YAML-like in comments)
  const structuredOverride = /(?:<!--|\{|\[)\s*(?:override|action|instruction|system)\s*[:=]\s*["']?(true|print|ignore|execute)/gi;
  if (structuredOverride.test(text)) {
    patterns.push("Structured override/configuration injection detected");
  }

  return {
    hasCritical: patterns.length > 0,
    patterns,
  };
}

/**
 * Unified early rejection gate - runs all validation checks that should block processing
 * Designed to catch ALL rejection scenarios before any LLM calls to avoid token waste
 * @param text - Extracted resume text
 * @returns Validation result with rejection details
 */
export function performEarlyRejectionChecks(text: string): {
  passed: boolean;
  error: string;
  rejectionType: "length" | "gibberish" | "profanity" | "injection" | null;
  details: string[];
} {

  // Check 1: Length validation (200k chars / ~30 pages)
  const lengthCheck = validateResumeLength(text);
  if (!lengthCheck.isValid) {
    return {
      passed: false,
      error: lengthCheck.reason!,
      rejectionType: "length",
      details: ["Resume exceeds maximum length limit"],
    };
  }

  // Check 2: Gibberish/attack payload detection
  const gibbCheck = detectGibberish(text);
  if (gibbCheck.isGibberish) {
    return {
      passed: false,
      error:
        "Resume contains invalid or malicious content and cannot be processed. Please submit a legitimate resume with actual work experience and qualifications.",
      rejectionType: "gibberish",
      details: gibbCheck.details,
    };
  }

  // Check 3: Profanity and test data
  const qualityCheck = detectProfanityAndTestData(text);
  if (!qualityCheck.isValid) {
    return {
      passed: false,
      error: qualityCheck.reason!,
      rejectionType: "profanity",
      details: [qualityCheck.reason!],
    };
  }

  // Check 4: Critical injection patterns
  const injectionCheck = detectCriticalInjection(text);
  if (injectionCheck.hasCritical) {
    return {
      passed: false,
      error:
        "Resume contains suspicious content that appears to be a security threat. Please remove any AI commands, chat markers, or malicious instructions and resubmit.",
      rejectionType: "injection",
      details: injectionCheck.patterns,
    };
  }

  // All checks passed
  return {
    passed: true,
    error: "",
    rejectionType: null,
    details: [],
  };
}

/**
 * Detects gibberish/attack payloads in resume content
 * Uses scoring system to identify obviously malicious content before sanitization
 * @param text - Extracted resume text
 * @returns Detection result with score and details
 */
export function detectGibberish(text: string): {
  isGibberish: boolean;
  score: number;
  reason: string;
  details: string[];
} {
  if (!text || text.trim().length === 0) {
    return { isGibberish: false, score: 0, reason: "", details: [] };
  }

  let score = 0;
  const details: string[] = [];
  const threshold = 10;

  // Helper: Find blocks of 50+ characters with <20% alphabetic characters
  const findRandomBlocks = (content: string): number => {
    const blockSize = 50;
    const alphaThreshold = 0.2;
    let count = 0;

    for (let i = 0; i <= content.length - blockSize; i += 10) {
      const block = content.substring(i, i + blockSize);
      const alphaChars = block.match(/[a-zA-Z]/g)?.length || 0;
      const alphaRatio = alphaChars / blockSize;

      if (alphaRatio < alphaThreshold) {
        count++;
      }
    }

    return count;
  };

  // Helper: Calculate ratio of special characters
  const calculateSpecialCharRatio = (content: string): number => {
    const specialChars = content.match(/[!@#$%^&*()_+\-=\[\]{}|\\:;"'<>,.?/~`]/g)?.length || 0;
    const totalChars = content.length;
    return totalChars > 0 ? specialChars / totalChars : 0;
  };

  // Helper: Find sequences of 15+ characters with no vowels
  const findNoVowelSequences = (content: string): number => {
    
    const sequences = content.match(/[^aeiouAEIOU\s]{15,}/g);
    return sequences ? sequences.length : 0;
  };

  // Helper: Count lines with >70% special characters/numbers
  const countSymbolHeavyLines = (content: string): number => {
    const lines = content.split('\n');
    let count = 0;

    for (const line of lines) {
      if (line.trim().length < 10) continue; // Skip short lines

      const specialAndNumbers = line.match(/[^a-zA-Z\s]/g)?.length || 0;
      const ratio = specialAndNumbers / line.length;

      if (ratio > 0.7) {
        count++;
      }
    }

    return count;
  };

  // Helper: Check for unusual Unicode symbols
  const hasUnicodeAbuse = (content: string): boolean => {
    // Unusual symbols
    const unicodeSymbols = /[■□▪▫●○◆◇★☆►◄▲▼λ∑∏∫≈≠±]/g;
    if (unicodeSymbols.test(content)) return true;

    // Separator abuse (repeated more than 5 times)
    if (/(\|{3,})|(\={5,})|(\-{5,})/g.test(content)) return true;

    return false;
  };

  // Helper: Find repeated nonsense patterns
  const findRepeatedNonsense = (content: string): number => {
    // Look for patterns like "word - gibberish" repeated
    const patternRegex = /\b\w+\s*-\s*[^a-zA-Z\s]{10,}/g;
    const matches = content.match(patternRegex);

    if (!matches || matches.length < 2) return 0;

    // Count unique vs total (if many similar patterns, likely gibberish)
    const uniquePatterns = new Set(matches);
    const repetitionRatio = matches.length / uniquePatterns.size;

    return repetitionRatio >= 2 ? Math.floor(repetitionRatio) : 0;
  };

  // Check 1: Random character blocks
  const randomBlocks = findRandomBlocks(text);
  if (randomBlocks >= 3) {
    score += randomBlocks * 3;
    details.push(`${randomBlocks} random character blocks detected`);
  }

  // Check 2: Overall special char ratio
  const specialCharRatio = calculateSpecialCharRatio(text);
  if (specialCharRatio > 0.35) {
    score += 8;
    details.push(`High special character ratio: ${(specialCharRatio * 100).toFixed(1)}%`);
  }

  // Check 3: No-vowel sequences (gibberish)
  const noVowelSequences = findNoVowelSequences(text);
  if (noVowelSequences >= 5) {
    score += noVowelSequences * 2;
    details.push(`${noVowelSequences} gibberish sequences (no vowels) found`);
  }

  // Check 4: Symbol-heavy lines
  const symbolLines = countSymbolHeavyLines(text);
  if (symbolLines >= 10) {
    score += symbolLines;
    details.push(`${symbolLines} lines with excessive symbols (>70%)`);
  }

  // Check 5: Unicode abuse
  if (hasUnicodeAbuse(text)) {
    score += 5;
    details.push("Unusual Unicode symbols or separator abuse detected");
  }

  // Check 6: Repeated nonsense patterns
  const repeatedPatterns = findRepeatedNonsense(text);
  if (repeatedPatterns >= 3) {
    score += repeatedPatterns * 3;
    details.push(`${repeatedPatterns} repeated nonsense patterns found`);
  }

  const isGibberish = score >= threshold;
  const reason = isGibberish
    ? `Resume contains obvious gibberish or attack payload (score: ${score}/${threshold} threshold). This appears to be malicious content. Details: ${details.join('; ')}`
    : "";

  return { isGibberish, score, reason, details };
}

/**
 * Sanitizes resume content by removing suspicious patterns while preserving legitimate content
 * Implements dual-layer security: reject critical attacks, sanitize borderline cases
 * @param text - Extracted resume text
 * @returns Sanitization result with cleaned text and safety status
 */
export function sanitizeResumeContent(text: string): {
  sanitized: string;
  removedPatterns: string[];
  isSafe: boolean;
  criticalIssue?: string;
} {
  if (!text || text.trim().length === 0) {
    return { sanitized: text, removedPatterns: [], isSafe: true };
  }

  const lines = text.split('\n');
  const removedPatterns: string[] = [];
  const cleanLines: string[] = [];
  let criticalCount = 0;

  // CRITICAL patterns that trigger immediate rejection
  const criticalPatterns = [
    { pattern: /\[INST\]/i, desc: "Chat template instruction marker" },
    { pattern: /\[\/INST\]/i, desc: "Chat template instruction marker" },
    { pattern: /<\|im_start\|>/i, desc: "Chat template marker" },
    { pattern: /<\|im_end\|>/i, desc: "Chat template marker" },
    { pattern: /<\|system\|>/i, desc: "System role marker" },
    { pattern: /<\|user\|>/i, desc: "User role marker" },
    { pattern: /<\|assistant\|>/i, desc: "Assistant role marker" },
    { pattern: /<!--[\s\S]*?(ignore|override|injection|instruction|system|prompt)[\s\S]*?-->/i, desc: "HTML comment injection" },
    { pattern: /base64\s*:\s*[A-Za-z0-9+/]{20,}={0,2}/i, desc: "Base64 payload injection" },
    { pattern: /(?:<!--|\{|\[)\s*(?:override|action|instruction)\s*[:=]\s*["']?(true|print|ignore|execute)/i, desc: "Structured override injection" },
  ];

  // SUSPICIOUS patterns that trigger line removal (sanitization)
  const suspiciousPatterns = [
    { pattern: /\bignore\s+(previous|all|above|prior)\s+(instructions|prompts|commands|rules)\b/i, desc: "Instruction override attempt" },
    { pattern: /\bdisregard\s+(previous|all|above|prior)\s+(instructions|prompts|commands|rules)\b/i, desc: "Instruction override attempt" },
    { pattern: /\bforget\s+(everything|all|previous|prior)\s+(instructions|prompts|commands)?\b/i, desc: "Memory manipulation attempt" },
    { pattern: /\byou\s+are\s+now\s+(a|an|the)\b/i, desc: "Role manipulation attempt" },
    { pattern: /\byour\s+new\s+(role|task|instruction|job)\s+(is|:)\b/i, desc: "Role manipulation attempt" },
    { pattern: /\bact\s+as\s+if\s+you\s+(are|were)\b/i, desc: "Identity manipulation" },
    { pattern: /^system\s*:/im, desc: "System prompt injection" },
    { pattern: /\n\s*system\s*:/i, desc: "System prompt injection" },
    { pattern: /\breturn\s+all\s+(data|information|content)\b/i, desc: "Output manipulation" },
    { pattern: /\bprint\s+(all|everything|your)\s+(instructions|prompts|rules)\b/i, desc: "Instruction extraction attempt" },
    { pattern: /\bshow\s+(me\s+)?(your|the)\s+(instructions|prompts|system\s+message)\b/i, desc: "Instruction extraction attempt" },
  ];

  // Legitimate contexts that should NOT be flagged
  const legitimateContexts = [
    /system\s+(architecture|design|engineer|administrator|analyst|developer|admin|integration)/i,
    /instruction\s+(manual|guide|document|set|materials|booklet)/i,
    /role\s*:\s*[\w\s]+(engineer|manager|developer|architect|analyst|scientist|administrator)/i,
    /ignore\s+(case|whitespace|errors|warnings|files)/i, // Programming contexts
    /forget\s+(password|username|credentials)/i, // Security contexts
  ];

  // Check for critical patterns first (document-wide)
  for (const { pattern, desc } of criticalPatterns) {
    const matches = text.match(new RegExp(pattern.source, 'gi'));
    if (matches && matches.length > 0) {
      return {
        sanitized: "",
        removedPatterns: [],
        isSafe: false,
        criticalIssue: `Critical security issue detected: ${desc}. Resume contains chat template markers or LLM control sequences.`,
      };
    }
  }

  // Check for patterns at document start (first 300 characters) - likely malicious
  const documentStart = text.substring(0, 300);
  for (const { pattern } of suspiciousPatterns) {
    if (pattern.test(documentStart)) {
      criticalCount++;
      if (criticalCount >= 2) {
        return {
          sanitized: "",
          removedPatterns: [],
          isSafe: false,
          criticalIssue: `Critical security issue detected: Multiple injection patterns found at document start. This appears to be a deliberate attack.`,
        };
      }
    }
  }

  // Process line by line for sanitization
  let totalSuspiciousMatches = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let shouldRemoveLine = false;
    let matchedPattern: string | null = null;

    // Check each suspicious pattern
    for (const { pattern, desc } of suspiciousPatterns) {
      if (pattern.test(line)) {
        // Check if this is legitimate technical context
        const isLegitimate = legitimateContexts.some(legitPattern => legitPattern.test(line));

        if (!isLegitimate) {
          // Also check surrounding context (2 lines before and after)
          const contextStart = Math.max(0, i - 2);
          const contextEnd = Math.min(lines.length, i + 3);
          const surroundingContext = lines.slice(contextStart, contextEnd).join('\n');

          const hasLegitimateContext = legitimateContexts.some(legitPattern =>
            legitPattern.test(surroundingContext)
          );

          if (!hasLegitimateContext) {
            shouldRemoveLine = true;
            matchedPattern = desc;
            totalSuspiciousMatches++;
            break;
          }
        }
      }
    }

    // If too many suspicious patterns found, reject entire resume
    if (totalSuspiciousMatches >= 5) {
      return {
        sanitized: "",
        removedPatterns: [],
        isSafe: false,
        criticalIssue: `Critical security issue detected: Multiple injection attempts found (${totalSuspiciousMatches} patterns). This appears to be a deliberate attack.`,
      };
    }

    if (shouldRemoveLine) {
      removedPatterns.push(`Line ${i + 1}: ${matchedPattern} (content hidden)`);
    } else {
      cleanLines.push(line);
    }
  }

  return {
    sanitized: cleanLines.join('\n'),
    removedPatterns,
    isSafe: true,
  };
}
