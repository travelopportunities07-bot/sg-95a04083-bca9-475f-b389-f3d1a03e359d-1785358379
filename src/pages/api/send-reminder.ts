import type { NextApiRequest, NextApiResponse } from "next";
import { createReminder } from "@/services/reminderService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { workerId, taskId, taskTitle, message, workerEmail, workerName } = req.body;

    if (!workerId || !taskTitle) {
      return res.status(400).json({ 
        error: "Missing required fields: workerId and taskTitle" 
      });
    }

    // Create reminder in database and send notification
    const { data: reminder, error: reminderError } = await createReminder({
      workerId,
      taskId,
      taskTitle,
      message
    });

    if (reminderError) {
      throw new Error(reminderError);
    }

    // Send email reminder
    if (workerEmail && workerName) {
      try {
        const emailRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: workerEmail,
            subject: `Erinnerung: ${taskTitle}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                  <h1 style="color: white; margin: 0;">WorkBridgeDe</h1>
                </div>
                
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1e293b; margin-bottom: 20px;">Hallo ${workerName}! 👋</h2>
                  
                  <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
                    Du hast eine neue Erinnerung von deinem HR Manager erhalten.
                  </p>
                  
                  <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 20px; margin: 30px 0; border-radius: 8px;">
                    <h3 style="color: #1e293b; margin: 0 0 10px 0;">📋 Aufgabe</h3>
                    <p style="color: #334155; font-size: 18px; font-weight: bold; margin: 0;">
                      ${taskTitle}
                    </p>
                  </div>
                  
                  ${message ? `
                    <div style="background: #fff7ed; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 8px;">
                      <h3 style="color: #1e293b; margin: 0 0 10px 0;">💬 Nachricht</h3>
                      <p style="color: #334155; font-size: 16px; line-height: 1.6; margin: 0;">
                        ${message}
                      </p>
                    </div>
                  ` : ''}
                  
                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tasks" 
                       style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;">
                      Zu meinen Aufgaben
                    </a>
                  </div>
                  
                  <p style="color: #94a3b8; font-size: 14px; line-height: 1.6; margin-top: 30px;">
                    Bitte erledige diese Aufgabe so bald wie möglich, um Verzögerungen zu vermeiden.
                  </p>
                </div>
                
                <div style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
                    © ${new Date().getFullYear()} WorkBridgeDe. Alle Rechte vorbehalten.
                  </p>
                  <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                    Diese E-Mail wurde automatisch generiert. Bitte antworte nicht direkt auf diese E-Mail.
                  </p>
                </div>
              </div>
            `
          })
        });

        if (!emailRes.ok) {
          console.error("Error sending reminder email:", await emailRes.text());
        }
      } catch (emailError) {
        console.error("Error sending email:", emailError);
        // Don't fail the request if email fails
      }
    }

    res.status(200).json({
      success: true,
      message: "Reminder sent successfully",
      reminder
    });
  } catch (error: any) {
    console.error("Error sending reminder:", error);
    res.status(500).json({ error: error.message });
  }
}