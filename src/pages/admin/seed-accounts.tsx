import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function SeedAccounts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createTestAccounts = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("🚀 Début de la création des comptes...");

      // 1. Créer la company de test
      console.log("📦 Création de la company...");
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
        throw companyError;
      }
      console.log("✅ Company créée:", company);

      // 2. Créer le compte HR Manager
      const hrEmail = "hr.test@example.com";
      const hrPassword = "TestPass123!";

      console.log("👔 Création du compte HR Manager...");
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

      if (hrAuthError) {
        console.error("❌ Erreur HR Auth:", hrAuthError);
        throw new Error(`HR Manager: ${hrAuthError.message}`);
      }
      console.log("✅ HR Manager créé:", hrAuth.user?.email);

      // Attendre 3 secondes pour éviter le rate limit
      console.log("⏳ Attente de 3 secondes...");
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. Créer le compte Worker
      const workerEmail = "worker.test@example.com";
      const workerPassword = "TestPass123!";

      console.log("👤 Création du compte Worker...");
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

      if (workerAuthError) {
        console.error("❌ Erreur Worker Auth:", workerAuthError);
        throw new Error(`Worker: ${workerAuthError.message}`);
      }
      console.log("✅ Worker créé:", workerAuth.user?.email);

      // 4. Mettre à jour le profil worker avec le HR manager
      if (hrAuth.user && workerAuth.user) {
        console.log("🔗 Liaison HR Manager → Worker...");
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ hr_manager_id: hrAuth.user.id })
          .eq("id", workerAuth.user.id);
        
        if (updateError) {
          console.error("⚠️ Erreur update profil:", updateError);
        } else {
          console.log("✅ Profils liés");
        }
      }

      // 5. Créer quelques tâches de test pour le worker
      if (workerAuth.user) {
        console.log("📋 Création des tâches de test...");
        const { error: tasksError } = await supabase.from("tasks").insert([
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
          {
            user_id: workerAuth.user.id,
            category: "Finanzen",
            title: "Bankkonto eröffnen",
            description: "Deutsche Bankkonto bei einer lokalen Bank eröffnen",
            priority: "medium",
            status: "completed",
            xp_reward: 75,
            due_date: "2026-05-10",
          },
        ]);

        if (tasksError) {
          console.error("⚠️ Erreur tâches:", tasksError);
        } else {
          console.log("✅ Tâches créées");
        }
      }

      console.log("🎉 Création terminée avec succès!");
      setResult({
        success: true,
        message: `✅ Comptes créés avec succès!\n\n👔 HR Manager:\nEmail: ${hrEmail}\nPassword: ${hrPassword}\n\n👤 Worker (Fachkraft):\nEmail: ${workerEmail}\nPassword: ${workerPassword}\n\n🎉 Allez sur /auth/login pour vous connecter`,
      });
    } catch (error: any) {
      console.error("❌ Erreur complète:", error);
      setResult({
        success: false,
        message: `❌ Erreur: ${error.message}\n\n💡 Consultez la console (F12) pour plus de détails.\n\n⚠️ Si le problème persiste, les comptes existent peut-être déjà. Essayez de vous connecter directement avec:\n\nHR: hr.test@example.com / TestPass123!\nWorker: worker.test@example.com / TestPass123!`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F7F6] py-8">
        <div className="container max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">🔧 Créer des Comptes de Test</CardTitle>
              <CardDescription>
                Créez des comptes de démonstration pour tester l'application WorkBridge
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Comptes qui seront créés:</h3>
                
                <Card className="bg-green-50 border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">👔 HR Manager</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Email:</strong> hr.test@example.com</p>
                    <p><strong>Password:</strong> TestPass123!</p>
                    <p><strong>Rôle:</strong> HR Manager</p>
                    <p><strong>Accès:</strong> Dashboard HR, gestion employés, invitations</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">👤 Worker (Fachkraft)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Email:</strong> worker.test@example.com</p>
                    <p><strong>Password:</strong> TestPass123!</p>
                    <p><strong>Nom:</strong> Max Mustermann</p>
                    <p><strong>Rôle:</strong> Fachkraft (France)</p>
                    <p><strong>Accès:</strong> Tâches, documents, workflows, FAQ</p>
                  </CardContent>
                </Card>
              </div>

              {result && (
                <Alert variant={result.success ? "default" : "destructive"}>
                  {result.success ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className="whitespace-pre-wrap">
                    {result.message}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={createTestAccounts}
                disabled={loading}
                size="lg"
                className="w-full bg-[#1F7A63] hover:bg-[#2E8B6C]"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer les Comptes de Test"
                )}
              </Button>

              <Alert>
                <AlertDescription className="text-xs">
                  <strong>💡 Astuce:</strong> Ouvrez la console du navigateur (F12) pour voir les logs détaillés de la création.
                  Si vous voyez "email rate limit exceeded", attendez 5 minutes ou essayez de vous connecter directement avec les identifiants ci-dessus.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}