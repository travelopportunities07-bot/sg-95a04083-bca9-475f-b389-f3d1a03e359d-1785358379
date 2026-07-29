import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getInvitationByCode, acceptInvitation } from "@/services/invitationService";
import { supabase } from "@/integrations/supabase/client";

export default function Signup() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const submittedRef = useRef(false);
  
  // Invitation state
  const [inviteCode, setInviteCode] = useState("");
  const [invitation, setInvitation] = useState<any>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [workerWithoutInvite, setWorkerWithoutInvite] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "hr_manager" as "worker" | "hr_manager",
    firstName: "",
    lastName: "",
    nationality: "",
    arrivalDate: "",
    languageLevel: "A1" as "A1" | "A2" | "B1" | "B2" | "C1",
    jobType: "Fachkraft" as "Fachkraft" | "Azubi",
    company: ""
  });

  // Check for invitation code in URL
  useEffect(() => {
    const { invite } = router.query;
    if (invite && typeof invite === "string") {
      setInviteCode(invite);
      loadInvitation(invite);
    }
  }, [router.query]);

  const loadInvitation = async (code: string) => {
    setInviteLoading(true);
    setInviteError("");
    
    try {
      const { data, error } = await getInvitationByCode(code);
      
      if (error) throw error;
      
      if (data) {
        setInvitation(data);
        // Pre-fill form with invitation data
        setFormData(prev => ({
          ...prev,
          email: data.email,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          role: data.role
        }));
      }
    } catch (err: any) {
      setInviteError(err.message || "Code d'invitation invalide ou expiré");
    } finally {
      setInviteLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (submittedRef.current || loading) {
      return;
    }

    // BLOC worker sans invitation
    if (formData.role === "worker" && !invitation) {
      setWorkerWithoutInvite(true);
      return;
    }

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.signup.passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    submittedRef.current = true;
    setLoading(true);

    try {
      // Sign up user
      const { error: signUpError, data } = await signUp(
        formData.email,
        formData.password,
        {
          role: formData.role,
          first_name: formData.firstName,
          last_name: formData.lastName,
          ...(formData.role === "worker" && {
            nationality: formData.nationality,
            arrival_date: formData.arrivalDate,
            language_level: formData.languageLevel,
            job_type: formData.jobType
          }),
          ...(formData.role === "hr_manager" && {
            company: formData.company
          })
        }
      );

      if (signUpError) throw signUpError;

      // If invitation exists, link user to company and HR manager
      if (invitation && data?.user) {
        // Update profile with company and HR manager
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            company_id: invitation.company_id,
            hr_manager_id: invitation.invited_by
          })
          .eq("id", data.user.id);

        if (updateError) {
          console.error("Error linking to company:", updateError);
        }

        // Mark invitation as accepted
        await acceptInvitation(invitation.id, data.user.id);
      }
      
      setSuccess(true);
    } catch (err: any) {
      if (err.message?.includes("rate limit")) {
        setError("Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.");
      } else if (err.message?.includes("already registered")) {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else {
        setError(t("auth.signup.error"));
      }
      
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { error } = await signInWithGoogle();
      
      if (error) {
        setError(error.message || "Erreur lors de la connexion avec Google");
      }
      // La redirection est gérée automatiquement par Supabase
    } catch (err: any) {
      setError("Une erreur est survenue lors de la connexion avec Google");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.confirmPassword) {
        setError("Veuillez remplir tous les champs");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(t("auth.signup.passwordMismatch"));
        return;
      }
      
      // BLOC worker sans invitation
      if (formData.role === "worker" && !invitation) {
        setWorkerWithoutInvite(true);
        return;
      }
    }
    
    if (step === 2 && formData.role === "worker") {
      if (!formData.firstName || !formData.lastName) {
        setError("Veuillez remplir tous les champs");
        return;
      }
    }

    setError("");
    setStep(step + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(step - 1);
  };

  const totalSteps = formData.role === "worker" ? 3 : 2;

  // Show worker without invitation message
  if (workerWithoutInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
        <Card className="w-full max-w-md p-8 premium-card text-center bg-[#161c21] border-[rgba(239,68,68,0.3)]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]">Einladung erforderlich</h1>
          <p className="text-[#8fa3b3] mb-6">
            Als Fachkraft oder Azubi können Sie sich nicht direkt registrieren. 
            Sie müssen eine Einladung von Ihrem HR Manager erhalten.
          </p>
          <div className="bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-[#8fa3b3] mb-2">
              <strong className="text-[#f0f4f8]">Wie funktioniert es?</strong>
            </p>
            <ol className="text-sm text-[#8fa3b3] space-y-2 list-decimal list-inside">
              <li>Ihr HR Manager sendet Ihnen eine Einladungs-E-Mail</li>
              <li>Klicken Sie auf den Link in der E-Mail</li>
              <li>Erstellen Sie Ihr Konto mit dem Einladungscode</li>
            </ol>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setWorkerWithoutInvite(false)}
              variant="outline"
              className="flex-1"
            >
              Zurück
            </Button>
            <Button
              onClick={() => router.push("/auth/login")}
              className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669]"
            >
              Zur Anmeldung
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Show invitation loading state
  if (inviteCode && inviteLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
        <Card className="w-full max-w-md p-8 premium-card text-center bg-[#161c21] border-[rgba(16,185,129,0.3)]">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-[#8fa3b3]">Einladung wird geladen...</p>
        </Card>
      </div>
    );
  }

  // Show invitation error
  if (inviteCode && inviteError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
        <Card className="w-full max-w-md p-8 premium-card text-center bg-[#161c21] border-[rgba(239,68,68,0.3)]">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
          <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]">Ungültige Einladung</h1>
          <p className="text-[#8fa3b3] mb-6">{inviteError}</p>
          <Button
            onClick={() => router.push("/auth/signup")}
            variant="outline"
            className="w-full"
          >
            Normale Registrierung
          </Button>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
        <Card className="w-full max-w-md p-8 premium-card fade-in-up text-center bg-[#161c21] border-[rgba(16,185,129,0.3)]">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#34d399]" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
            Compte créé avec succès !
          </h1>
          {invitation && (
            <div className="bg-[#1c242b] border border-[rgba(16,185,129,0.3)] rounded-xl p-4 mb-4">
              <p className="text-sm text-[#34d399] mb-2">
                ✅ Automatisch mit Ihrem Unternehmen verbunden
              </p>
            </div>
          )}
          <p className="text-[#8fa3b3] mb-4">
            Un email de vérification a été envoyé à <strong className="text-[#34d399]">{formData.email}</strong>
          </p>
          <p className="text-[#8fa3b3] text-sm mb-6">
            Veuillez vérifier votre boîte de réception et cliquer sur le lien de vérification pour activer votre compte.
          </p>
          <div className="bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-4">
            <p className="text-xs text-[#8fa3b3]">
              💡 <strong>Conseil :</strong> Si vous ne voyez pas l'email, vérifiez votre dossier spam ou courrier indésirable.
            </p>
          </div>
          <Button
            onClick={() => router.push("/auth/login")}
            className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
          >
            Retour à la connexion
          </Button>
        </Card>
      </div>
    );
  }

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
            {invitation ? "Einladung annehmen" : t("auth.signup.title")}
          </h1>
          <p className="text-[#8fa3b3] text-sm">
            {invitation ? `Eingeladen von Ihrem HR Manager` : t("auth.signup.subtitle")}
          </p>
          {invitation && (
            <div className="mt-3 bg-[#1c242b] border border-[rgba(16,185,129,0.3)] rounded-xl p-3">
              <p className="text-xs text-[#34d399]">
                ✓ Code: <span className="font-mono font-bold">{inviteCode}</span>
              </p>
            </div>
          )}
          <p className="text-xs text-[#566878] mt-2">
            Schritt {step} von {totalSteps}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex gap-2">
            {[...Array(totalSteps)].map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all ${
                  i + 1 <= step ? "bg-gradient-to-r from-[#10b981] to-[#059669]" : "bg-[#1c242b]"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-sm fade-in">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          {step === 1 && !invitation && (
            <>
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
            </>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 fade-in-up">
              <h2 className="font-semibold text-lg text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                {t("auth.signup.step1Title")}
              </h2>

              <div className="space-y-2">
                <Label className="text-[#f0f4f8]">Ich bin...</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: "worker" | "hr_manager") =>
                    setFormData({ ...formData, role: value })
                  }
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2 p-3 bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl cursor-pointer hover:border-[rgba(16,185,129,0.3)] transition-colors">
                    <RadioGroupItem value="worker" id="worker" />
                    <Label htmlFor="worker" className="cursor-pointer flex-1 text-[#f0f4f8]">
                      {t("auth.signup.worker")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl cursor-pointer hover:border-[rgba(16,185,129,0.3)] transition-colors">
                    <RadioGroupItem value="hr_manager" id="hr_manager" />
                    <Label htmlFor="hr_manager" className="cursor-pointer flex-1 text-[#f0f4f8]">
                      {t("auth.signup.hrManager")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#f0f4f8]">{t("auth.signup.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="email"
                  className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#f0f4f8]">{t("auth.signup.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                  className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#f0f4f8]">{t("auth.signup.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                  className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                />
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
                disabled={loading}
              >
                {t("auth.signup.next")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Personal Details */}
          {step === 2 && (
            <div className="space-y-4 fade-in-up">
              <h2 className="font-semibold text-lg text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                {t("auth.signup.step2Title")}
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#f0f4f8]">{t("auth.signup.firstName")}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="given-name"
                    className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#f0f4f8]">{t("auth.signup.lastName")}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="family-name"
                    className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                  />
                </div>
              </div>

              {formData.role === "hr_manager" && (
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-[#f0f4f8]">{t("auth.signup.company")}</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="organization"
                    className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 btn-premium bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] hover:border-[rgba(16,185,129,0.3)] hover:bg-[#222c35]"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("auth.signup.previous")}
                </Button>
                {formData.role === "hr_manager" ? (
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
                    disabled={loading || submittedRef.current}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("common.loading")}
                      </>
                    ) : (
                      t("auth.signup.submit")
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
                    disabled={loading}
                  >
                    {t("auth.signup.next")}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Work Info (Workers only) */}
          {step === 3 && formData.role === "worker" && (
            <div className="space-y-4 fade-in-up">
              <h2 className="font-semibold text-lg text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                {t("auth.signup.step3Title")}
              </h2>

              <div className="space-y-2">
                <Label htmlFor="nationality" className="text-[#f0f4f8]">{t("auth.signup.nationality")}</Label>
                <Input
                  id="nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="France, Maroc, Tunisie..."
                  className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalDate" className="text-[#f0f4f8]">{t("auth.signup.arrivalDate")}</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  required
                  disabled={loading}
                  className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languageLevel" className="text-[#f0f4f8]">{t("auth.signup.languageLevel")}</Label>
                <Select
                  value={formData.languageLevel}
                  onValueChange={(value: any) => setFormData({ ...formData, languageLevel: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c242b] border-[rgba(255,255,255,0.06)]">
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType" className="text-[#f0f4f8]">{t("auth.signup.jobType")}</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                  disabled={loading}
                >
                  <SelectTrigger className="bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] rounded-xl h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1c242b] border-[rgba(255,255,255,0.06)]">
                    <SelectItem value="Fachkraft">Fachkraft (Skilled Worker)</SelectItem>
                    <SelectItem value="Azubi">Azubi (Apprentice)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 btn-premium bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] hover:border-[rgba(16,185,129,0.3)] hover:bg-[#222c35]"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("auth.signup.previous")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
                  disabled={loading || submittedRef.current}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("common.loading")}
                    </>
                  ) : (
                    t("auth.signup.submit")
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#8fa3b3]">
            {t("auth.signup.hasAccount")}{" "}
            <Link href="/auth/login" className="text-[#34d399] hover:text-[#10b981] font-medium transition-colors">
              {t("auth.signup.loginLink")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}