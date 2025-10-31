/**
 * Federal Resume Compliance Validator
 * Validates reformatted resumes against Federal requirements
 * Based on Federal Professional Two-Page Resume Requirements
 */

export interface ValidationIssue {
  severity: "error" | "warning" | "info";
  category: string;
  message: string;
  location?: string;
}

export interface ValidationResult {
  isCompliant: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  summary: {
    totalChecks: number;
    passed: number;
    warnings: number;
    errors: number;
  };
  sections: {
    contactInfo: boolean;
    citizenship: boolean;
    workExperience: boolean;
    education: boolean;
    certifications: boolean;
    skills: boolean;
  };
}

/**
 * Validates markdown resume content against Federal guidelines
 * @param markdownContent - The markdown formatted resume to validate
 * @returns Detailed validation result with compliance score and issues
 */
export function validateFederalCompliance(markdownContent: string): ValidationResult {
  const issues: ValidationIssue[] = [];
  const sections = {
    contactInfo: false,
    citizenship: false,
    workExperience: false,
    education: false,
    certifications: false,
    skills: false,
  };

  // Normalize content for analysis
  const lines = markdownContent.split("\n");
  const content = markdownContent.toLowerCase();

  // ============================================================================
  // SECTION 1: VALIDATE CONTACT INFORMATION (REQUIRED)
  // ============================================================================

  const contactValidation = validateContactInformation(lines, content);
  issues.push(...contactValidation.issues);
  sections.contactInfo = contactValidation.isValid;

  // ============================================================================
  // SECTION 2: VALIDATE HEADER FORMAT (2 LINES)
  // ============================================================================

  const headerValidation = validateHeaderFormat(lines);
  issues.push(...headerValidation.issues);

  // ============================================================================
  // SECTION 3: VALIDATE REQUIRED SECTIONS
  // ============================================================================

  // Check for Citizenship & Eligibility section
  const citizenshipValidation = validateCitizenshipSection(content);
  issues.push(...citizenshipValidation.issues);
  sections.citizenship = citizenshipValidation.isValid;

  // Check for Work Experience section
  const workExpValidation = validateWorkExperienceSection(lines, content);
  issues.push(...workExpValidation.issues);
  sections.workExperience = workExpValidation.isValid;

  // Check for Education section
  const educationValidation = validateEducationSection(content);
  issues.push(...educationValidation.issues);
  sections.education = educationValidation.isValid;

  // Check for optional sections
  sections.certifications = /certifications?|licenses?|training/i.test(content);
  sections.skills = /\bskills?\b/i.test(content);

  // ============================================================================
  // SECTION 4: VALIDATE WORK EXPERIENCE DETAILS (CRITICAL)
  // ============================================================================

  const workExpDetailsValidation = validateWorkExperienceDetails(lines);
  issues.push(...workExpDetailsValidation.issues);

  // ============================================================================
  // SECTION 5: VALIDATE FORMATTING & LENGTH
  // ============================================================================

  const formattingValidation = validateFormatting(markdownContent, lines);
  issues.push(...formattingValidation.issues);

  // ============================================================================
  // SECTION 6: VALIDATE CONTENT QUALITY
  // ============================================================================

  const contentQualityValidation = validateContentQuality(content, lines);
  issues.push(...contentQualityValidation.issues);

  // ============================================================================
  // SECTION 7: CHECK FOR PROHIBITED CONTENT
  // ============================================================================

  const prohibitedContentValidation = checkProhibitedContent(content);
  issues.push(...prohibitedContentValidation.issues);

  // ============================================================================
  // CALCULATE COMPLIANCE SCORE
  // ============================================================================

  const totalChecks = 20; // Total number of validation checks
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const passed = totalChecks - errors - warnings;

  // Score calculation: Errors are weighted more heavily
  const score = Math.max(0, Math.round(((passed + warnings * 0.5) / totalChecks) * 100));
  const isCompliant = errors === 0 && score >= 80;

  return {
    isCompliant,
    score,
    issues,
    summary: {
      totalChecks,
      passed,
      warnings,
      errors,
    },
    sections,
  };
}

// ============================================================================
// VALIDATION HELPER FUNCTIONS
// ============================================================================

