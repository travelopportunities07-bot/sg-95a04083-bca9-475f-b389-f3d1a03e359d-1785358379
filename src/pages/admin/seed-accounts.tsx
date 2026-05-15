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

      if (companyError) throw companyError;

      // 2. Créer le compte HR Manager
      const hrEmail = "hr.manager@workbridge-demo.com";
      const hrPassword = "Demo123!HR";

      const { data: hrAuth, error: hrAuthError } = await supabase.auth.signUp({
        email: hrEmail,
        password: hrPassword,
        options: {
          data: {
            full_name: "HR Manager Demo",
            first_name: "HR",
            last_name: "Manager",
            role: "hr_manager",
            company_id: company.id,
          },
        },
      });

      if (hrAuthError) throw hrAuthError;

      // 3. Créer le compte Worker
      const workerEmail = "worker.demo@workbridge-demo.com";
      const workerPassword = "Demo123!Worker";

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

      if (workerAuthError) throw workerAuthError;

      // 4. Mettre à jour le profil worker avec le HR manager
      if (hrAuth.user && workerAuth.user) {
        await supabase
          .from("profiles")
          .update({ hr_manager_id: hrAuth.user.id })
          .eq("id", workerAuth.user.id);
      }

      // 5. Créer quelques tâches de test pour le worker
      if (workerAuth.user) {
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
      }

      setResult({
        success: true,
        message: `Comptes créés avec succès!\n\nHR Manager:\nEmail: ${hrEmail}\nPassword: ${hrPassword}\n\nWorker (Fachkraft):\nEmail: ${workerEmail}\nPassword: ${workerPassword}`,
      });
    } catch (error: any) {
      console.error("Error creating test accounts:", error);
      setResult({
        success: false,
        message: `Erreur: ${error.message}`,
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
                    <p><strong>Email:</strong> hr.manager@workbridge-demo.com</p>
                    <p><strong>Password:</strong> Demo123!HR</p>
                    <p><strong>Rôle:</strong> HR Manager</p>
                    <p><strong>Accès:</strong> Dashboard HR, gestion employés, invitations</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">👤 Worker (Fachkraft)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p><strong>Email:</strong> worker.demo@workbridge-demo.com</p>
                    <p><strong>Password:</strong> Demo123!Worker</p>
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
                  <strong>Note:</strong> Les comptes seront créés avec confirmation email désactivée.
                  Vous pourrez vous connecter immédiatement après la création.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}