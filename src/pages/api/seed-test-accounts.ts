import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🚀 API: Début de la création des comptes...");

    // 1. Créer la company de test
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .upsert({
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        name: "WorkBridge Demo GmbH",
        industry: "Technology",
        size: "medium",
        city: "Berlin",
        country: "Germany",
      })
      .select()
      .single();

    if (companyError) {
      console.error("❌ Erreur company:", companyError);
      return res.status(500).json({ error: companyError.message });
    }

    // 2. Créer le compte HR Manager
    const hrEmail = "hr.test@example.com";
    const hrPassword = "TestPass123!";

    const { data: hrAuth, error: hrAuthError } = await supabase.auth.signUp({
      email: hrEmail,
      password: hrPassword,
      options: {
        data: {
          full_name: "HR Manager Test",
          first_name: "HR",
          last_name: "Manager",
          role: "hr_manager",
          company_id: company.id,
        },
      },
    });

    // Si l'utilisateur existe déjà, ce n'est pas une erreur
    if (hrAuthError && !hrAuthError.message.includes("already registered")) {
      console.error("❌ Erreur HR Auth:", hrAuthError);
      return res.status(500).json({ 
        error: hrAuthError.message,
        hint: "Les comptes existent peut-être déjà. Essayez de vous connecter avec: hr.test@example.com / TestPass123!"
      });
    }

    // Attendre pour éviter le rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Créer le compte Worker
    const workerEmail = "worker.test@example.com";
    const workerPassword = "TestPass123!";

    const { data: workerAuth, error: workerAuthError } = await supabase.auth.signUp({
      email: workerEmail,
      password: workerPassword,
      options: {
        data: {
          full_name: "Max Mustermann",
          first_name: "Max",
          last_name: "Mustermann",
          role: "worker",
          company_id: company.id,
          nationality: "France",
          arrival_date: "2026-03-15",
          language_level: "A2",
          job_type: "Fachkraft",
          phone: "+49 123 456 7890",
        },
      },
    });

    if (workerAuthError && !workerAuthError.message.includes("already registered")) {
      console.error("❌ Erreur Worker Auth:", workerAuthError);
      return res.status(500).json({ 
        error: workerAuthError.message,
        hint: "Les comptes existent peut-être déjà. Essayez de vous connecter avec: worker.test@example.com / TestPass123!"
      });
    }

    // 4. Mettre à jour les profils si les utilisateurs ont été créés
    if (hrAuth?.user && workerAuth?.user) {
      await supabase
        .from("profiles")
        .update({ hr_manager_id: hrAuth.user.id })
        .eq("id", workerAuth.user.id);

      // 5. Créer quelques tâches de test
      await supabase.from("tasks").insert([
        {
          user_id: workerAuth.user.id,
          category: "Gesundheit",
          title: "Krankenversicherung abschließen",
          description: "Wählen Sie eine Krankenkasse und melden Sie sich an",
          priority: "high",
          status: "todo",
          xp_reward: 50,
          due_date: "2026-05-30",
        },
        {
          user_id: workerAuth.user.id,
          category: "Anmeldung",
          title: "Anmeldung beim Bürgeramt",
          description: "Termin beim Bürgeramt vereinbaren",
          priority: "urgent",
          status: "in_progress",
          xp_reward: 100,
          due_date: "2026-05-20",
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Comptes créés avec succès",
      accounts: {
        hrManager: { email: hrEmail, password: hrPassword },
        worker: { email: workerEmail, password: workerPassword },
      },
    });
  } catch (error: any) {
    console.error("❌ Erreur API:", error);
    return res.status(500).json({ 
      error: error.message,
      hint: "Si le problème persiste, les comptes existent peut-être déjà. Essayez de vous connecter avec hr.test@example.com ou worker.test@example.com"
    });
  }
}