function validateContactInformation(
  lines: string[],
  content: string
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let isValid = true;

  // Check for phone number
  const phonePattern = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4}/;
  if (!phonePattern.test(content)) {
    issues.push({
      severity: "error",
      category: "Contact Information",
      message: "Phone number is missing or improperly formatted. Required format: XXX-XXX-XXXX or (XXX) XXX-XXXX",
      location: "Header",
    });
    isValid = false;
  }

  // Check for email address
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (!emailPattern.test(content)) {
    issues.push({
      severity: "error",
      category: "Contact Information",
      message: "Email address is missing. Required in header line 2.",
      location: "Header",
    });
    isValid = false;
  }

  // Check for location (City, State ZIP)
  const locationPattern = /[A-Z][a-z]+,\s*[A-Z]{2}\s+\d{5}/;
  if (!locationPattern.test(content)) {
    issues.push({
      severity: "warning",
      category: "Contact Information",
      message: "Location (City, State ZIP) may be missing or improperly formatted.",
      location: "Header",
    });
  }

  // Check for name in first line (should be all caps)
  if (lines.length > 0) {
    const firstLine = lines.find((line) => line.trim().length > 0);
    if (firstLine) {
      const name = firstLine.trim();
      if (name !== name.toUpperCase() || name.split(" ").length < 2) {
        issues.push({
          severity: "warning",
          category: "Contact Information",
          message: "Name should be in ALL CAPS with first and last name on Line 1.",
          location: "Header Line 1",
        });
      }
    }
  }

  return { isValid, issues };
}

function validateHeaderFormat(lines: string[]): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // Header should be the first 2 lines (ignoring empty lines)
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length < 2) {
    issues.push({
      severity: "error",
      category: "Header Format",
      message: "Header must contain exactly 2 lines: Line 1 (Name), Line 2 (Contact Info).",
      location: "Header",
    });
  }

  return { issues };
}

function validateCitizenshipSection(
  content: string
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let isValid = true;

  // Check for citizenship section
  if (!/(citizenship|eligibility)/i.test(content)) {
    issues.push({
      severity: "error",
      category: "Required Sections",
      message: "CITIZENSHIP & ELIGIBILITY section is missing. This is required by Federal guidelines.",
      location: "Section 1",
    });
    isValid = false;
  } else {
    // Check for U.S. Citizenship statement
    if (!/u\.?s\.?\s+(citizen|citizenship)/i.test(content)) {
      issues.push({
        severity: "warning",
        category: "Citizenship & Eligibility",
        message: "U.S. Citizenship status should be explicitly stated.",
        location: "Citizenship Section",
      });
    }
  }

  return { isValid, issues };
}

function validateWorkExperienceSection(
  lines: string[],
  content: string
): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let isValid = true;

  // Check for work experience section
  if (!/work\s+experience|employment\s+history/i.test(content)) {
    issues.push({
      severity: "error",
      category: "Required Sections",
      message: "WORK EXPERIENCE section is missing. This is required by Federal guidelines.",
      location: "Section 2",
    });
    isValid = false;
  }

  return { isValid, issues };
}

function validateEducationSection(content: string): { isValid: boolean; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const isValid = true;

  // Check for education section (required if applicable)
  if (!/education/i.test(content)) {
    issues.push({
      severity: "warning",
      category: "Required Sections",
      message: "EDUCATION section is missing. Include if you have educational credentials.",
      location: "Section 3",
    });
    // Not marking as invalid since it's "required if applicable"
  }

  return { isValid, issues };
}

