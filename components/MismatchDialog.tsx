"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileCheck, X } from "lucide-react";

interface MismatchDialogProps {
  isOpen: boolean;
  reason: string;
  onContinueStandard: () => void;
  onCancel: () => void;
}

export function MismatchDialog({
  isOpen,
  reason,
  onContinueStandard,
  onCancel,
}: MismatchDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-2xl mx-4 border-2 border-orange-500/50 shadow-2xl">
        <CardContent className="pt-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-orange-500/10 rounded-full flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-orange-500 mb-2">
                Resume-Job Mismatch Detected
              </h2>
              <p className="text-muted-foreground">
                Our AI analysis indicates your resume may not align well with the target position.
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
              Analysis:
            </h3>
            <p className="text-foreground">{reason}</p>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
              What would you like to do?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Continue with Standard Federal Format</p>
                  <p className="text-xs text-muted-foreground">
                    We'll optimize your resume for federal compliance without tailoring to this specific job.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                <X className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-sm mb-1">Cancel and Start Over</p>
                  <p className="text-xs text-muted-foreground">
                    Return to mode selection to choose a different job or approach.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onCancel}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Cancel and Start Over
            </Button>
            <Button
              onClick={onContinueStandard}
              className="gap-2"
            >
              <FileCheck className="h-4 w-4" />
              Continue with Standard Format
            </Button>
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              This analysis is provided as guidance. You may still apply if you believe your skills are transferable.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
