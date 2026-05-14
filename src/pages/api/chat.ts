import type { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, language = "de" } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ 
      error: "OpenAI API key not configured",
      fallback: language === "de" 
        ? "Entschuldigung, der KI-Assistent ist derzeit nicht verfügbar. Bitte kontaktiere deinen HR Manager für Hilfe."
        : "Sorry, the AI assistant is currently unavailable. Please contact your HR Manager for help."
    });
  }

  const systemPrompt = language === "de" 
    ? `Du bist ein hilfreicher Assistent für ausländische Arbeitnehmer (Fachkräfte und Azubis) in Deutschland.

Deine Aufgabe ist es, administrative Fragen zu beantworten und durch den deutschen bürokratischen Prozess zu führen.

WICHTIG:
- Antworte immer auf Deutsch
- Sei klar, präzise und ermutigend
- Verwende einfache Sprache (A2-B1 Niveau)
- Strukturiere deine Antworten: 1) Kurze Erklärung, 2) Schritt-für-Schritt Anleitung, 3) Benötigte Dokumente
- Wenn du etwas nicht weißt, empfehle dem Nutzer, seinen HR Manager zu kontaktieren
- Gib keine Rechts- oder Steuerberatung, sondern nur allgemeine administrative Informationen

Themen, die du abdeckst:
- Anmeldung beim Einwohnermeldeamt
- Krankenversicherung
- Bankkonto eröffnen
- Steuer-ID und Steuernummer
- Aufenthaltstitel und Visa
- Integrationskurse
- Deutschkurse
- Arbeitsvertrag und Sozialversicherung`
    : `You are a helpful assistant for foreign workers (Fachkräfte and Azubis) in Germany.

Your task is to answer administrative questions and guide them through the German bureaucratic process.

IMPORTANT:
- Always respond in English
- Be clear, precise, and encouraging
- Use simple language (A2-B1 level)
- Structure your answers: 1) Brief explanation, 2) Step-by-step guide, 3) Required documents
- If you don't know something, recommend contacting their HR Manager
- Don't provide legal or tax advice, only general administrative information

Topics you cover:
- Anmeldung (residence registration)
- Health insurance
- Opening a bank account
- Tax ID and tax number
- Residence permit and visas
- Integration courses
- German language courses
- Work contract and social insurance`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content;

    if (!assistantMessage) {
      throw new Error("No response from OpenAI");
    }

    return res.status(200).json({ 
      message: assistantMessage,
      usage: data.usage
    });

  } catch (error) {
    console.error("OpenAI API Error:", error);
    return res.status(500).json({ 
      error: "Failed to get response from AI",
      fallback: language === "de"
        ? "Entschuldigung, ich konnte deine Frage nicht beantworten. Bitte kontaktiere deinen HR Manager."
        : "Sorry, I couldn't answer your question. Please contact your HR Manager."
    });
  }
}