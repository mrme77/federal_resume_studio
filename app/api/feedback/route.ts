import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * POST /api/feedback
 * Handles user feedback submissions and sends email to admin via SMTP
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedback, name, email, linkedin } = body;

    // Validation
    if (!feedback || typeof feedback !== "string" || feedback.trim().length < 10) {
      return NextResponse.json(
        { error: "Feedback must be at least 10 characters long." },
        { status: 400 }
      );
    }

    // Optional email validation
    if (email && typeof email === "string" && email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json(
          { error: "Invalid email address." },
          { status: 400 }
        );
      }
    }

    // Get SMTP configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const myEmail = process.env.MY_EMAIL;

    // Check if SMTP is configured
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !myEmail) {
      console.error("SMTP configuration incomplete. Required: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MY_EMAIL");

      // Fallback: Log feedback to console if SMTP not configured
      console.log("===== NEW FEEDBACK =====");
      console.log("From:", name?.trim() || "Anonymous", email?.trim() ? `(${email.trim()})` : "");
      console.log("LinkedIn:", linkedin?.trim() || "Not provided");
      console.log("Message:", feedback.trim());
      console.log("Timestamp:", new Date().toISOString());
      console.log("========================");

      return NextResponse.json(
        { message: "Feedback received! (Email service not configured - check server logs)" },
        { status: 200 }
      );
    }

    // Format email content
    const emailSubject = "New Feedback - Federal Resume Studio";
    const emailBody = `
New feedback received from Federal Resume Studio:

${feedback.trim()}

---
Submitted by: ${name?.trim() || "Anonymous"}
Contact email: ${email?.trim() || "Not provided"}
LinkedIn: ${linkedin?.trim() || "Not provided"}
Timestamp: ${new Date().toISOString()}
    `.trim();

    // Create transporter with SMTP configuration
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: parseInt(smtpPort, 10) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    // Send email
    try {
      await transporter.sendMail({
        from: `"Federal Resume Studio" <${smtpUser}>`,
        to: myEmail,
        subject: emailSubject,
        text: emailBody,
        replyTo: email?.trim() || undefined,
      });

      return NextResponse.json(
        { message: "Feedback sent successfully!" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error sending email via SMTP:", error);
      return NextResponse.json(
        { error: "Failed to send feedback. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing feedback:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
