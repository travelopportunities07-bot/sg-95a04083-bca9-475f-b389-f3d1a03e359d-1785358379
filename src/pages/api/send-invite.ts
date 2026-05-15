import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, firstName, lastName, inviteLink, inviteCode } = req.body;

    if (!email || !inviteLink || !inviteCode) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const name = firstName && lastName ? `${firstName} ${lastName}` : email;

    // Email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Einladung zu WorkBridgeDe</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F5F7F6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F7F6; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); overflow: hidden;">
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #1F7A63 0%, #2E8B6C 100%); padding: 40px 30px; text-align: center;">
                    <div style="width: 64px; height: 64px; background-color: rgba(255, 255, 255, 0.2); border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 32px; font-weight: bold; color: white;">WB</span>
                    </div>
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: bold;">Willkommen bei WorkBridgeDe!</h1>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #1E293B;">
                      Hallo ${name},
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #1E293B;">
                      Sie wurden eingeladen, der WorkBridgeDe-Plattform beizutreten. WorkBridgeDe hilft Ihnen bei Ihren administrativen Aufgaben in Deutschland.
                    </p>
                    
                    <!-- Invitation Code -->
                    <div style="background-color: #F5F7F6; border-radius: 12px; padding: 20px; margin: 30px 0; text-align: center;">
                      <p style="margin: 0 0 10px; font-size: 14px; color: #64748B;">Ihr Einladungscode:</p>
                      <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1F7A63; font-family: 'Courier New', monospace; letter-spacing: 4px;">
                        ${inviteCode}
                      </p>
                    </div>
                    
                    <!-- CTA Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${inviteLink}" style="display: inline-block; background: linear-gradient(135deg, #1F7A63 0%, #2E8B6C 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(31, 122, 99, 0.3);">
                        Konto erstellen
                      </a>
                    </div>
                    
                    <p style="margin: 20px 0 0; font-size: 14px; line-height: 1.6; color: #64748B; text-align: center;">
                      Oder kopieren Sie diesen Link in Ihren Browser:<br>
                      <a href="${inviteLink}" style="color: #1F7A63; word-break: break-all;">${inviteLink}</a>
                    </p>
                    
                    <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #64748B;">
                      ⏱️ Diese Einladung ist 7 Tage gültig.
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #F5F7F6; padding: 30px; text-align: center; border-top: 1px solid #E5E7EB;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #64748B;">
                      WorkBridgeDe - Ihre Begleitung in Deutschland
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #8FA3B3;">
                      Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    // Log the email (in production, you would send via email service)
    console.log("=== INVITATION EMAIL ===");
    console.log(`To: ${email}`);
    console.log(`Subject: Einladung zu WorkBridgeDe`);
    console.log(`Invite Code: ${inviteCode}`);
    console.log(`Invite Link: ${inviteLink}`);
    console.log("========================");

    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    // For now, we'll just return success
    // In production:
    // await sendEmail({
    //   to: email,
    //   subject: "Einladung zu WorkBridgeDe",
    //   html: htmlContent
    // });

    return res.status(200).json({ 
      success: true,
      message: "Invitation email sent successfully"
    });

  } catch (error: any) {
    console.error("Error sending invitation:", error);
    return res.status(500).json({ 
      error: "Failed to send invitation email",
      details: error.message 
    });
  }
}