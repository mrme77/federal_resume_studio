"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { validateFileSize } from "@/lib/utils/security-validators";

interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileSelect, disabled }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    // Reset error state
    setValidationError("");

    // Validate file size
    const sizeValidation = validateFileSize(file.size, 5); // 5MB limit
    if (!sizeValidation.isValid) {
      setValidationError(sizeValidation.reason || "File validation failed");
      return false;
    }

    // Validate file type
    const isValidType =
      file.type.includes("pdf") ||
      file.type.includes("word") ||
      file.name.endsWith(".docx") ||
      file.name.endsWith(".doc");

    if (!isValidType) {
      setValidationError("Please upload a PDF or Word document (.pdf, .docx, .doc)");
      return false;
    }

    // File is valid
    setSelectedFile(file);
    onFileSelect(file);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [onFileSelect]
  );

  const handleClear = () => {
    setSelectedFile(null);
    setValidationError("");
    onFileSelect(null);
    if(inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Resume</CardTitle>
        <CardDescription>Upload your current federal resume (PDF or Word format)</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`p-8 text-center transition-colors block ${
            isDragging ? "bg-primary/5" : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload resume file. Drag and drop or click to browse. Accepts PDF and Word documents up to 5MB"
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !disabled) {
              e.preventDefault();
              handleClick();
            }
          }}
        >
          <input
            ref={inputRef}
            id="file-upload"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.doc"
            onChange={handleFileChange}
            disabled={disabled}
            aria-label="Resume file input"
            aria-describedby="file-requirements"
          />
          {selectedFile ? (
            <div className="flex items-center justify-between" role="status" aria-live="polite">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" aria-hidden="true" />
                <div className="text-left">
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent onClick from firing
                    handleClear();
                  }}
                  aria-label="Remove selected file"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Drop your resume here</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
              <Button variant="secondary" className="mt-4 pointer-events-none" aria-hidden="true">
                Select File
              </Button>
              <p id="file-requirements" className="text-xs text-muted-foreground mt-4">
                Supported: PDF, DOCX, DOC (Max 5MB, ~30 pages)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                For best results, keep resume under 5 pages
              </p>
            </>
          )}
        </div>

        {/* Validation Error */}
        {validationError && (
          <div
            className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-destructive">{validationError}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}