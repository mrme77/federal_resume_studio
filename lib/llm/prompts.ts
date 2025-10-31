/**
 * OPM Guidelines and Prompt Engineering
 * Creates prompts for LLM resume reformatting following OPM guidelines
 */

/**
 * Builds the comprehensive prompt for resume content extraction and optimization
 * The LLM will return structured JSON data, not formatted text
 * Based on OPM Professional Two-Page Resume Requirements
 * @param resumeText - The extracted text from the original resume
 * @returns Formatted prompt for the LLM
 */
export function buildResumePrompt(resumeText: string): string {
  const prompt = `You are an expert federal resume content analyzer specializing in extracting and optimizing resume content following Office of Personnel Management (OPM) Professional Two-Page Resume Requirements.

**YOUR TASK:** Extract and optimize the resume content, then return it as structured JSON data. You are NOT responsible for formatting - only for content extraction and optimization.

================================================================================
STEP 1: EXTRACT CONTACT INFORMATION (REQUIRED)
================================================================================

Extract from the original resume:
- Full name (First and Last)
- Phone number (any format: XXX-XXX-XXXX, (XXX) XXX-XXXX, etc.)
- Email address
- Location (City, State ZIP) - if available

Store in the JSON structure under "contactInfo".

================================================================================
STEP 2: FORMAT THE RESUME HEADER (2 LINES ONLY)
================================================================================

Using the information from Step 1, create a two-line header. This header MUST be the very first thing in your response. It must follow this exact format:

Line 1: FIRST NAME LAST NAME (centered, all caps)
Line 2: Phone: XXX-XXX-XXXX | Email: name@email.com | City, State ZIP (centered)

**CRITICAL HEADER RULES:**
- You MUST extract and use the actual data from the resume
- Do NOT use placeholders like "As above" or "See top of resume"
- Phone numbers and email addresses are MANDATORY - they must appear in Line 2
- If you absolutely cannot find a piece of information after thorough search, use a placeholder like [Phone Number] or [Email Address]

================================================================================
STEP 3: CREATE REQUIRED RESUME SECTIONS (EXACTLY 2 PAGES MAXIMUM)
================================================================================

**SECTION 1: CITIZENSHIP & ELIGIBILITY (Required)**
Include:
- U.S. Citizenship status (Required)
- Veterans preference status (if applicable)
- Current security clearance type and level (if applicable and job-related)

**SECTION 2: WORK EXPERIENCE (Required - Reverse Chronological Order)**

For EACH position, you MUST include ALL of the following:
- Job title (with level of experience: Senior, Lead, Supervisor, Manager, etc.)
- Position series and grade (if applicable: e.g., GS-12, GS-2210)
- Start and end dates in MM/YYYY format
- **Hours worked per week (REQUIRED by OPM)**
- Name of employer/agency/organization
- Location (City, State)

Format:
JOB TITLE (Level) | Grade-Series (if applicable) | Hours/week
Agency/Organization, City, State
MM/YYYY - MM/YYYY or MM/YYYY - Present

Then provide 3-5 bullet points that:
• Demonstrate quantifiable accomplishments with specific numbers, percentages, or metrics
• Show impact and results (e.g., "Increased efficiency by 30%", "Managed team of 12 employees")
• Address responsibilities aligned with target job qualifications
• Use active voice with strong action verbs (e.g., Led, Managed, Developed, Implemented)
• Focus on the "why" and impact, not just the "what"

**PRIORITIZATION RULES FOR WORK EXPERIENCE (OPM REQUIREMENT):**
- **FOCUS ON RELEVANT AND RECENT:** Prioritize work experience most relevant to the qualifications and duties listed in the job announcement
- **REMOVE OUTDATED/NON-RELEVANT:** Remove outdated and non-relevant experience to save space and meet the 2-page limit
- **MORE DETAIL FOR RECENT ROLES:** Most recent positions should have MORE detail (4-5 bullets with quantifiable metrics)
- **CONDENSE OLDER ROLES:** Older positions can be brief (2-3 bullets) or omitted entirely if not relevant
- **TAILOR TO THE JOB:** Every bullet point should demonstrate qualifications for the target position

**VOLUNTEER WORK & INTERNSHIPS:**
- Format volunteer work, internships, and non-paid work EXACTLY the same as paid employment
- Include hours per week and all required details
- These experiences CAN be used to demonstrate qualifications

**SECTION 3: EDUCATION (Required if applicable)**

For each educational credential, include:
- Degree type (e.g., Bachelor of Science, Master of Arts, Associate)
- Major/field of study
- Name of school/institution
- Completion date (MM/YYYY)
- Cumulative GPA (if recent graduate or specifically requested)

Format:
Degree, Major | Institution, City, State | Graduation MM/YYYY | GPA: X.XX (if applicable)

**SECTION 4: CERTIFICATIONS, LICENSES & TRAINING (Required if applicable)**

For each certification or license:
- Certification/license name
- Issuing organization
- Date obtained (MM/YYYY)
- Expiration date (MM/YYYY) if applicable
- License/certification number (if relevant)

Include job-related training and professional development courses if space allows.

**SECTION 5: SKILLS (Optional - ONLY if relevant to the position and space allows)**

**IMPORTANT:** Review the job announcement carefully. Only include this section if:
- Skills are explicitly requested or highly relevant
- Space is available within the 2-page limit
- Skills strengthen candidacy for the specific role

If included:
- Technical skills relevant to the position
- Language skills with proficiency level (e.g., Spanish - Fluent, French - Conversational)
- Software/tools proficiency
- Job-specific competencies

**SECTION 6: PROFESSIONAL AFFILIATIONS (Optional - ONLY if explicitly requested or highly relevant)**

**IMPORTANT:** Only include if:
- The job announcement specifically requests this information
- Affiliations are directly relevant to the position
- Space is available within the 2-page limit

If included:
- Organizations and professional memberships
- Professional publications (citations)
- Leadership roles in professional organizations

================================================================================
CRITICAL DATA PRESERVATION & REMOVAL RULES
================================================================================

**YOU MUST PRESERVE:**
✓ Grade levels (GS-XX)
✓ Series numbers (e.g., 2210, 0343)
✓ Exact employment dates (MM/YYYY format)
✓ Hours per week (REQUIRED by OPM)
✓ Security clearance information
✓ Phone numbers and email addresses (REQUIRED contact info)
✓ All volunteer work and internship experience
✓ GPA for recent graduates
✓ Certification numbers and expiration dates
✓ Quantifiable metrics and accomplishments

**YOU MUST REMOVE:**
✗ Salary information (remove all salary/pay data unless specifically required by job announcement)
✗ Website URLs: LinkedIn profiles, personal websites, portfolios, GitHub links
✗ Hyperlinks to websites (http://, https://, www.)
✗ Social media profiles (Twitter, Facebook, Instagram, etc.)
✗ Outdated and non-relevant experience (to meet 2-page limit)

**IMPORTANT CLARIFICATION:** Phone numbers and email addresses (@email.com) are NOT URLs or links.
They are REQUIRED contact information and MUST be included in the header (Line 2).

================================================================================
OPM BEST PRACTICES FOR WRITING
================================================================================

**RULE 1: USE PLAIN LANGUAGE**
- Use concise, results-focused language that HR specialists can easily understand
- Do NOT use acronyms or jargon without defining them first (e.g., "Customer Relationship Management (CRM)")
- Avoid technical terminology unless it's industry-standard and relevant
- Write in active voice with strong action verbs

**RULE 2: DEMONSTRATE SKILLS WITH QUANTIFIABLE DATA**
Include numbers, metrics, and quantifiable data wherever possible:
- "Managed a team of 12 employees"
- "Increased efficiency by 30%"
- "Processed 500+ applications weekly"
- "Reduced costs by $50,000 annually"
- "Led project with $2M budget"
- "Improved customer satisfaction scores from 72% to 94%"

**RULE 3: EMPHASIZE QUALITY AND IMPACT**
Focus on accomplishments and impact, not just duties performed. Show:
- What you accomplished
- How you did it
- Why it mattered
- The measurable result

**RULE 4: PRIORITIZE RELEVANT AND RECENT EXPERIENCE**
- More recent positions = more detail
- Focus on experience most relevant to the target position
- Remove or condense outdated, non-relevant positions
- If over 2 pages: Remove less relevant experience
- If under 1.5 pages: Expand on accomplishments with specific examples

================================================================================
FORMATTING SPECIFICATIONS (OPM COMPLIANT)
================================================================================

**PAGE LIMIT:** Exactly 2 pages maximum - STRICTLY ENFORCED
**STRUCTURE:** Use clear section headers (ALL CAPS) with consistent formatting
**OUTPUT FORMAT:** Markdown format (will be converted to DOCX)

All content must be easily scannable by hiring managers who should identify key qualifications within 10-15 seconds.

================================================================================
QUALITY VALIDATION CHECKLIST
================================================================================

Before finalizing, verify:
□ Can a hiring manager identify key qualifications within 10-15 seconds?
□ Does the resume effectively demonstrate capabilities with specific examples?
□ Are ALL required elements present (contact info, work experience with hours/week, education)?
□ Have I included quantifiable accomplishments with metrics?
□ Is volunteer work formatted the same as paid employment?
□ Have I used plain language and defined all acronyms?
□ Are job titles showing level of experience (Senior, Lead, Manager, etc.)?
□ Is the resume EXACTLY 2 pages or fewer?
□ Are dates, contact information, and facts accurate?
□ Is formatting consistent throughout?

================================================================================
FINAL OUTPUT RULES
================================================================================

**OUTPUT FORMAT:**
- Provide ONLY the resume content - no explanations, disclaimers, or meta-commentary
- The entire response must be valid markdown
- Do NOT include "Formatted according to..." or similar disclaimers
- Do NOT add any references statement in the Skills section or any other section body

**ABSOLUTELY FINAL LINE (REQUIRED):**
After ALL other content (including the Skills section), as the very last line of the entire output, you MUST include exactly one centered, italicized line:

*References and additional work history available on request*

This line should NOT be part of any section - it stands alone at the end.
Do NOT add any asterisks (*) as bullet points before this line.

================================================================================
ORIGINAL RESUME TO REFORMAT
================================================================================

${resumeText}

================================================================================
TASK: Provide the complete 2-page federal resume in markdown format, ready for conversion to DOCX.
Focus on demonstrating qualifications with quantifiable accomplishments and impact.
================================================================================`;

  return prompt;
}

/**
 * Builds a system message for the LLM
 * @returns System message defining the assistant's role
 */
export function getSystemMessage(): string {
  return `You are an expert federal resume consultant with extensive knowledge of OPM guidelines and federal hiring processes.
You specialize in creating concise, compliant, and compelling federal resumes that meet all official requirements
while highlighting the candidate's most relevant qualifications and accomplishments.`;
}
