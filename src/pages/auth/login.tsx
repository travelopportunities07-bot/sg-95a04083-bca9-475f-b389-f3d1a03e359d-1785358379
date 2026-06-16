import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [showPasswordUpdatedMessage, setShowPasswordUpdatedMessage] = useState(false);

  useEffect(() => {
    // Check if user was redirected after email verification
    if (router.query.verified === "true") {
      setShowVerifiedMessage(true);
      setTimeout(() => setShowVerifiedMessage(false), 5000);
    }
    
    // Check if user was redirected after password reset
    if (router.query.password_updated === "true") {
      setShowPasswordUpdatedMessage(true);
      setTimeout(() => setShowPasswordUpdatedMessage(false), 5000);
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error, userProfile } = await signIn(email, password);

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          setError("Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte de réception.");
        } else if (error.message.includes("Invalid login credentials")) {
          setError(t("auth.login.invalidCredentials"));
        } else {
          setError(error.message);
        }
      } else if (userProfile) {
        // Redirect based on role
        if (userProfile.role === "worker") {
          router.push("/");
        } else if (userProfile.role === "hr_manager") {
          router.push("/hr/employees");
        }
      }
    } catch (err: any) {
      setError(t("auth.login.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      console.log('Initiating Google Sign-In...');
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('Google Sign-In error:', error);
        
        // Messages d'erreur spécifiques et détaillés
        if (error.message.includes("provider is not enabled")) {
          setError(
            "⚠️ Google OAuth n'est pas activé. Configuration requise dans Supabase Dashboard : " +
            "Authentication → Providers → Google"
          );
        } else if (error.message.includes("redirect")) {
          setError(
            "❌ Erreur de configuration de redirection. Contactez l'administrateur."
          );
        } else if (error.message.includes("credentials")) {
          setError(
            "❌ Identifiants Google OAuth manquants ou invalides."
          );
        } else {
          setError(error.message || "Erreur lors de la connexion avec Google");
        }
        
        // Afficher l'erreur complète dans la console (sans accéder à .code qui n'existe pas sur Error)
        console.error('Full error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      }
      // La redirection est gérée automatiquement par Supabase si succès
    } catch (err: any) {
      console.error('Unexpected error during Google Sign-In:', err);
      setError("Une erreur inattendue est survenue lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>

      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <Card className="w-full max-w-md p-8 premium-card fade-in-up bg-[#161c21] border-[rgba(16,185,129,0.3)] relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[rgba(16,185,129,0.3)]">
            <span className="text-2xl font-bold text-white" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>WB</span>
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
            {t("auth.login.title")}
          </h1>
          <p className="text-[#8fa3b3] text-sm">{t("auth.login.subtitle")}</p>
        </div>

        {showVerifiedMessage && (
          <div className="mb-4 p-3 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-xl text-[#34d399] text-sm flex items-center gap-2 fade-in">
            <CheckCircle className="w-4 h-4" />
            Email vérifié avec succès ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        {showPasswordUpdatedMessage && (
          <div className="mb-4 p-3 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-xl text-[#34d399] text-sm flex items-center gap-2 fade-in">
            <CheckCircle className="w-4 h-4" />
            Mot de passe mis à jour avec succès ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-sm fade-in">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl h-12 border border-gray-300 shadow-sm flex items-center justify-center gap-3 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z" fill="#4285F4"/>
              <path d="M8.99976 18C11.4298 18 13.467 17.1941 14.9562 15.8195L12.0475 13.5613C11.2416 14.1013 10.2107 14.4204 8.99976 14.4204C6.65567 14.4204 4.67158 12.8372 3.96385 10.71H0.957031V13.0418C2.43794 15.9831 5.48158 18 8.99976 18Z" fill="#34A853"/>
              <path d="M3.96409 10.7098C3.78409 10.1698 3.68182 9.59301 3.68182 8.99983C3.68182 8.40665 3.78409 7.82983 3.96409 7.28983V4.95801H0.957273C0.347727 6.17301 0 7.5476 0 8.99983C0 10.4521 0.347727 11.8267 0.957273 13.0417L3.96409 10.7098Z" fill="#FBBC05"/>
              <path d="M8.99976 3.57955C10.3211 3.57955 11.5075 4.03364 12.4402 4.92545L15.0216 2.34409C13.4629 0.891818 11.4257 0 8.99976 0C5.48158 0 2.43794 2.01682 0.957031 4.95818L3.96385 7.29C4.67158 5.16273 6.65567 3.57955 8.99976 3.57955Z" fill="#EA4335"/>
            </svg>
            Continuer avec Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(255,255,255,0.06)]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-[#161c21] text-[#8fa3b3]">ou</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#f0f4f8]">{t("auth.login.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="email"
              className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-[#f0f4f8]">{t("auth.login.password")}</Label>
              <Link 
                href="/auth/forgot-password" 
                className="text-xs text-[#34d399] hover:text-[#10b981] transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
              className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("auth.login.submit")
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#8fa3b3]">
            {t("auth.login.noAccount")}{" "}
            <Link href="/auth/signup" className="text-[#34d399] hover:text-[#10b981] font-medium transition-colors">
              {t("auth.login.signupLink")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}