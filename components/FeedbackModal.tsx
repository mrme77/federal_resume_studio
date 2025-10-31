"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, CheckCircle, AlertCircle, X, Loader2, UserPlus } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SubmissionState = "idle" | "submitting" | "success" | "error";

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [state, setState] = useState<SubmissionState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleClose = () => {
    if (state === "submitting") return; // Prevent closing while submitting

    // Reset form on close
    setFeedback("");
    setName("");
    setEmail("");
    setLinkedin("");
    setState("idle");
    setErrorMessage("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (feedback.trim().length < 10) {
      setErrorMessage("Feedback must be at least 10 characters.");
      return;
    }

    setState("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send feedback");
      }

      setState("success");

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setState("error");
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const isFormValid = feedback.trim().length >= 10;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleClose}
    >
      <Card
        className="max-w-lg mx-4 border-2 border-primary/50 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">
                  Send Feedback
                </h2>
                <p className="text-sm text-muted-foreground">
                  We'd love to hear your thoughts, suggestions, or concerns.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleClose}
              disabled={state === "submitting"}
              className="ml-2"
              aria-label="Close feedback form"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Success State */}
          {state === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="p-4 bg-green-500/10 rounded-full mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-green-500 mb-2">
                Feedback Sent!
              </h3>
              <p className="text-sm text-muted-foreground text-center">
                Thank you for your feedback. We'll review it shortly.
              </p>
            </div>
          )}

          {/* Form State */}
          {(state === "idle" || state === "submitting" || state === "error") && (
            <form onSubmit={handleSubmit}>
              {/* Feedback Textarea */}
              <div className="mb-4">
                <Label htmlFor="feedback" className="mb-2 block">
                  Your Feedback <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Share your thoughts, suggestions, or report any issues..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  disabled={state === "submitting"}
                  className="min-h-[120px]"
                  required
                  aria-required="true"
                  aria-invalid={feedback.length > 0 && feedback.length < 10}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum 10 characters ({Math.max(0, 10 - feedback.length)} remaining)
                </p>
              </div>

              {/* Name Input (Optional) */}
              <div className="mb-4">
                <Label htmlFor="name" className="mb-2 block">
                  Name <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={state === "submitting"}
                />
              </div>

              {/* Email Input (Optional) */}
              <div className="mb-4">
                <Label htmlFor="email" className="mb-2 block">
                  Email <span className="text-xs text-muted-foreground">(optional, for follow-up)</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={state === "submitting"}
                />
              </div>

              {/* LinkedIn Input (Optional) */}
              <div className="mb-4">
                <Label htmlFor="linkedin" className="mb-2 block">
                  LinkedIn Profile <span className="text-xs text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="linkedin"
                  type="url"
                  placeholder="linkedin.com/in/yourprofile"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  disabled={state === "submitting"}
                />
              </div>

              {/* LinkedIn Connection Callout */}
              <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <UserPlus className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      Want to connect? Send me a{" "}
                      <a
                        href="https://www.linkedin.com/in/pasquale-salomone/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-500 hover:text-blue-400 underline underline-offset-2 transition-colors"
                      >
                        friend request on LinkedIn
                      </a>
                      !
                    </p>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {state === "error" && errorMessage && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-lg flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={state === "submitting"}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!isFormValid || state === "submitting"}
                  className="gap-2"
                >
                  {state === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              Your feedback helps us improve Federal Resume Studio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
