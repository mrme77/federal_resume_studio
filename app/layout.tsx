import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { StarryBackground } from "@/components/StarryBackground";
import { Footer } from "@/components/Footer";
import { DonationButton } from "@/components/DonationButton";

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

        {/* Fixed Donation Button - Upper Right */}
        <div className="fixed top-4 right-4 z-50">
          <DonationButton showCostInfo={false} />
        </div>

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}