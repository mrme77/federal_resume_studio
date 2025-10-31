/**
 * Professional DOCX Generator for Federal Resumes
 * Creates OPM-compliant Word documents with proper federal resume styling
 * Follows OPM Professional Two-Page Resume Requirements
 */

import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
} from "docx";

// Color scheme - professional blues and grays
const COLOR_HEADER = "1F3864"; // Dark blue RGB(31, 56, 100)
const COLOR_TITLE = "2C3E50"; // Dark gray-blue RGB(44, 62, 80)
const COLOR_TEXT = "212121"; // Almost black RGB(33, 33, 33)

// Federal Resume Formatting Specifications
const RESUME_FONT = "Calibri"; // Professional font
const RESUME_NAME_SIZE = 28; // 14pt for name (more compact)
const RESUME_CONTACT_SIZE = 18; // 9pt for contact info
const RESUME_SECTION_HEADER_SIZE = 24; // 12pt for section headers (more compact)
const RESUME_BODY_TEXT_SIZE = 18; // 9pt for body text (more compact, still readable)
const RESUME_MARGIN_INCHES = 0.5; // 0.5 inches minimum

export interface DocxGenerationResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

/**
 * Generates a formatted DOCX buffer from markdown content
 * @param markdownContent - The markdown text to convert
 * @returns Buffer containing the DOCX file
 */
export async function generateFormattedResume(markdownContent: string): Promise<DocxGenerationResult> {
  try {
    const paragraphs = parseMarkdownToParagraphs(markdownContent);

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(RESUME_MARGIN_INCHES),
                bottom: convertInchesToTwip(RESUME_MARGIN_INCHES),
                left: convertInchesToTwip(RESUME_MARGIN_INCHES),
                right: convertInchesToTwip(RESUME_MARGIN_INCHES),
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate buffer
    const { Packer } = await import("docx");
    const buffer = await Packer.toBuffer(doc);

    return {
      success: true,
      buffer: Buffer.from(buffer),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error generating DOCX",
    };
  }
}

/**
 * Parses markdown content into docx Paragraph objects
 */
function parseMarkdownToParagraphs(markdownText: string): Paragraph[] {
  const lines = markdownText.split("\n");
  const paragraphs: Paragraph[] = [];

  let isFirstLine = true;
  let justAddedName = false;
  let inContactSection = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      justAddedName = false;
      continue;
    }

    // Skip disclaimer/meta-commentary lines
    if (shouldSkipLine(line)) {
      continue;
    }

    // Remove markdown code blocks
    if (line.startsWith("```")) {
      continue;
    }

    // Detect name (first substantial line)
    if (isFirstLine && line.length > 3 && !line.startsWith("#")) {
      const cleanName = cleanMarkdown(line);
      if (!cleanName || cleanName.toUpperCase() === cleanName || cleanName.split(" ").length <= 4) {
        paragraphs.push(createNameParagraph(cleanName));
        isFirstLine = false;
        justAddedName = true;
        continue;
      }
    }

    // Detect contact info right after name (email/phone)
    if (justAddedName && (line.includes("@") || looksLikePhone(line) || line.includes("|"))) {
      const contactText = cleanMarkdown(line).replace(/\|/g, " • ");
      paragraphs.push(createContactParagraph(contactText));
      continue;
    }

    // Detect section headers
    if (isSectionHeader(line)) {
      const headerText = cleanMarkdown(line);
      paragraphs.push(createSectionHeaderParagraph(headerText.toUpperCase()));
      justAddedName = false;

      // Check if next section is contact-related
      if (/(CONTACT|CITIZENSHIP|ELIGIBILITY)/i.test(headerText.toUpperCase())) {
        inContactSection = true;
      } else {
        inContactSection = false;
      }
      continue;
    }

    // Handle contact information in dedicated section
    if (inContactSection && (line.includes("|") || line.includes("@") || looksLikePhone(line))) {
      const contactText = cleanMarkdown(line).replace(/\|/g, " • ");
      paragraphs.push(createContactParagraph(contactText));
      continue;
    }

    // Detect job titles (lines with | separator)
    if (line.includes("|") && !inContactSection) {
      const jobTitle = cleanMarkdown(line);
      paragraphs.push(createJobDetailsParagraph(jobTitle)); // Use job details formatting (not bold)
      continue;
    }

    // Detect bullet points
    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      const bulletText = cleanMarkdown(line.replace(/^[•\-*]\s*/, "")).trim();
      if (bulletText && bulletText.length > 1) {
        paragraphs.push(createBulletParagraph(bulletText));
      }
      continue;
    }

    // Everything else is normal text
    if (!line.startsWith("#")) {
      const normalText = cleanMarkdown(line);
      if (normalText) {
        // Detect job details (dates, salary, etc.)
        if (/[/\$]|GS-|Hours|Salary/.test(normalText)) {
          paragraphs.push(createJobDetailsParagraph(normalText));
        } else {
          paragraphs.push(createNormalParagraph(normalText));
        }
      }
    }
  }

  // Add references line at the end
  paragraphs.push(createReferencesParagraph());

  return paragraphs;
}

/**
 * Helper functions for paragraph creation
 */

function createNameParagraph(name: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 80 }, // Reduced spacing
    children: [
      new TextRun({
        text: name.toUpperCase(),
        font: RESUME_FONT,
        size: RESUME_NAME_SIZE,
        bold: true,
        color: COLOR_HEADER,
      }),
    ],
  });
}

function createContactParagraph(contact: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 40 }, // Reduced spacing
    children: [
      new TextRun({
        text: contact,
        font: RESUME_FONT,
        size: RESUME_CONTACT_SIZE,
        color: COLOR_TEXT,
      }),
    ],
  });
}