function validateWorkExperienceDetails(lines: string[]): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  let foundHoursPerWeek = false;
  let foundDates = false;
  let jobPositionCount = 0;

  // Date pattern: MM/YYYY
  const datePattern = /\d{1,2}\/\d{4}/;

  // Hours per week pattern
  const hoursPattern = /\d+\s*(hours?|hrs?)\s*(per|\/)\s*week/i;

  for (const line of lines) {
    // Detect job title lines (contain | separator)
    if (line.includes("|") && !line.toLowerCase().includes("email")) {
      jobPositionCount++;
    }

    // Check for hours per week
    if (hoursPattern.test(line)) {
      foundHoursPerWeek = true;
    }

    // Check for dates
    if (datePattern.test(line)) {
      foundDates = true;
    }
  }

  // Hours per week is REQUIRED by Federal guidelines
  if (jobPositionCount > 0 && !foundHoursPerWeek) {
    issues.push({
      severity: "error",
      category: "Work Experience Details",
      message: "Hours worked per week is REQUIRED by Federal guidelines for all positions. Add hours/week to job titles.",
      location: "Work Experience",
    });
  }

  // Dates are required
  if (jobPositionCount > 0 && !foundDates) {
    issues.push({
      severity: "error",
      category: "Work Experience Details",
      message: "Employment dates (MM/YYYY format) are required for all positions.",
      location: "Work Experience",
    });
  }

  // Check for quantifiable accomplishments
  let bulletCount = 0;
  let quantifiableCount = 0;

  for (const line of lines) {
    if (line.trim().startsWith("•") || line.trim().startsWith("-") || line.trim().startsWith("*")) {
      bulletCount++;

      // Check for numbers, percentages, dollar amounts
      if (/\d+[%$]?|\$\d+|[\d,]+\s+(employees|people|users|customers|projects)/i.test(line)) {
        quantifiableCount++;
      }
    }
  }

  if (bulletCount > 0 && quantifiableCount / bulletCount < 0.3) {
    issues.push({
      severity: "warning",
      category: "Content Quality",
      message: "Add more quantifiable accomplishments with specific numbers, percentages, or metrics (e.g., 'Managed 12 employees', 'Increased efficiency by 30%').",
      location: "Work Experience",
    });
  }

  return { issues };
}

function validateFormatting(
  markdownContent: string,
  lines: string[]
): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // Estimate page count (rough approximation: ~40 lines per page)
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);
  const estimatedPages = Math.ceil(nonEmptyLines.length / 40);

  if (estimatedPages > 2) {
    issues.push({
      severity: "error",
      category: "Formatting",
      message: `Resume appears to exceed 2 pages (estimated ${estimatedPages} pages). Federal guidelines require exactly 2 pages maximum.`,
      location: "Overall Document",
    });
  }

  // Check for section headers (should be ALL CAPS)
  const sectionHeaders = lines.filter(
    (line) => line.trim().length > 0 && line.trim() === line.trim().toUpperCase() && line.trim().length > 5
  );

  if (sectionHeaders.length < 3) {
    issues.push({
      severity: "warning",
      category: "Formatting",
      message: "Use clear ALL CAPS section headers (e.g., WORK EXPERIENCE, EDUCATION, SKILLS).",
      location: "Section Headers",
    });
  }

  // Check for references line at the end
  if (!/references.*additional.*work.*history.*available.*request/i.test(markdownContent)) {
    issues.push({
      severity: "info",
      category: "Formatting",
      message: "Consider adding final line: 'References and additional work history available on request'",
      location: "End of Document",
    });
  }

  return { issues };
}

function validateContentQuality(content: string, lines: string[]): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // Check for undefined acronyms (basic check)
  const potentialAcronyms = content.match(/\b[A-Z]{2,6}\b/g) || [];
  const uniqueAcronyms = new Set(potentialAcronyms);

  // Common acronyms that don't need definition
  const commonAcronyms = new Set(["USA", "US", "GS", "IT", "HR", "PM", "BA", "BS", "MS", "MA", "PHD", "MBA"]);

  const undefinedAcronyms = Array.from(uniqueAcronyms).filter(
    (acronym) => !commonAcronyms.has(acronym) && !content.includes(`${acronym} (`) && !content.includes(`(${acronym})`)
  );

  if (undefinedAcronyms.length > 5) {
    issues.push({
      severity: "warning",
      category: "Content Quality",
      message: "Define acronyms on first use (e.g., 'Customer Relationship Management (CRM)'). Federal guidelines require plain language.",
      location: "Throughout Document",
    });
  }

  // Check for active voice (basic heuristic: look for -ed past tense verbs)
  const passiveIndicators = content.match(/was\s+\w+ed|were\s+\w+ed|been\s+\w+ed/g) || [];
  const totalSentences = lines.filter((line) => line.includes(".")).length;

  if (passiveIndicators.length > totalSentences * 0.2) {
    issues.push({
      severity: "info",
      category: "Content Quality",
      message: "Use active voice with strong action verbs (e.g., 'Led team' instead of 'Team was led').",
      location: "Throughout Document",
    });
  }

  return { issues };
}

