"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Info, AlertCircle } from "lucide-react";
import { validateJobDescription } from "@/lib/utils/security-validators";
import { useState, useEffect } from "react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function JobDescriptionInput({ value, onChange, onValidationChange }: JobDescriptionInputProps) {
  const [validationError, setValidationError] = useState<string>("");
  const charCount = value.length;
  const minChars = 50; // Minimum required characters
  const hasMinimumContent = charCount >= minChars;

  // Validate on value change (with debounce for better UX)
  useEffect(() => {
    if (value.length === 0) {
      setValidationError("");
      onValidationChange?.(true);
      return;
    }

    const timeoutId = setTimeout(() => {
      const validation = validateJobDescription(value);
      if (!validation.isValid) {
        setValidationError(validation.reason || "Invalid job description");
        onValidationChange?.(false);
      } else {
        setValidationError("");
        onValidationChange?.(true);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [value, onValidationChange]);

  return (
    <div className="mb-8">
      <Card className="border-accent/20 bg-gradient-to-br from-card to-accent/5">
        <CardContent className="pt-6">
          <div className="mb-4">
            <Label htmlFor="job-description" className="text-lg font-semibold text-accent">
              Job Description
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Paste the job title, duties, and requirements from the job announcement
            </p>
          </div>

          <textarea
            id="job-description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Example:&#10;&#10;Job Title: Data Scientist (GS-1560-13)&#10;&#10;Duties:&#10;- Uses expert knowledge of data analytics and statistical analysis&#10;- Builds analytical and econometric models for various problems&#10;- Generates actionable insights applying advanced statistical techniques&#10;- Collaborates with team members to communicate findings to stakeholders&#10;..."
            className="w-full min-h-[300px] p-4 rounded-md border border-accent/30 bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-y text-sm font-mono"
            aria-describedby="job-desc-hint job-desc-count"
            aria-required="true"
            aria-invalid={!!validationError}
          />

          <div className="flex items-start justify-between mt-3">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Info className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
              <p id="job-desc-hint">
                Include the job title, grade level, and key duties/responsibilities.
                The more detail you provide, the better the tailoring will be. Minimum 50 characters required.
              </p>
            </div>
            <div id="job-desc-count" className="text-xs text-muted-foreground ml-4 flex-shrink-0" aria-live="polite">
              <span className={hasMinimumContent ? "text-success font-medium" : ""}>
                {charCount} / {minChars} characters
              </span>
              {!hasMinimumContent && charCount > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({minChars - charCount} more needed)
                </span>
              )}
            </div>
          </div>

          {/* Validation Error */}
          {validationError && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2" role="alert" aria-live="assertive">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-destructive">{validationError}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