function createSectionHeaderParagraph(header: string): Paragraph {
  return new Paragraph({
    spacing: { before: 160, after: 80 }, // Reduced spacing for more compact layout
    children: [
      new TextRun({
        text: header,
        font: RESUME_FONT,
        size: RESUME_SECTION_HEADER_SIZE,
        bold: true,
        color: COLOR_HEADER,
      }),
    ],
  });
}

function createJobDetailsParagraph(details: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT, // Left-aligned
    spacing: { after: 60 }, // Reduced spacing
    children: [
      new TextRun({
        text: details,
        font: RESUME_FONT,
        size: RESUME_BODY_TEXT_SIZE,
        color: COLOR_TEXT,
      }),
    ],
  });
}

function createBulletParagraph(text: string): Paragraph {
  return new Paragraph({
    bullet: {
      level: 0,
    },
    indent: {
      left: convertInchesToTwip(0.25),
      hanging: convertInchesToTwip(0.25),
    },
    spacing: { after: 40 }, // Reduced spacing between bullets
    children: [
      new TextRun({
        text: text,
        font: RESUME_FONT,
        size: RESUME_BODY_TEXT_SIZE,
        color: COLOR_TEXT,
      }),
    ],
  });
}

function createNormalParagraph(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.LEFT, // Left-aligned
    spacing: { after: 60 }, // Reduced spacing
    children: [
      new TextRun({
        text: text,
        font: RESUME_FONT,
        size: RESUME_BODY_TEXT_SIZE,
        color: COLOR_TEXT,
      }),
    ],
  });
}

function createReferencesParagraph(): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 160 }, // Reduced spacing
    children: [
      new TextRun({
        text: "References and additional work history available on request",
        font: RESUME_FONT,
        size: RESUME_BODY_TEXT_SIZE,
        italics: true,
        color: COLOR_TEXT,
      }),
    ],
  });
}

/**
 * Utility functions
 */

function looksLikePhone(line: string): boolean {
  const phonePatterns = [
    /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/, // 618-746-8272 or 618.746.8272
    /\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/, // (618) 746-8272
    /Cell:/i,
    /Phone:/i,
    /Tel:/i,
  ];
  return phonePatterns.some((pattern) => pattern.test(line));
}

function shouldSkipLine(line: string): boolean {
  const lowerLine = line.toLowerCase();

  // Skip disclaimer/meta-commentary and references lines (we add them at the end)
  const skipPhrases = [
    "formatted according to",
    "this resume",
    "opm guidelines",
    "comply with opm",
    "generated with",
    "reformatted",
    "created using",
    "supervisor: not specified",
    "supervisor not specified",
    "references and additional work history available",
    "references available on request",
  ];

  if (skipPhrases.some((phrase) => lowerLine.includes(phrase))) {
    return true;
  }

  // Skip lines with URLs/websites (but not email addresses)
  const urlIndicators = ["http://", "https://", "www.", "linkedin.com", "github.com"];

  if (urlIndicators.some((indicator) => lowerLine.includes(indicator))) {
    return true;
  }

  // Skip lines that are ONLY salary information
  if (lowerLine.includes("salary") && line.includes("$")) {
    if (line.trim().toLowerCase().startsWith("salary")) {
      return true;
    }
  }

  return false;
}

function isSectionHeader(line: string): boolean {
  const cleanLine = line.replace(/^#+\s*/, "").trim();

  // Check if markdown header
  if (line.startsWith("###") || line.startsWith("##")) {
    return true;
  }

  // List of known federal resume section headers (exact matches only)
  const sectionHeaders = [
    "CITIZENSHIP & ELIGIBILITY",
    "CITIZENSHIP AND ELIGIBILITY",
    "WORK EXPERIENCE",
    "EMPLOYMENT HISTORY",
    "EDUCATION",
    "CERTIFICATIONS",
    "CERTIFICATIONS, LICENSES & TRAINING",
    "TRAINING",
    "SKILLS",
    "PROFESSIONAL AFFILIATIONS",
    "PUBLICATIONS",
    "VOLUNTEER EXPERIENCE",
    "REFERENCES AND ADDITIONAL WORK HISTORY AVAILABLE ON REQUEST",
  ];

  // Check if this line exactly matches a known section header
  const upperLine = cleanLine.toUpperCase().trim();
  if (sectionHeaders.includes(upperLine)) {
    return true;
  }

  return false;
}

function cleanMarkdown(text: string): string {
  // Remove headers
  text = text.replace(/^#+\s*/, "");

  // Remove bold/italic/underline formatting (all variations)
  text = text.replace(/\*\*([^*]+)\*\*/g, "$1"); // **bold**
  text = text.replace(/__([^_]+)__/g, "$1");     // __bold__
  text = text.replace(/\*([^*]+)\*/g, "$1");     // *italic*
  text = text.replace(/_([^_]+)_/g, "$1");       // _italic_
  text = text.replace(/~~([^~]+)~~/g, "$1");     // ~~strikethrough~~
  text = text.replace(/<u>([^<]+)<\/u>/gi, "$1"); // <u>underline</u>

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Remove salary information
  text = text.replace(/\|\s*Salary:\s*\$[\d,]+/gi, "");
  text = text.replace(/Salary:\s*\$[\d,]+/gi, "");

  // Clean up extra pipes and spaces
  text = text.replace(/\|\s*\|/g, "|");
  text = text.replace(/\s+\|/g, " |");
  text = text.replace(/\|\s*$/g, "");

  return text.trim();
}
