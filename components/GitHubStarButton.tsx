"use client";

/**
 * GitHub Star Button Component
 * Encourages users to star the project on GitHub
 */

import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GitHubStarButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  showTooltip?: boolean;
  className?: string;
}

export function GitHubStarButton({
  variant = "outline",
  size = "sm",
  showTooltip = true,
  className = "",
}: GitHubStarButtonProps) {
  const GITHUB_REPO_LINK = "https://github.com/mrme77/federal_resume_studio";

  const handleStarClick = () => {
    window.open(GITHUB_REPO_LINK, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className} ${showTooltip ? 'relative group/tooltip' : ''}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleStarClick}
        className="group"
      >
        <Star className="size-4 text-yellow-500 group-hover:fill-yellow-500 transition-colors" />
        Star on GitHub
      </Button>

      {/* Custom Tooltip */}
      {showTooltip && (
        <div className="absolute top-full right-0 mt-2 w-72 px-4 py-3 text-sm text-white bg-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-50">
          <p className="leading-relaxed">Star this project on GitHub if you find it helpful!</p>
          <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
        </div>
      )}
    </div>
  );
}

interface GitHubCalloutProps {
  onClose?: () => void;
}

export function GitHubCallout({ onClose }: GitHubCalloutProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full">
          <Star className="size-5 text-yellow-500" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
            Found this helpful?
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            Star this project on GitHub to show your support and help others discover it!
          </p>

          <div className="flex items-center gap-2">
            <GitHubStarButton variant="default" size="sm" showTooltip={false} />
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
