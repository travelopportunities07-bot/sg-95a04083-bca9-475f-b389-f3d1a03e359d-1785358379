import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  MapPin, 
  CheckSquare, 
  Users, 
  ArrowRight 
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: MapPin,
      emoji: "🇩🇪",
      title: "Willkommen in Deutschland",
      titleEn: "Welcome to Germany",
      description: "Dein persönlicher Assistent für alle administrativen Schritte in Deutschland",
      descriptionEn: "Your personal assistant for all administrative steps in Germany",
      color: "text-[#34d399]",
      bgGlow: "bg-[rgba(16,185,129,0.15)]",
      borderGlow: "border-[rgba(16,185,129,0.3)]"
    },
    {
      icon: CheckSquare,
      emoji: "📋",
      title: "Nie wieder vergessen",
      titleEn: "Never forget again",
      description: "Intelligente Checkliste und automatische Erinnerungen für alle wichtigen Aufgaben",
      descriptionEn: "Smart checklist and automatic reminders for all important tasks",
      color: "text-[#22c55e]",
      bgGlow: "bg-[rgba(34,197,94,0.15)]",
      borderGlow: "border-[rgba(34,197,94,0.3)]"
    },
    {
      icon: Users,
      emoji: "🤝",
      title: "Dein HR ist dabei",
      titleEn: "Your HR is with you",
      description: "Dein HR-Manager verfolgt deinen Fortschritt und hilft dir aus der Ferne",
      descriptionEn: "Your HR Manager tracks your progress and helps you remotely",
      color: "text-[#3b82f6]",
      bgGlow: "bg-[rgba(59,130,246,0.15)]",
      borderGlow: "border-[rgba(59,130,246,0.3)]"
    }
  ];

  const currentSlideData = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onComplete();
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#0a0d0f] z-50 flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-[#8fa3b3] hover:text-[#f0f4f8] hover:bg-[#1c242b]"
          >
            {t("common.skip")}
          </Button>
        </div>

        {/* Main Card */}
        <Card className="p-8 premium-card scale-in bg-[#161c21] border-[rgba(255,255,255,0.06)]">
          <div className="text-center space-y-6">
            {/* Icon with animation */}
            <div className="relative">
              <div className={`w-24 h-24 mx-auto rounded-2xl ${currentSlideData.bgGlow} border ${currentSlideData.borderGlow} flex items-center justify-center pulse-glow`}>
                <currentSlideData.icon className={`w-12 h-12 ${currentSlideData.color}`} />
              </div>
              <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                {currentSlideData.emoji}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-2xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                {t("language") === "de" ? currentSlideData.title : currentSlideData.titleEn}
              </h1>
              <p className="text-[#8fa3b3]">
                {t("language") === "de" ? currentSlideData.description : currentSlideData.descriptionEn}
              </p>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 fade-in-up" style={{ animationDelay: "0.2s" }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-gradient-to-r from-[#10b981] to-[#059669] w-8"
                      : "bg-[#566878] w-2 hover:bg-[#8fa3b3]"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
                size="lg"
              >
                {isLastSlide ? (
                  t("onboarding.getStarted") || "Los geht's"
                ) : (
                  <>
                    {t("onboarding.next") || "Weiter"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}