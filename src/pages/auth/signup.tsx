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
  const { signUp } = useAuth();
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

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "worker" as "worker" | "hr_manager",
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
      const { data: authData } = await signUp(
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

      // If invitation exists, link user to company and HR manager
      if (invitation && authData?.user) {
        // Update profile with company and HR manager
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            company_id: invitation.company_id,
            hr_manager_id: invitation.invited_by
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.error("Error linking to company:", updateError);
        }

        // Mark invitation as accepted
        await acceptInvitation(invitation.id, authData.user.id);
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