import type { NextApiRequest, NextApiResponse } from "next";

// This would integrate with an email service like Resend, SendGrid, etc.
// For now, it's a mock implementation

interface ReminderRequest {
  recipientEmail: string;
  recipientName: string;
  message: string;
  type: "task" | "document" | "general";
  language?: "de" | "en";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { recipientEmail, recipientName, message, type, language = "de" }: ReminderRequest = req.body;

  if (!recipientEmail || !recipientName || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Mock email sending - in production, integrate with Resend/SendGrid
    console.log("Sending reminder email:", {
      to: recipientEmail,
      subject: language === "de" ? "Erinnerung - WorkBridgeDe" : "Reminder - WorkBridgeDe",
      body: message,
      type
    });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return res.status(200).json({ 
      success: true,
      message: "Reminder sent successfully" 
    });

  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ 
      error: "Failed to send reminder",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}