function checkProhibitedContent(content: string): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  // Check for salary information (should be removed unless required)
  if (/salary:\s*\$|pay:\s*\$/i.test(content)) {
    issues.push({
      severity: "warning",
      category: "Prohibited Content",
      message: "Salary information detected. Federal guidelines typically require removal unless specifically requested by job announcement.",
      location: "Work Experience",
    });
  }

  // Check for URLs (except email)
  const urlPattern = /https?:\/\/|www\./i;
  if (urlPattern.test(content)) {
    issues.push({
      severity: "error",
      category: "Prohibited Content",
      message: "Website URLs detected (LinkedIn, GitHub, personal sites). Federal guidelines require removal of all URLs.",
      location: "Throughout Document",
    });
  }

  // Check for social media mentions
  const socialMediaPattern = /linkedin|twitter|facebook|instagram|github\.com/i;
  if (socialMediaPattern.test(content)) {
    issues.push({
      severity: "error",
      category: "Prohibited Content",
      message: "Social media profiles or links detected. These must be removed per Federal guidelines.",
      location: "Contact Information or Throughout",
    });
  }

  return { issues };
}

/**
 * Generates a human-readable validation report
 * @param result - The validation result
 * @returns Formatted string report
 */
export function generateValidationReport(result: ValidationResult): string {
  const { isCompliant, score, issues, summary, sections } = result;

  let report = "================================================================================\n";
  report += "FEDERAL RESUME COMPLIANCE VALIDATION REPORT\n";
  report += "================================================================================\n\n";

  // Overall compliance status
  report += `Overall Compliance: ${isCompliant ? "✓ COMPLIANT" : "✗ NON-COMPLIANT"}\n`;
  report += `Compliance Score: ${score}/100\n\n`;

  // Summary statistics
  report += `Total Checks: ${summary.totalChecks}\n`;
  report += `Passed: ${summary.passed} | Warnings: ${summary.warnings} | Errors: ${summary.errors}\n\n`;

  // Section checklist
  report += "================================================================================\n";
  report += "REQUIRED SECTIONS CHECKLIST\n";
  report += "================================================================================\n";
  report += `${sections.contactInfo ? "✓" : "✗"} Contact Information (Name, Phone, Email, Location)\n`;
  report += `${sections.citizenship ? "✓" : "✗"} Citizenship & Eligibility\n`;
  report += `${sections.workExperience ? "✓" : "✗"} Work Experience\n`;
  report += `${sections.education ? "✓" : "✗"} Education\n`;
  report += `${sections.certifications ? "✓" : "○"} Certifications & Training (optional)\n`;
  report += `${sections.skills ? "✓" : "○"} Skills (optional)\n\n`;

  // Issues breakdown
  if (issues.length > 0) {
    report += "================================================================================\n";
    report += "ISSUES DETECTED\n";
    report += "================================================================================\n\n";

    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");
    const info = issues.filter((i) => i.severity === "info");

    if (errors.length > 0) {
      report += `ERRORS (${errors.length}) - Must be fixed:\n`;
      errors.forEach((issue, index) => {
        report += `${index + 1}. [${issue.category}] ${issue.message}`;
        if (issue.location) report += ` (${issue.location})`;
        report += "\n";
      });
      report += "\n";
    }

    if (warnings.length > 0) {
      report += `WARNINGS (${warnings.length}) - Should be addressed:\n`;
      warnings.forEach((issue, index) => {
        report += `${index + 1}. [${issue.category}] ${issue.message}`;
        if (issue.location) report += ` (${issue.location})`;
        report += "\n";
      });
      report += "\n";
    }

    if (info.length > 0) {
      report += `INFO (${info.length}) - Recommendations:\n`;
      info.forEach((issue, index) => {
        report += `${index + 1}. [${issue.category}] ${issue.message}`;
        if (issue.location) report += ` (${issue.location})`;
        report += "\n";
      });
      report += "\n";
    }
  } else {
    report += "No issues detected. Resume meets Federal guidelines!\n\n";
  }

  report += "================================================================================\n";
  report += "END OF VALIDATION REPORT\n";
  report += "================================================================================\n";

  return report;
}

/**
 * Quick compliance check - returns boolean indicating if resume is Federal compliant
 * @param markdownContent - The markdown formatted resume to check
 * @returns True if compliant, false otherwise
 */
export function isFederalCompliant(markdownContent: string): boolean {
  const result = validateFederalCompliance(markdownContent);
  return result.isCompliant;
}
