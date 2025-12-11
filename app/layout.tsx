import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarryBackground } from "@/components/StarryBackground";

import { GitHubStarButton } from "@/components/GitHubStarButton";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Federal Resume Studio - AI-Powered Resume Reformatting",
  description: "Generate a Federally Compliant Resume using AI. Fast, secure, and easy to use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen flex flex-col`}
      >
        <StarryBackground />

        {/* Fixed GitHub Star Button - Upper Right */}
        <div className="fixed top-4 right-4 z-50">
          <GitHubStarButton showTooltip={true} />
        </div>

        {/* Fixed Feedback Button - Lower Right */}
        <div className="fixed bottom-6 right-6 z-50">
          <FeedbackButton />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}