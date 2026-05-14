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
      color: "text-primary"
    },
    {
      icon: CheckSquare,
      emoji: "📋",
      title: "Nie wieder vergessen",
      titleEn: "Never forget again",
      description: "Intelligente Checkliste und automatische Erinnerungen für alle wichtigen Aufgaben",
      descriptionEn: "Smart checklist and automatic reminders for all important tasks",
      color: "text-success"
    },
    {
      icon: Users,
      emoji: "🤝",
      title: "Dein HR ist dabei",
      titleEn: "Your HR is with you",
      description: "Dein HR-Manager verfolgt deinen Fortschritt und hilft dir aus der Ferne",
      descriptionEn: "Your HR Manager tracks your progress and helps you remotely",
      color: "text-accent"
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
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            {t("common.skip")}
          </Button>
        </div>

        {/* Main Card */}
        <Card className="p-8 premium-card scale-in">
          <div className="text-center space-y-6">
            {/* Icon with animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto rounded-full bg-primary/10 flex items-center justify-center pulse-glow">
                <currentSlideData.icon className={`w-12 h-12 ${currentSlideData.color}`} />
              </div>
              <div className="absolute -top-2 -right-2 text-4xl animate-bounce">
                {currentSlideData.emoji}
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2 fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h1 className="text-2xl font-bold">
                {t("language") === "de" ? currentSlideData.title : currentSlideData.titleEn}
              </h1>
              <p className="text-muted-foreground">
                {t("language") === "de" ? currentSlideData.description : currentSlideData.descriptionEn}
              </p>
            </div>

            {/* Dots indicator */}
            <div className="flex items-center justify-center gap-2 fade-in-up" style={{ animationDelay: "0.2s" }}>
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 btn-premium"
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