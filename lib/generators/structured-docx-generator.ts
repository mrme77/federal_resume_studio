/**
 * Deterministic DOCX Generator for Federal Resumes
 * Uses structured data + fixed template (salomone format)
 * Follows Federal Professional Two-Page Resume Requirements
 */

import {
  Document,
  Paragraph,
  AlignmentType,
  convertInchesToTwip,
  Packer,
  BorderStyle,
} from "docx";
import type { StructuredResume } from "../types/resume-types";

// Salomone Resume Formatting Specifications
const FONT = "Calibri";
const COLOR_HEADER = "000000"; // Black for name and headers
const COLOR_TEXT = "000000"; // Black for all text

// Font sizes (in half-points: multiply by 2)
const SIZE_NAME = 28; // 14pt
const SIZE_CONTACT = 20; // 10pt
const SIZE_SECTION_HEADER = 24; // 12pt (can adjust to 28 for 14pt if needed)
const SIZE_BODY = 20; // 10pt

// Margins
const MARGIN_INCHES = 0.5;

// Spacing (in twips: 1/20 of a point)
const SPACING_AFTER_NAME = 80; // Small space after name
const SPACING_AFTER_CONTACT = 120; // Space after contact before first section
const SPACING_BEFORE_SECTION = 160; // Space before section headers
const SPACING_AFTER_SECTION_HEADER = 80; // Space after section headers
const SPACING_AFTER_PARAGRAPH = 40; // Space after regular paragraphs
const SPACING_AFTER_BULLET = 40; // Space after bullet points

export interface StructuredDocxResult {
  success: boolean;
  buffer?: Buffer;
  error?: string;
}

/**
 * Generates Federal-compliant DOCX from structured resume data
 * @param data - Structured resume data from LLM
 * @returns Buffer containing the formatted DOCX file
 */
