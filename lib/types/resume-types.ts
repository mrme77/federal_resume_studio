/**
 * TypeScript interfaces for structured resume data
 * Based on Federal Professional Two-Page Resume Requirements
 * Following salomone_resume.docx format
 */

export interface ContactInformation {
  name: string; // Full name in "FIRST LAST" format (will be uppercase in output)
  email: string;
  phone: string; // Format: XXX-XXX-XXXX or similar
  location?: string; // City, State ZIP (optional)
}

export interface CitizenshipEligibility {
  citizenship: string; // e.g., "U.S. Citizenship: Yes"
  veteransPreference?: string; // e.g., "Veterans Preference: 5-point"
  securityClearance?: string; // e.g., "Security Clearance: SECRET"
}

export interface WorkExperience {
  title: string; // e.g., "Data Scientist"
  grade?: string; // e.g., "GS-13-1560" (optional for non-federal)
  hoursPerWeek: string; // e.g., "40 hrs/week"
  organization: string; // e.g., "USTRANSCOM/JDPAC"
  location: string; // e.g., "Scott AB, Illinois"
  startDate: string; // Format: MM/YYYY
  endDate: string; // Format: MM/YYYY or "Present"
  responsibilities: string[]; // Array of bullet points (3-5 recommended)
}

export interface Education {
  degree: string; // e.g., "MS Data Analytics"
  institution: string; // e.g., "Northwest Missouri State University"
  location: string; // e.g., "Maryville, MO"
  graduationDate: string; // Format: MM/YYYY
  gpa?: string; // Optional, e.g., "3.85"
}

export interface Certification {
  name: string; // e.g., "Data+ Certification"
  issuer: string; // e.g., "CompTIA"
  dateObtained: string; // Format: MM/YYYY
  expirationDate?: string; // Format: MM/YYYY (optional)
  certificationNumber?: string; // Optional
}

export interface Skills {
  technical?: string[]; // Technical skills
  languages?: string[]; // Language skills with proficiency
  other?: string[]; // Other relevant skills
}

/**
 * Complete structured resume data
 * This is what the LLM should return as JSON
 */
export interface StructuredResume {
  contactInfo: ContactInformation;
  citizenship: CitizenshipEligibility;
  workExperience: WorkExperience[];
  education: Education[];
  certifications?: Certification[]; // Optional
  training?: string[]; // Optional: simple list of training courses
  skills?: Skills; // Optional
}

/**
 * LLM Response wrapper
 */
export interface LLMResumeResponse {
  success: boolean;
  data?: StructuredResume;
  error?: string;
  rawResponse?: string; // For debugging
}
