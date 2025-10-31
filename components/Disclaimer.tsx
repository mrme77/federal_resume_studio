"use client";

import { AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Disclaimer() {
  return (
    <Card>
      <CardContent className="pt-6 accordion">
        <details>
          <summary>
            <Shield className="h-5 w-5 text-primary" />
            <span>Privacy & Security</span>
          </summary>
          <div className="accordion-content text-sm text-muted-foreground space-y-2">
            <p>• Zero Data Retention (ZDR) - Your resume data is NOT retained by AI providers.</p>
            <p>• HTTPS Encryption - All data is encrypted in transit.</p>
            <p>• No Persistent Storage - Your resume files are processed in memory and not saved on our servers.</p>
            <p>• Stateless Operation - No user accounts or authentication are required to use this tool.</p>
          </div>
        </details>
        <details>
          <summary>
            <AlertTriangle className="h-5 w-5 text-primary" />
            <span>Legal & Usage Notice</span>
          </summary>
          <div className="accordion-content text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Use at Your Own Risk:</strong> The developers make no warranties regarding the accuracy,
              reliability, or suitability of the generated content.
            </p>
            <p>
              <strong>You are responsible for:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Verifying all information in the generated resume.</li>
              <li>Ensuring compliance with all agency-specific application requirements.</li>
              <li>Reviewing and editing all AI-generated content before submission.</li>
            </ul>
            <p className="mt-2">
              <strong>Important Notice:</strong> This application is not affiliated with, endorsed by, or authorized by
              the U.S. Federal Government or any of its agencies. Its outputs do not represent any official federal
              guidance or policy.
            </p>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}