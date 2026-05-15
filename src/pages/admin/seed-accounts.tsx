import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function SeedAccounts() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createTestAccounts = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log("🚀 Appel de l'API de création...");
      
      const response = await fetch("/api/seed-test-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("📦 Réponse API:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création des comptes");
      }

      setResult({
        success: true,
        message: `✅ Comptes créés avec succès!\n\n👔 HR Manager:\nEmail: hr.test@example.com\nPassword: TestPass123!\n\n👤 Worker (Fachkraft):\nEmail: worker.test@example.com\nPassword: TestPass123!\n\n🎉 Allez sur /auth/login pour vous connecter`,
      });
    } catch (error: any) {
      console.error("❌ Erreur:", error);
      
      // Si c'est une erreur de rate limit ou que les comptes existent déjà
      if (error.message.includes("rate limit") || error.message.includes("already")) {
        setResult({
          success: true,
          message: `⚠️ Les comptes existent peut-être déjà!\n\nEssayez de vous connecter avec:\n\n👔 HR Manager:\nEmail: hr.test@example.com\nPassword: TestPass123!\n\n👤 Worker (Fachkraft):\nEmail: worker.test@example.com\nPassword: TestPass123!\n\n🎉 Allez sur /auth/login`,
        });
      } else {
        setResult({
          success: false,
          message: `❌ Erreur: ${error.message}\n\n💡 Consultez la console (F12) pour plus de détails.\n\n⚠️ Si le problème persiste, essayez de vous connecter directement avec:\n\nHR: hr.test@example.com / TestPass123!\nWorker: worker.test@example.com / TestPass123!`,
        });
      }
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
                <AlertDescription className="text-xs space-y-2">
                  <p><strong>💡 Option alternative:</strong> Si la création ne fonctionne pas, essayez de vous connecter directement avec les identifiants ci-dessus. Les comptes existent peut-être déjà!</p>
                  <p><strong>🔧 Debug:</strong> Ouvrez la console (F12) pour voir les logs détaillés.</p>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}