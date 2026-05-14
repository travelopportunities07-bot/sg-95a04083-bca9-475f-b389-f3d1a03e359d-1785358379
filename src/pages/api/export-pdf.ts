import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { documents, userName, userEmail } = req.body;

    if (!documents || !Array.isArray(documents)) {
      return res.status(400).json({ error: "Invalid documents data" });
    }

    // Filter only validated documents
    const validatedDocs = documents.filter((doc: any) => doc.status === "validated");

    if (validatedDocs.length === 0) {
      return res.status(400).json({ error: "No validated documents to export" });
    }

    // Return success with document data - PDF generation happens client-side
    return res.status(200).json({
      success: true,
      message: "PDF ready for generation",
      documents: validatedDocs,
      userName,
      userEmail
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return res.status(500).json({
      error: "Failed to prepare PDF export",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}