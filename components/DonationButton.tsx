"use client";

/**
 * Optional Donation Component
 * Provides a non-intrusive way for users to support AI processing costs
 */

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showCostInfo?: boolean;
  className?: string;
}

export function DonationButton({
  variant = "outline",
  size = "sm",
  showCostInfo = false,
  className = "",
}: DonationButtonProps) {
  // PayPal payment link using your email
  const PAYPAL_DONATION_LINK = "https://www.paypal.com/paypalme/psalomone33";

  const handleDonateClick = () => {
    window.open(PAYPAL_DONATION_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className} relative group/tooltip`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleDonateClick}
        className="group"
      >
        <Heart className="size-4 text-red-500 group-hover:fill-red-500 transition-colors" />
        Support Project
      </Button>

      {/* Custom Tooltip */}
      <div className="absolute top-full right-0 mt-2 w-72 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50">
        <p className="leading-relaxed">Donations are voluntary and help cover AI token costs</p>
        <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
      </div>

      {showCostInfo && (
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          100% optional • Helps cover AI token costs
        </p>
      )}
    </div>
  );
}

interface DonationCalloutProps {
  onClose?: () => void;
}

export function DonationCallout({ onClose }: DonationCalloutProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
          <Heart className="size-5 text-blue-600 dark:text-blue-400" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
            Found this helpful?
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Your support helps keep this tool free by covering AI processing costs.
            Donations are <strong>completely optional</strong> and never required!
          </p>

          <div className="flex items-center gap-2">
            <DonationButton variant="default" size="sm" />
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400"
              >
                Maybe later
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
