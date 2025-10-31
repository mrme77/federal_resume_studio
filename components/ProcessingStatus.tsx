"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ProcessingStatusProps {
  status: "idle" | "processing" | "success" | "error";
  stage?: string;
  progress?: number;
  error?: string;
}

export function ProcessingStatus({ status, stage, progress = 0, error }: ProcessingStatusProps) {
  if (status === "idle") {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {status === "processing" && <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />}
          {status === "success" && <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />}
          {status === "error" && <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />}
          Processing Status
        </CardTitle>
        <CardDescription>
          {status === "processing" && "Reformatting your resume..."}
          {status === "success" && "Resume reformatted successfully!"}
          {status === "error" && "An error occurred"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "processing" && (
          <>
            <div className="space-y-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-live="polite">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground" aria-live="polite">{stage}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" aria-hidden="true" />
            </div>

            <div className="flex flex-wrap gap-2" role="status" aria-live="polite" aria-label="Processing steps">
              <Badge variant={progress >= 25 ? "default" : "outline"} aria-label={`Extracting text ${progress >= 25 ? "completed" : "pending"}`}>Extracting text</Badge>
              <Badge variant={progress >= 50 ? "default" : "outline"} aria-label={`Analyzing content ${progress >= 50 ? "completed" : "pending"}`}>Analyzing content</Badge>
              <Badge variant={progress >= 75 ? "default" : "outline"} aria-label={`Reformatting ${progress >= 75 ? "completed" : "pending"}`}>Reformatting</Badge>
              <Badge variant={progress >= 100 ? "default" : "outline"} aria-label={`Generating document ${progress >= 100 ? "completed" : "pending"}`}>Generating document</Badge>
            </div>
          </>
        )}

        {status === "success" && (
          <Alert className="border-success/20 bg-success/10 text-success" role="status" aria-live="polite">
            <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
            <AlertDescription>
              Your resume has been reformatted to a federally compliant 2-page format. The file will download automatically.
            </AlertDescription>
          </Alert>
        )}

        {status === "error" && (
          <Alert variant="destructive" role="alert" aria-live="assertive">
            <XCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error || "An unexpected error occurred. Please try again."}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
