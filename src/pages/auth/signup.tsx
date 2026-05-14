import { useState, useRef } from "react";
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
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const submittedRef = useRef(false); // Prevent double submission

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (submittedRef.current || loading) {
      console.log("Signup already in progress, ignoring duplicate request");
      return;
    }

    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError(t("auth.signup.passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    // Mark as submitted and set loading
    submittedRef.current = true;
    setLoading(true);

    try {
      await signUp(
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
      
      setSuccess(true);
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      console.error("Signup error:", err);
      
      // Handle specific errors
      if (err.message?.includes("rate limit")) {
        setError("Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.");
      } else if (err.message?.includes("already registered")) {
        setError("Cet email est déjà utilisé. Essayez de vous connecter.");
      } else {
        setError(t("auth.signup.error"));
      }
      
      // Reset submission flag on error
      submittedRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate step 1
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
      // Validate step 2 for workers
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md p-8 premium-card fade-in-up text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("auth.signup.success")}</h1>
          <p className="text-muted-foreground mb-4">
            Vous allez être redirigé vers la page de connexion...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeSwitch />
        <LanguageSwitch />
      </div>

      <Card className="w-full max-w-md p-8 premium-card fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-primary">WB</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">{t("auth.signup.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("auth.signup.subtitle")}</p>
          <p className="text-xs text-muted-foreground mt-2">
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
                  i + 1 <= step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm fade-in">
              {error}
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 fade-in-up">
              <h2 className="font-semibold text-lg">{t("auth.signup.step1Title")}</h2>

              <div className="space-y-2">
                <Label>Ich bin...</Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: "worker" | "hr_manager") =>
                    setFormData({ ...formData, role: value })
                  }
                  disabled={loading}
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="worker" id="worker" />
                    <Label htmlFor="worker" className="cursor-pointer flex-1">
                      {t("auth.signup.worker")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <RadioGroupItem value="hr_manager" id="hr_manager" />
                    <Label htmlFor="hr_manager" className="cursor-pointer flex-1">
                      {t("auth.signup.hrManager")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("auth.signup.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("auth.signup.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("auth.signup.confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                />
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full bg-primary hover:bg-primary/90 btn-premium"
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
              <h2 className="font-semibold text-lg">{t("auth.signup.step2Title")}</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("auth.signup.firstName")}</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="given-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("auth.signup.lastName")}</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="family-name"
                  />
                </div>
              </div>

              {formData.role === "hr_manager" && (
                <div className="space-y-2">
                  <Label htmlFor="company">{t("auth.signup.company")}</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                    disabled={loading}
                    autoComplete="organization"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1 btn-premium"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("auth.signup.previous")}
                </Button>
                {formData.role === "hr_manager" ? (
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 btn-premium"
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
                    className="flex-1 bg-primary hover:bg-primary/90 btn-premium"
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
              <h2 className="font-semibold text-lg">{t("auth.signup.step3Title")}</h2>

              <div className="space-y-2">
                <Label htmlFor="nationality">{t("auth.signup.nationality")}</Label>
                <Input
                  id="nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  required
                  disabled={loading}
                  placeholder="France, Maroc, Tunisie..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalDate">{t("auth.signup.arrivalDate")}</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languageLevel">{t("auth.signup.languageLevel")}</Label>
                <Select
                  value={formData.languageLevel}
                  onValueChange={(value: any) => setFormData({ ...formData, languageLevel: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A1">A1 - Beginner</SelectItem>
                    <SelectItem value="A2">A2 - Elementary</SelectItem>
                    <SelectItem value="B1">B1 - Intermediate</SelectItem>
                    <SelectItem value="B2">B2 - Upper Intermediate</SelectItem>
                    <SelectItem value="C1">C1 - Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">{t("auth.signup.jobType")}</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  className="flex-1 btn-premium"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t("auth.signup.previous")}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 btn-premium"
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
          <p className="text-sm text-muted-foreground">
            {t("auth.signup.hasAccount")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("auth.signup.loginLink")}
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}