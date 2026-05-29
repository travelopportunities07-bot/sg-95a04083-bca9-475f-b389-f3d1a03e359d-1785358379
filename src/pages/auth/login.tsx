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
  const { signIn } = useAuth();
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