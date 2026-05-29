import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    // Vérifier que l'utilisateur a une session valide (vient du lien email)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setValidSession(true);
      } else {
        setError("Session invalide. Veuillez demander un nouveau lien de réinitialisation.");
      }
    };

    checkSession();
  }, []);

  const validatePassword = () => {
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        router.push("/auth/login?password_updated=true");
      }, 3000);
    } catch (err: any) {
      console.error("Password update error:", err);
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!validSession && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8">
          <p className="text-center text-muted">Vérification de la session...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SEO 
        title="Réinitialiser le mot de passe"
        description="Définissez votre nouveau mot de passe"
      />
      
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Nouveau mot de passe
          </h1>
          <p className="text-sm text-muted">
            Choisissez un mot de passe sécurisé pour votre compte
          </p>
        </div>

        {error && !validSession && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={() => router.push("/auth/forgot-password")}
              >
                Demander un nouveau lien
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && validSession && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <Alert className="border-success/50 bg-success/10">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              Votre mot de passe a été mis à jour avec succès ! Redirection vers la page de connexion...
            </AlertDescription>
          </Alert>
        ) : validSession ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted">
                Minimum 6 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </Button>
          </form>
        ) : null}
      </Card>
    </div>
  );
}