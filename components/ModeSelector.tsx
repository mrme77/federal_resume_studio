"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileCheck, Target } from "lucide-react";

export type ProcessingMode = "standard" | "tailored";

interface ModeSelectorProps {
  selectedMode: ProcessingMode | null;
  onModeSelect: (mode: ProcessingMode) => void;
}

export function ModeSelector({ selectedMode, onModeSelect }: ModeSelectorProps) {
  const handleKeyDown = (mode: ProcessingMode, e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onModeSelect(mode);
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Choose Your Resume Format
        </h2>
        <p className="text-muted-foreground">
          Select how you want your federal resume processed
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto" role="group" aria-label="Resume format selection">
        {/* Standard Mode Card */}
        <Card
          className={`p-6 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg border-2 ${
            selectedMode === "standard"
              ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg shadow-primary/20"
              : "border-primary/20 bg-gradient-to-br from-card to-primary/5 hover:border-primary/40"
          }`}
          onClick={() => onModeSelect("standard")}
          onKeyDown={(e) => handleKeyDown("standard", e)}
          role="button"
          tabIndex={0}
          aria-pressed={selectedMode === "standard"}
          aria-label="Standard Federal Compliance mode"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`p-4 rounded-full mb-4 ${
                selectedMode === "standard"
                  ? "bg-primary/20"
                  : "bg-primary/10"
              }`}
            >
              <FileCheck
                className={`h-8 w-8 ${
                  selectedMode === "standard"
                    ? "text-primary"
                    : "text-primary/70"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-primary">
              Standard Federal Compliance
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Transform your resume into a federally compliant format with proper structure, formatting, and required details.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>✓ Federal format compliance</div>
              <div>✓ 2-page professional layout</div>
              <div>✓ Federal guidelines adherence</div>
            </div>
          </div>
        </Card>

        {/* Tailored Mode Card */}
        <Card
          className={`p-6 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg border-2 ${
            selectedMode === "tailored"
              ? "border-accent bg-gradient-to-br from-accent/10 to-accent/5 shadow-lg shadow-accent/20"
              : "border-accent/20 bg-gradient-to-br from-card to-accent/5 hover:border-accent/40"
          }`}
          onClick={() => onModeSelect("tailored")}
          onKeyDown={(e) => handleKeyDown("tailored", e)}
          role="button"
          tabIndex={0}
          aria-pressed={selectedMode === "tailored"}
          aria-label="Tailored to Specific Job mode"
        >
          <div className="flex flex-col items-center text-center">
            <div
              className={`p-4 rounded-full mb-4 ${
                selectedMode === "tailored"
                  ? "bg-accent/20"
                  : "bg-accent/10"
              }`}
            >
              <Target
                className={`h-8 w-8 ${
                  selectedMode === "tailored"
                    ? "text-accent"
                    : "text-accent/70"
                }`}
              />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-accent">
              Tailored to Specific Job
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Optimize your resume for a specific position by aligning your experience with the job requirements and duties.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>✓ Job-specific optimization</div>
              <div>✓ Aligned accomplishments</div>
              <div>✓ Emphasized relevant experience</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
