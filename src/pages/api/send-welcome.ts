import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, dashboardUrl, role } = req.body;

  if (!email || !firstName || !dashboardUrl) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const roleText = role === "worker" ? "Travailleur" : "Gestionnaire RH";

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue sur WorkBridgeDe</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #0a0d0f;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #161c21; border-radius: 16px; box-shadow: 0 10px 40px rgba(16, 185, 129, 0.15);">
          
          <!-- Header avec logo -->
          <tr>
            <td style="padding: 40px 40px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06);">
              <div style="width: 64px; height: 64px; margin: 0 auto 20px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px; font-weight: bold; color: white;">WB</span>
              </div>
              <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #f0f4f8;">
                Bienvenue sur WorkBridge<span style="color: #10b981;">De</span>
              </h1>
            </td>
          </tr>

          <!-- Corps du message -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #f0f4f8;">
                Bonjour <strong>${firstName}</strong> 👋
              </p>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #8fa3b3;">
                Nous sommes ravis de vous accueillir sur WorkBridgeDe, votre assistant personnel pour votre intégration en Allemagne.
              </p>

              <p style="margin: 0 0 30px; font-size: 16px; line-height: 1.6; color: #8fa3b3;">
                Votre compte <strong style="color: #10b981;">${roleText}</strong> a été créé avec succès via Google OAuth.
              </p>

              <!-- Bouton CTA -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);">
                  Accéder à mon compte
                </a>
              </div>

              <p style="margin: 30px 0 0; font-size: 14px; line-height: 1.6; color: #8fa3b3;">
                Vous pouvez maintenant commencer à suivre vos démarches administratives et accéder à tous les outils disponibles.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.06); text-align: center;">
              <p style="margin: 0 0 15px; font-size: 14px; color: #8fa3b3;">
                Cet email a été envoyé par WorkBridgeDe
              </p>
              <p style="margin: 0; font-size: 12px; color: #566878; line-height: 1.5;">
                <strong>DSGVO-konform:</strong> Vos données sont protégées conformément au RGPD.<br/>
                Vous recevez cet email car vous avez créé un compte sur notre plateforme.<br/>
                Pour toute question : <a href="mailto:support@workbridgede.com" style="color: #10b981; text-decoration: none;">support@workbridgede.com</a>
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

  try {
    // En production, intégrer avec un service d'email (Resend, SendGrid, etc.)
    // Pour l'instant, on simule l'envoi
    console.log("📧 Welcome email would be sent to:", email);
    console.log("Dashboard URL:", dashboardUrl);
    
    // TODO: Intégrer avec un vrai service d'email
    // const response = await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
    //     "Content-Type": "application/json"
    //   },
    //   body: JSON.stringify({
    //     from: "WorkBridgeDe <noreply@workbridgede.com>",
    //     to: email,
    //     subject: `Bienvenue ${firstName} - Votre compte WorkBridgeDe`,
    //     html: htmlContent
    //   })
    // });

    res.status(200).json({ 
      success: true,
      message: "Email de bienvenue envoyé (simulation)",
      preview: htmlContent
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    res.status(500).json({ error: error.message });
  }
}