export async function generateStructuredResume(
  data: StructuredResume
): Promise<StructuredDocxResult> {
  try {
    const paragraphs: Paragraph[] = [];

    // ===========================================================================
    // HEADER SECTION (Name + Contact Info)
    // ===========================================================================

    // Line 1: NAME (centered, all caps, bold)
    paragraphs.push(
      new Paragraph({
        text: data.contactInfo.name.toUpperCase(),
        alignment: AlignmentType.CENTER,
        spacing: { after: SPACING_AFTER_NAME },
        style: "Normal",
        run: {
          font: FONT,
          size: SIZE_NAME,
          bold: true,
          color: COLOR_HEADER,
        },
      })
    );

    // Line 2: Contact Info (centered)
    // Format: Phone: XXX-XXX-XXXX | Email: email@example.com | City, State ZIP
    // Always include all fields, use placeholders if missing
    const contactParts: string[] = [];
    contactParts.push(`Phone: ${data.contactInfo.phone || "[PHONE]"}`);
    contactParts.push(`Email: ${data.contactInfo.email || "[EMAIL]"}`);
    contactParts.push(data.contactInfo.location || "[LOCATION]");

    paragraphs.push(
      new Paragraph({
        text: contactParts.join(" | "),
        alignment: AlignmentType.CENTER,
        spacing: { after: SPACING_AFTER_CONTACT },
        border: {
          bottom: {
            color: "000000",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        style: "Normal",
        run: {
          font: FONT,
          size: SIZE_CONTACT,
          color: COLOR_TEXT,
        },
      })
    );

    // ===========================================================================
    // CITIZENSHIP & ELIGIBILITY SECTION
    // ===========================================================================

    paragraphs.push(createSectionHeader("CITIZENSHIP & ELIGIBILITY"));

    // Citizenship (use bullet)
    paragraphs.push(createBulletParagraph(data.citizenship.citizenship));

    // Veterans Preference (optional, use bullet)
    if (data.citizenship.veteransPreference) {
      paragraphs.push(createBulletParagraph(data.citizenship.veteransPreference));
    }

    // Security Clearance (optional, use bullet)
    if (data.citizenship.securityClearance) {
      paragraphs.push(createBulletParagraph(data.citizenship.securityClearance));
    }

    // ===========================================================================
    // WORK EXPERIENCE SECTION
    // ===========================================================================

    paragraphs.push(createSectionHeader("WORK EXPERIENCE"));

    for (const job of data.workExperience) {
      // Line 1: Title, Grade, Hours
      // Format: "Data Scientist, GS-13-1560, 40 hrs/week"
      const jobLine1Parts: string[] = [job.title];
      if (job.grade) {
        jobLine1Parts.push(job.grade);
      }
      jobLine1Parts.push(job.hoursPerWeek);

      paragraphs.push(
        new Paragraph({
          text: jobLine1Parts.join(", "),
          alignment: AlignmentType.LEFT,
          spacing: { after: 0 }, // No space, next line immediately follows
          style: "Normal",
          run: {
            font: FONT,
            size: SIZE_BODY,
            color: COLOR_TEXT,
          },
        })
      );

      // Line 2: Organization, Location
      // Format: "USTRANSCOM/JDPAC, Scott AB, Illinois"
      paragraphs.push(
        new Paragraph({
          text: `${job.organization}, ${job.location}`,
          alignment: AlignmentType.LEFT,
          spacing: { after: 0 }, // No space, next line immediately follows
          style: "Normal",
          run: {
            font: FONT,
            size: SIZE_BODY,
            color: COLOR_TEXT,
          },
        })
      );

      // Line 3: Dates
      // Format: "12/2024 - Present"
      paragraphs.push(
        new Paragraph({
          text: `${job.startDate} - ${job.endDate}`,
          alignment: AlignmentType.LEFT,
          spacing: { after: SPACING_AFTER_PARAGRAPH },
          style: "Normal",
          run: {
            font: FONT,
            size: SIZE_BODY,
            color: COLOR_TEXT,
          },
        })
      );

      // Responsibilities (bullet points)
      for (const responsibility of job.responsibilities) {
        paragraphs.push(createBulletParagraph(responsibility));
      }

      // Extra space after last bullet before next job
      if (data.workExperience.indexOf(job) < data.workExperience.length - 1) {
        paragraphs.push(
          new Paragraph({
            text: "",
            spacing: { after: SPACING_AFTER_PARAGRAPH },
          })
        );
      }
    }

    // ===========================================================================
    // EDUCATION SECTION
    // ===========================================================================

    if (data.education && data.education.length > 0) {
      paragraphs.push(createSectionHeader("EDUCATION"));

      for (const edu of data.education) {
        // Format: "MS Data Analytics, Northwest Missouri State University, Maryville, MO, 12/2023"
        const eduParts: string[] = [
          edu.degree,
          edu.institution,
          edu.location,
          edu.graduationDate,
        ];
        if (edu.gpa) {
          eduParts.push(`GPA: ${edu.gpa}`);
        }

        paragraphs.push(createBulletParagraph(eduParts.join(", ")));
      }
    }

    // ===========================================================================
    // CERTIFICATIONS & TRAINING SECTION
    // ===========================================================================

    if (
      (data.certifications && data.certifications.length > 0) ||
      (data.training && data.training.length > 0)
    ) {
      paragraphs.push(createSectionHeader("CERTIFICATIONS & TRAINING"));

      // Certifications (use bullets)
      if (data.certifications) {
        for (const cert of data.certifications) {
          const certParts: string[] = [cert.name, cert.issuer, cert.dateObtained];
          if (cert.expirationDate) {
            certParts.push(`(expires ${cert.expirationDate})`);
          } else if (cert.dateObtained.includes("expected")) {
            // Handle expected dates like in salomone resume
          }

          paragraphs.push(createBulletParagraph(certParts.join(", ")));
        }
      }

      // Training courses (use bullets)
      if (data.training) {
        for (const course of data.training) {
          paragraphs.push(createBulletParagraph(course));
        }
      }
    }

    // ===========================================================================
    // SKILLS SECTION (Optional)
    // ===========================================================================

    if (data.skills) {
      const hasSkills =
        (data.skills.technical && data.skills.technical.length > 0) ||
        (data.skills.languages && data.skills.languages.length > 0) ||
        (data.skills.other && data.skills.other.length > 0);

      if (hasSkills) {
        paragraphs.push(createSectionHeader("SKILLS"));

        // Technical Skills (use bullet)
        if (data.skills.technical && data.skills.technical.length > 0) {
          paragraphs.push(
            createBulletParagraph(`Technical Skills: ${data.skills.technical.join(", ")}`)
          );
        }

        // Language Skills (use bullet)
        if (data.skills.languages && data.skills.languages.length > 0) {
          paragraphs.push(
            createBulletParagraph(`Languages: ${data.skills.languages.join(", ")}`)
          );
        }

        // Other Skills (use bullet)
        if (data.skills.other && data.skills.other.length > 0) {
          paragraphs.push(createBulletParagraph(`Other: ${data.skills.other.join(", ")}`));
        }
      }
    }

    // ===========================================================================
    // REFERENCES LINE (Always at the end)
    // ===========================================================================

    // Add empty line for separation
    paragraphs.push(
      new Paragraph({
        text: "",
        spacing: { after: SPACING_AFTER_PARAGRAPH },
      })
    );

    paragraphs.push(
      new Paragraph({
        text: "References and additional work history available upon request",
        alignment: AlignmentType.CENTER,
        spacing: { before: SPACING_AFTER_PARAGRAPH, after: 0 },
        style: "Normal",
        run: {
          font: FONT,
          size: SIZE_BODY,
          italics: true,
          color: COLOR_TEXT,
        },
      })
    );

    // ===========================================================================
    // CREATE DOCUMENT
    // ===========================================================================

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(MARGIN_INCHES),
                bottom: convertInchesToTwip(MARGIN_INCHES),
                left: convertInchesToTwip(MARGIN_INCHES),
                right: convertInchesToTwip(MARGIN_INCHES),
              },
            },
          },
          children: paragraphs,
        },
      ],
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    return {
      success: true,
      buffer: Buffer.from(buffer),
    };
  } catch (error) {
    console.error("Error generating structured DOCX:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Creates a section header paragraph (e.g., "WORK EXPERIENCE")
 * With bottom border line for visual separation
 */
function createSectionHeader(text: string): Paragraph {
  return new Paragraph({
    text: text.toUpperCase(),
    alignment: AlignmentType.LEFT,
    spacing: {
      before: SPACING_BEFORE_SECTION,
      after: SPACING_AFTER_SECTION_HEADER,
    },
    border: {
      bottom: {
        color: "000000",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    style: "Normal",
    run: {
      font: FONT,
      size: SIZE_SECTION_HEADER,
      bold: true,
      color: COLOR_HEADER,
    },
  });
}



/**
 * Creates a bullet point paragraph with hanging indent
 */
function createBulletParagraph(text: string): Paragraph {
  return new Paragraph({
    text: text,
    alignment: AlignmentType.LEFT,
    bullet: {
      level: 0,
    },
    spacing: { after: SPACING_AFTER_BULLET },
    indent: {
      left: convertInchesToTwip(0.25), // Indent bullet
      hanging: convertInchesToTwip(0.25), // Hanging indent for text
    },
    style: "Normal",
    run: {
      font: FONT,
      size: SIZE_BODY,
      color: COLOR_TEXT,
    },
  });
}
