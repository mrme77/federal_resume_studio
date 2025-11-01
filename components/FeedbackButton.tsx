"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { FeedbackModal } from "@/components/FeedbackModal";

export function FeedbackButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div className="relative group">
        {/* Feedback Label on Hover */}
        <div
          className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap transition-all duration-300 ${
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-sm font-medium shadow-lg">
            Feedback
          </div>
        </div>

        {/* Pulsing Feedback Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative w-14 h-14 rounded-full bg-gradient-to-br from-primary/70 via-primary/60 to-accent/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group-hover:animate-none animate-feedback-pulse"
          aria-label="Send Feedback"
        >
          {/* Pulsing Ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/50 via-primary/40 to-accent/50 animate-ping-slow opacity-90 group-hover:opacity-0"></div>

          {/* Icon */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <Mail className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>

      <FeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <style jsx>{`
        @keyframes feedback-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(147, 51, 234, 0.8);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(147, 51, 234, 0);
          }
        }

        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .animate-feedback-pulse {
          animation: feedback-pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </>
  );
}
