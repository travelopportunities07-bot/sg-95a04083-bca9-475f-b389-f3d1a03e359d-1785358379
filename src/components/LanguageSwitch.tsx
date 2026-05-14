import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "de" ? "en" : "de")}
      className="gap-2 btn-premium"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === "de" ? "DE" : "EN"}</span>
    </Button>
  );
}