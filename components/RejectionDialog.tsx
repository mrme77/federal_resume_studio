"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileX, Ban, Shield } from "lucide-react";

export type RejectionType = "length" | "gibberish" | "profanity" | "injection";

interface RejectionDialogProps {
  isOpen: boolean;
  rejectionType: RejectionType | null;
  message: string;
  onClose: () => void;
}

export function RejectionDialog({
  isOpen,
  rejectionType,
  message,
  onClose,
}: RejectionDialogProps) {
  if (!isOpen || !rejectionType) return null;

  const config = {
    length: {
      icon: <FileX className="h-10 w-10 text-orange-500" />,
      title: "Resume Too Long",
      color: "orange",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/50",
    },
    gibberish: {
      icon: <AlertTriangle className="h-10 w-10 text-red-500" />,
      title: "Invalid Content Detected",
      color: "red",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/50",
    },
    profanity: {
      icon: <Ban className="h-10 w-10 text-red-500" />,
      title: "Inappropriate Content",
      color: "red",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/50",
    },
    injection: {
      icon: <Shield className="h-10 w-10 text-red-500" />,
      title: "Security Threat Detected",
      color: "red",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/50",
    },
  };

  const { icon, title, bgColor, borderColor } = config[rejectionType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className={`max-w-2xl mx-4 border-2 ${borderColor} shadow-2xl`}>
        <CardContent className="pt-8 pb-6 px-6">
          {/* Icon and Title */}
          <div className="flex items-start gap-4 mb-6">
            <div className={`p-3 rounded-full ${bgColor} flex-shrink-0`}>
              {icon}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-destructive mb-2">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm">
                Your resume could not be processed due to the following issue:
              </p>
            </div>
          </div>

          {/* Error Message */}
          <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-6`}>
            <p className="text-foreground text-sm leading-relaxed">{message}</p>
          </div>

          {/* Help Text */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-sm mb-2">What to do:</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              {rejectionType === "length" && (
                <>
                  <li>• Reduce your resume to 30 pages or fewer</li>
                  <li>• Focus on recent and relevant experience (last 5-10 years)</li>
                  <li>• Remove outdated or less relevant positions</li>
                </>
              )}
              {rejectionType === "gibberish" && (
                <>
                  <li>• Ensure your resume contains legitimate work experience</li>
                  <li>• Remove any random characters or nonsense text</li>
                  <li>• Use a properly formatted PDF or DOCX file</li>
                </>
              )}
              {rejectionType === "profanity" && (
                <>
                  <li>• Remove any inappropriate language or profanity</li>
                  <li>• Remove test or placeholder content (e.g., &quot;Lorem Ipsum&quot;, &quot;test test test&quot;)</li>
                  <li>• Ensure resume contains professional content only</li>
                </>
              )}
              {rejectionType === "injection" && (
                <>
                  <li>• Remove any AI commands or instructions from your resume</li>
                  <li>• Do not include chat template markers or system prompts</li>
                  <li>• Upload a standard professional resume only</li>
                </>
              )}
            </ul>
          </div>

          {/* Action Button */}
          <Button onClick={onClose} className="w-full" size="lg">
            Upload a Different Resume
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
