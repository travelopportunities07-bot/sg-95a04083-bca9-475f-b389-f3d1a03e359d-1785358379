import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) throw resetError;

      setSuccess(true);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO 
        title={t("auth.forgotPassword")}
        description="Réinitialisez votre mot de passe WorkBridgeDe"
      />
      
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {t("auth.forgotPassword")}
          </h1>
          <p className="text-sm text-muted">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="space-y-4">
            <Alert className="border-success/50 bg-success/10">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Un email de réinitialisation a été envoyé à <strong>{email}</strong>.
                Vérifiez votre boîte de réception et suivez les instructions.
              </AlertDescription>
            </Alert>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-muted">
                Vous n'avez pas reçu l'email ?
              </p>
              <Button
                variant="outline"
                onClick={() => setSuccess(false)}
                className="w-full"
              >
                Renvoyer l'email
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à la connexion
          </Link>
        </div>
      </Card>
    </div>
  );
}