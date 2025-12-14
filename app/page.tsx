"use client";

import { useState, useRef, useEffect } from "react";
import { FileUploader } from "@/components/FileUploader";

import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ModeSelector, ProcessingMode } from "@/components/ModeSelector";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AssessmentResult } from "@/components/AssessmentResult";
import { MismatchDialog } from "@/components/MismatchDialog";
import { RejectionDialog, RejectionType } from "@/components/RejectionDialog";
import { StarryBackground } from "@/components/StarryBackground";
import { GitHubCallout } from "@/components/GitHubStarButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, Upload, Sparkles, Download, ExternalLink, Globe, AlertTriangle } from "lucide-react";
import { InfoDialog } from "@/components/InfoDialog";

type ProcessingState = "idle" | "processing" | "success" | "error";

type AppStep = "mode-selection" | "file-upload";

interface AssessmentData {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendations: string[];
}

export default function Home() {
  // Mode selection state
  const [currentStep, setCurrentStep] = useState<AppStep>("mode-selection");
  const [processingMode, setProcessingMode] = useState<ProcessingMode | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");

  // Mismatch dialog state
  const [showMismatchDialog, setShowMismatchDialog] = useState<boolean>(false);
  const [mismatchReason, setMismatchReason] = useState<string>("");

  // Rejection dialog state
  const [showRejectionDialog, setShowRejectionDialog] = useState<boolean>(false);
  const [rejectionType, setRejectionType] = useState<RejectionType | null>(null);
  const [rejectionMessage, setRejectionMessage] = useState<string>("");

  // Info dialog states
  const [showPrivacyDialog, setShowPrivacyDialog] = useState<boolean>(false);
  const [showLegalDialog, setShowLegalDialog] = useState<boolean>(false);

  // File processing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingState>("idle");
  const [processingStage, setProcessingStage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [generatedResume, setGeneratedResume] = useState<Blob | null>(null);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentData | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showGitHubCallout, setShowGitHubCallout] = useState<boolean>(false);
  const [flashContinueButton, setFlashContinueButton] = useState<boolean>(false);

  // Refs for auto-scrolling
  const jobDescriptionRef = useRef<HTMLDivElement>(null);
  const continueButtonRef = useRef<HTMLDivElement>(null);

  // Auto-scroll and flash effects when mode is selected
  useEffect(() => {
    if ((processingMode === "tailored" || processingMode === "assessment") && jobDescriptionRef.current) {
      // Scroll to job description input for tailored or assessment mode
      setTimeout(() => {
        jobDescriptionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    } else if (processingMode === "standard" && continueButtonRef.current) {
      // Scroll to continue button for standard mode
      setTimeout(() => {
        continueButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        // Flash the button
        setFlashContinueButton(true);
        setTimeout(() => {
          setFlashContinueButton(false);
        }, 3000); // Flash for 3 seconds
      }, 100);
    }
  }, [processingMode]);

  const handleModeSelect = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    // Reset job description if switching from tailored to standard
    if (mode === "standard") {
      setJobDescription("");
    } else if ((mode === "tailored" || mode === "assessment") && jobDescriptionRef.current) {
      // Scroll to job description input for tailored or assessment mode
      setJobDescription(""); // Clear job description when selecting tailored/assessment mode
      setTimeout(() => {
        jobDescriptionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }, 100);
    }
  };

  const handleContinueToUpload = () => {
    setCurrentStep("file-upload");
  };

  const handleBackToModeSelection = () => {
    setCurrentStep("mode-selection");
    setSelectedFile(null);
    setProcessingStatus("idle");
    setError("");
    setGeneratedResume(null);
    setAssessmentResult(null);
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setProcessingStatus("idle");
    setError("");
    setGeneratedResume(null);
    setAssessmentResult(null);
  };

  const handleProcess = async () => {
    if (!selectedFile) return;

    setProcessingStatus("processing");
    setError("");
    setGeneratedResume(null);
    setProgress(0);
    setIsUploading(true);

    // Simulate smooth progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Add job description if in tailored mode
      // Add job description if in tailored mode or assessment mode
      if ((processingMode === "tailored" || processingMode === "assessment") && jobDescription) {
        formData.append("jobDescription", jobDescription.trim());
      }

      setProcessingStage(processingMode === "assessment" ? "Analyzing resume against job description..." : "Uploading and processing file...");

      const endpoint = processingMode === "assessment" ? "/api/assess" : "/api/process";

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      setIsUploading(false);
      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();

        // Check if this is a rejection with a specific type
        if (errorData.rejectionType) {
          console.log("Rejection detected:", errorData.rejectionType);
          setRejectionType(errorData.rejectionType);
          setRejectionMessage(errorData.error || "Resume validation failed");
          setShowRejectionDialog(true);
          setProcessingStatus("idle");
          setProgress(0);
          return;
        }

        throw new Error(errorData.error || "Failed to process resume");
      }

      // Check if response is JSON (mismatch) or blob (success)
      // Check if response is JSON (mismatch or assessment result) or blob (generated resume)
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        // Check for mismatch first
        if (data.mismatch) {
          console.log("Mismatch detected:", data.reason);
          setMismatchReason(data.reason);
          setShowMismatchDialog(true);
          setProcessingStatus("idle");
          setProgress(0);
          return;
        }

        // If assessment mode, this is the result
        if (processingMode === "assessment") {
          setAssessmentResult(data);
        }
      } else {
        // It's a blob (generated resume)
        const blob = await response.blob();
        setGeneratedResume(blob);
      }

      setProgress(100);
      setProcessingStatus("success");
      if (processingMode !== "assessment") {
        setShowGitHubCallout(true);
      }
    } catch (err) {
      clearInterval(interval);
      setProcessingStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleDownload = () => {
    if (!generatedResume) return;
    const url = window.URL.createObjectURL(generatedResume);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reformatted_resume_${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setCurrentStep("mode-selection");
    setProcessingMode(null);
    setJobDescription("");
    setSelectedFile(null);
    setProcessingStatus("idle");
    setError("");
    setGeneratedResume(null);
    setAssessmentResult(null);
    setProgress(0);
    setShowMismatchDialog(false);
    setMismatchReason("");
    setShowRejectionDialog(false);
    setRejectionType(null);
    setRejectionMessage("");
    setShowGitHubCallout(false);
  };

  const handleRejectionClose = () => {
    setShowRejectionDialog(false);
    setRejectionType(null);
    setRejectionMessage("");
    handleReset();
  };

  const handleMismatchContinueStandard = async () => {
    // Close dialog and reprocess without job description (standard mode)
    setShowMismatchDialog(false);
    setMismatchReason("");

    if (!selectedFile) return;

    setProcessingStatus("processing");
    setError("");
    setGeneratedResume(null);
    setProgress(0);
    setIsUploading(true);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 1;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      // Intentionally NOT including job description - standard mode

      setProcessingStage("Processing in standard federal compliance mode...");

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      setIsUploading(false);
      clearInterval(interval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to process resume");
      }

      const blob = await response.blob();
      setGeneratedResume(blob);
      setProgress(100);
      setProcessingStatus("success");
      setShowGitHubCallout(true);
    } catch (err) {
      clearInterval(interval);
      setProcessingStatus("error");
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleMismatchCancel = () => {
    setShowMismatchDialog(false);
    setMismatchReason("");
    handleReset();
  };

  const canContinue = processingMode === "standard" || ((processingMode === "tailored" || processingMode === "assessment") && jobDescription.trim().length >= 10);

  return (
    <div className="min-h-screen bg-background relative">
      <StarryBackground />
      <header className="sticky top-0 z-50 bg-gradient-to-b from-primary/5 via-background/95 to-background backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center relative">
            {/* Header Title Area */}
            <div className="relative flex items-center justify-center gap-4 mb-8">
              {/* Shining Aura Effect */}
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-3xl rounded-full opacity-70 animate-pulse -z-10" aria-hidden="true" />

              <div className="p-3 bg-primary/10 rounded-2xl backdrop-blur-sm border border-primary/10">
                <Shield className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent drop-shadow-sm pb-1">
                Federal Resume Studio
              </h1>
            </div>


            {/* Header Utility Buttons */}
            <div className="flex flex-col items-center gap-4">
              {/* Row 1: External Links */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2 border-primary/20 hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-xs h-8"
                >
                  <a href="https://www.usajobs.gov/" target="_blank" rel="noopener noreferrer" aria-label="Search Federal Jobs on USAJobs.gov (opens in new tab)" className="hover:text-white">
                    Search Federal Jobs
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="gap-2 border-primary/20 hover:border-primary/80 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 text-xs h-8"
                >
                  <a href="https://mrme77.github.io/#" target="_blank" rel="noopener noreferrer" aria-label="Visit Developer Website (opens in new tab)" className="hover:text-white">
                    Visit Developer Website
                    <Globe className="h-3 w-3" aria-hidden="true" />
                  </a>
                </Button>
              </div>

              {/* Row 2: Privacy & Legal (with enhanced hover effects) */}
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivacyDialog(true)}
                  className="gap-2 text-xs h-8 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors duration-300"
                >
                  <Shield className="h-3 w-3" />
                  Privacy & Security
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowLegalDialog(true)}
                  className="gap-2 text-xs h-8 text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-colors duration-300"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Legal & Usage Notice
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl relative z-10">
        {/* Mode Selection Step */}
        {currentStep === "mode-selection" && (
          <>
            <ModeSelector
              selectedMode={processingMode}
              onModeSelect={handleModeSelect}
            />

            {/* Job Description Input (only shown if tailored or assessment mode selected) */}
            {(processingMode === "tailored" || processingMode === "assessment") && (
              <div ref={jobDescriptionRef}>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </div>
            )}

            {/* Continue Button */}
            {processingMode && (
              <div ref={continueButtonRef} className="flex justify-center mb-8">
                <Button
                  size="lg"
                  onClick={handleContinueToUpload}
                  disabled={!canContinue}
                  className={`px-8 transition-all duration-300 ${flashContinueButton
                    ? "animate-pulse ring-4 ring-primary/50 shadow-lg shadow-primary/50"
                    : ""
                    }`}
                >
                  Continue to Upload Resume
                </Button>
              </div>
            )}
          </>
        )}

        {/* File Upload Step */}
        {currentStep === "file-upload" && (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToModeSelection}
                className="gap-2"
                disabled={processingStatus === "processing"}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Mode Selection
              </Button>
            </div>

            {/* How it works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
              <Card className="p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-primary/20 bg-gradient-to-br from-card to-primary/5 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Upload className="h-10 w-10 text-primary group-hover:animate-bounce" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Upload Your Resume</h3>
                <p className="text-muted-foreground text-sm">Upload your current federal resume in PDF or Word format.</p>
              </Card>
              <Card className="p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-accent/20 border-accent/20 bg-gradient-to-br from-card to-accent/5 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative p-4 bg-gradient-to-br from-accent/20 to-accent/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-10 w-10 text-accent group-hover:animate-pulse" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-accent">AI Reformatting</h3>
                <p className="text-muted-foreground text-sm">Our AI analyzes and reformats it using federal guidelines.</p>
              </Card>
              <Card className="p-6 transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-primary/20 border-primary/20 bg-gradient-to-br from-card to-primary/5 group">
                <div className="flex items-center justify-center mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Download className="h-10 w-10 text-primary group-hover:animate-bounce" />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-primary">Download Document</h3>
                <p className="text-muted-foreground text-sm">Download your professional, federally compliant 2-page resume.</p>
              </Card>
            </div>

            {/* File Uploader */}
            <div className="mb-8">
              <FileUploader onFileSelect={handleFileSelect} disabled={processingStatus === "processing"} />
            </div>

            {/* Process Button */}
            {selectedFile && processingStatus === "idle" && (
              <div className="flex justify-center mb-8">
                <Button size="lg" onClick={handleProcess} className="px-8" disabled={isUploading}>
                  {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {processingMode === "assessment" ? "Assess Resume" : "Reformat Resume"}
                </Button>
              </div>
            )}

            {/* Processing Status */}
            {processingStatus !== "idle" && (
              <div className="mb-8">
                <ProcessingStatus status={processingStatus} stage={processingStage} progress={progress} error={error} />
              </div>
            )}

            {/* Action Buttons */}
            {processingStatus === "error" && (
              <div className="flex justify-center mb-8">
                <Button variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
              </div>
            )}
            {processingStatus === "success" && (
              <>
                <div className="flex justify-center gap-4 mb-8">
                  {processingMode !== "assessment" && (
                    <Button size="lg" onClick={handleDownload}>
                      Download Resume
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleReset}>
                    {processingMode === "assessment" ? "Assess Another" : "Start Over"}
                  </Button>
                </div>

                {/* Assessment Result */}
                {processingMode === "assessment" && assessmentResult && (
                  <div className="mb-8">
                    <AssessmentResult result={assessmentResult} />
                  </div>
                )}

                {/* Optional Donation Callout */}
                {showGitHubCallout && (
                  <GitHubCallout onClose={() => setShowGitHubCallout(false)} />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Mismatch Dialog */}
      <MismatchDialog
        isOpen={showMismatchDialog}
        reason={mismatchReason}
        onContinueStandard={handleMismatchContinueStandard}
        onCancel={handleMismatchCancel}
      />

      {/* Rejection Dialog */}
      <RejectionDialog
        isOpen={showRejectionDialog}
        rejectionType={rejectionType}
        message={rejectionMessage}
        onClose={handleRejectionClose}
      />

      {/* Privacy & Security Dialog */}
      <InfoDialog
        isOpen={showPrivacyDialog}
        onClose={() => setShowPrivacyDialog(false)}
        title="Privacy & Security"
        icon={Shield}
        iconColorClass="text-primary"
      >
        <div className="space-y-4 text-sm text-muted-foreground p-2">
          <p className="flex gap-2">
            <span className="font-bold text-foreground min-w-[30px]">•</span>
            <span><strong>Zero Data Retention (ZDR):</strong> Your resume data is NOT retained by AI providers. We configure all API calls to ensure no data is stored for training or history.</span>
          </p>
          <p className="flex gap-2">
            <span className="font-bold text-foreground min-w-[30px]">•</span>
            <span><strong>HTTPS Encryption:</strong> All data is encrypted in transit using industry-standard protocols.</span>
          </p>
          <p className="flex gap-2">
            <span className="font-bold text-foreground min-w-[30px]">•</span>
            <span><strong>No Persistent Storage:</strong> Your resume files are processed in memory and never saved to a database or file system on our servers.</span>
          </p>
          <p className="flex gap-2">
            <span className="font-bold text-foreground min-w-[30px]">•</span>
            <span><strong>Stateless Operation:</strong> No user accounts or authentication are required to use this tool, ensuring complete anonymity.</span>
          </p>
        </div>
      </InfoDialog>

      {/* Legal & Usage Notice Dialog */}
      <InfoDialog
        isOpen={showLegalDialog}
        onClose={() => setShowLegalDialog(false)}
        title="Legal & Usage Notice"
        icon={AlertTriangle}
        iconColorClass="text-orange-500" // Different accent color for distinction
      >
        <div className="space-y-4 text-sm text-muted-foreground p-2">
          <p className="bg-muted p-4 rounded-md text-foreground">
            <strong>Use at Your Own Risk:</strong> The developers make no warranties regarding the accuracy,
            reliability, or suitability of the generated content.
          </p>

          <div>
            <p className="font-semibold text-foreground mb-2">You are responsible for:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Verifying all information in the generated resume.</li>
              <li>Ensuring compliance with all agency-specific application requirements.</li>
              <li>Reviewing and editing all AI-generated content before submission.</li>
            </ul>
          </div>

          <div className="border-t pt-4 mt-2">
            <p className="text-xs">
              <strong>Important Notice:</strong> This application is not affiliated with, endorsed by, or authorized by
              the U.S. Federal Government or any of its agencies. Its outputs do not represent any official federal
              guidance or policy.
            </p>
          </div>
        </div>
      </InfoDialog>

    </div>
  );
}
