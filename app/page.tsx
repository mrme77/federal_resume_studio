"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";

import { ProcessingStatus } from "@/components/ProcessingStatus";
import { Disclaimer } from "@/components/Disclaimer";
import { ModeSelector, ProcessingMode } from "@/components/ModeSelector";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { MismatchDialog } from "@/components/MismatchDialog";
import { RejectionDialog, RejectionType } from "@/components/RejectionDialog";
import { GitHubCallout } from "@/components/GitHubStarButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, Upload, Sparkles, Download, ExternalLink } from "lucide-react";

type ProcessingState = "idle" | "processing" | "success" | "error";
type AppStep = "mode-selection" | "file-upload";

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

  // File processing state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingState>("idle");
  const [processingStage, setProcessingStage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [generatedResume, setGeneratedResume] = useState<Blob | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showGitHubCallout, setShowGitHubCallout] = useState<boolean>(false);

  const handleModeSelect = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    // Reset job description if switching from tailored to standard
    if (mode === "standard") {
      setJobDescription("");
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
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    setProcessingStatus("idle");
    setError("");
    setGeneratedResume(null);
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
      if (processingMode === "tailored" && jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }

      setProcessingStage("Uploading and processing file...");

      const response = await fetch("/api/process", {
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
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Mismatch response
        const data = await response.json();
        if (data.mismatch) {
          console.log("Mismatch detected:", data.reason);
          setMismatchReason(data.reason);
          setShowMismatchDialog(true);
          setProcessingStatus("idle");
          setProgress(0);
          return;
        }
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

  const canContinue = processingMode === "standard" || (processingMode === "tailored" && jobDescription.trim().length >= 50);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-gradient-to-b from-primary/5 via-background/95 to-background backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Federal Resume Studio
              </h1>
            </div>
            <p className="text-md text-muted-foreground font-medium">
              AI Powered Federally-Compliant Resume Generation {processingMode === "tailored" && "& Job Tailoring"}
            </p>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Mode Selection Step */}
        {currentStep === "mode-selection" && (
          <>
            <ModeSelector
              selectedMode={processingMode}
              onModeSelect={handleModeSelect}
            />

            {/* Search Federal Jobs Button */}
            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                size="lg"
                asChild
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
              >
                <a href="https://www.usajobs.gov/" target="_blank" rel="noopener noreferrer" aria-label="Search Federal Jobs on USAJobs.gov (opens in new tab)">
                  Search Federal Jobs
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>

            {/* Disclaimer - Show upfront before user makes commitment */}
            <div className="mb-8">
              <Disclaimer />
            </div>

            {/* Job Description Input (only shown if tailored mode selected) */}
            {processingMode === "tailored" && (
              <JobDescriptionInput
                value={jobDescription}
                onChange={setJobDescription}
              />
            )}

            {/* Continue Button */}
            {processingMode && (
              <div className="flex justify-center mb-8">
                <Button
                  size="lg"
                  onClick={handleContinueToUpload}
                  disabled={!canContinue}
                  className="px-8"
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

        {/* Search Federal Jobs Button */}
        <div className="flex justify-center mb-8">
          <Button
            variant="outline"
            size="lg"
            asChild
            className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300"
          >
            <a href="https://www.usajobs.gov/" target="_blank" rel="noopener noreferrer" aria-label="Search Federal Jobs on USAJobs.gov (opens in new tab)">
              Search Federal Jobs
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
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
              Reformat Resume
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
              <Button size="lg" onClick={handleDownload}>
                Download Resume
              </Button>
              <Button variant="outline" onClick={handleReset}>
                Start Over
              </Button>
            </div>

            {/* Optional Donation Callout */}
            {showGitHubCallout && (
              <GitHubCallout onClose={() => setShowGitHubCallout(false)} />
            )}
          </>
        )}

            {/* Disclaimer */}
            <div className="mt-12">
              <Disclaimer />
            </div>
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
    </div>
  );
}
