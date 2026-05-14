import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Search,
  Home,
  Briefcase,
  CreditCard,
  HeartPulse,
  MapPin,
  HelpCircle,
  Bot,
  Send,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";

export function AIAssistant() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");

  const categories = [
    { id: "all", label: "Alle Kategorien", icon: HelpCircle, color: "bg-primary" },
    { id: "anmeldung", label: "Anmeldung & Wohnung", icon: Home, color: "bg-blue-500" },
    { id: "arbeiten", label: "Arbeiten", icon: Briefcase, color: "bg-green-500" },
    { id: "steuern", label: "Steuern", icon: CreditCard, color: "bg-orange-500" },
    { id: "versicherung", label: "Versicherung", icon: HeartPulse, color: "bg-red-500" },
    { id: "aufenthalt", label: "Aufenthalt", icon: MapPin, color: "bg-purple-500" },
  ];

  const faqItems = [
    // Anmeldung & Wohnung
    {
      category: "anmeldung",
      question: "Wo muss ich mich in Deutschland anmelden?",
      answer: "Sie müssen sich innerhalb von 14 Tagen nach Einzug beim Bürgeramt (Einwohnermeldeamt) Ihrer Stadt anmelden. Bringen Sie Ihren Reisepass, Wohnungsgeberbestätigung und ggf. Ihre Geburtsurkunde mit."
    },
    {
      category: "anmeldung",
      question: "Was ist eine Wohnungsgeberbestätigung?",
      answer: "Die Wohnungsgeberbestätigung ist ein Dokument, das Ihr Vermieter ausstellen muss. Es bestätigt, dass Sie in der Wohnung wohnen. Dieses Dokument benötigen Sie für die Anmeldung beim Bürgeramt."
    },
    {
      category: "anmeldung",
      question: "Wie finde ich eine Wohnung in Deutschland?",
      answer: "Nutzen Sie Online-Plattformen wie ImmobilienScout24, WG-Gesucht oder Immowelt. Bereiten Sie eine Bewerbungsmappe vor mit: Schufa-Auskunft, Einkommensnachweis, Mietschuldenfreiheitsbescheinigung und einem Anschreiben."
    },
    
    // Arbeiten in Deutschland
    {
      category: "arbeiten",
      question: "Brauche ich eine Arbeitserlaubnis?",
      answer: "EU-Bürger benötigen keine Arbeitserlaubnis. Nicht-EU-Bürger benötigen einen Aufenthaltstitel mit Arbeitserlaubnis. Dies wird oft zusammen mit dem Visum erteilt. Prüfen Sie Ihren Aufenthaltstitel."
    },
    {
      category: "arbeiten",
      question: "Wie viele Urlaubstage habe ich?",
      answer: "In Deutschland haben Vollzeitbeschäftigte gesetzlich Anspruch auf mindestens 20 Urlaubstage bei einer 5-Tage-Woche (24 Tage bei 6-Tage-Woche). Viele Arbeitgeber gewähren jedoch 25-30 Tage."
    },
    {
      category: "arbeiten",
      question: "Was ist ein Arbeitsvertrag?",
      answer: "Ein Arbeitsvertrag regelt die Bedingungen Ihrer Anstellung: Gehalt, Arbeitszeit, Urlaubstage, Kündigungsfrist. Lesen Sie ihn sorgfältig und lassen Sie sich bei Unklarheiten beraten."
    },
    {
      category: "arbeiten",
      question: "Wie funktioniert die Probezeit?",
      answer: "Die Probezeit dauert üblicherweise 6 Monate. In dieser Zeit kann der Vertrag mit einer verkürzten Frist von 2 Wochen gekündigt werden. Nach der Probezeit gelten längere Kündigungsfristen."
    },

    // Steuern
    {
      category: "steuern",
      question: "Was ist eine Steuer-ID?",
      answer: "Die Steuer-Identifikationsnummer ist eine 11-stellige Nummer, die Ihnen vom Bundeszentralamt für Steuern zugeteilt wird. Sie benötigen sie für Ihre Lohnabrechnung. Sie wird automatisch nach der Anmeldung zugeschickt."
    },
    {
      category: "steuern",
      question: "Muss ich eine Steuererklärung machen?",
      answer: "Für Arbeitnehmer mit nur einem Arbeitgeber ist die Steuererklärung freiwillig, aber oft lohnenswert. Sie können Werbungskosten, Versicherungen und andere Ausgaben steuerlich geltend machen und bekommen oft Geld zurück."
    },
    {
      category: "steuern",
      question: "Was sind Steuerklassen?",
      answer: "Steuerklassen bestimmen die Höhe der Lohnsteuer. Singles haben meist Steuerklasse I. Verheiratete können zwischen III/V oder IV/IV wählen. Die Steuerklasse wird automatisch vergeben, kann aber geändert werden."
    },
    {
      category: "steuern",
      question: "Kann ich Kosten von der Steuer absetzen?",
      answer: "Ja, viele Kosten sind absetzbar: Fahrtkosten zur Arbeit (Pendlerpauschale), Arbeitsmittel, Fortbildungen, bestimmte Versicherungen, Umzugskosten (bei beruflichem Umzug), und mehr."
    },

    // Versicherung
    {
      category: "versicherung",
      question: "Welche Versicherungen sind Pflicht?",
      answer: "Krankenversicherung ist Pflicht für alle in Deutschland. Arbeitnehmer sind automatisch in der gesetzlichen Sozialversicherung (Renten-, Arbeitslosen-, Pflege- und Unfallversicherung). Empfohlen: Haftpflichtversicherung."
    },
    {
      category: "versicherung",
      question: "Was ist der Unterschied zwischen gesetzlicher und privater Krankenversicherung?",
      answer: "Gesetzliche KV: Beitrag nach Einkommen, Familienversicherung möglich, Leistungskatalog festgelegt. Private KV: Beitrag nach Alter/Gesundheit, individueller Tarif, oft bessere Leistungen. Wechsel ist eingeschränkt."
    },
    {
      category: "versicherung",
      question: "Wie melde ich mich bei der Krankenversicherung an?",
      answer: "Wählen Sie eine Krankenkasse (z.B. TK, AOK, Barmer). Die Anmeldung erfolgt online oder persönlich. Sie benötigen: Personalausweis/Pass, Arbeitgeberdaten, ggf. Geburtsurkunde. Ihr Arbeitgeber meldet Sie dann zur Sozialversicherung an."
    },
    {
      category: "versicherung",
      question: "Was ist eine Haftpflichtversicherung?",
      answer: "Die private Haftpflichtversicherung schützt Sie, wenn Sie anderen Personen Schaden zufügen. Sie ist sehr empfohlen, kostet ca. 50-80€/Jahr und deckt Millionenschäden ab."
    },

    // Aufenthalt
    {
      category: "aufenthalt",
      question: "Was ist ein Aufenthaltstitel?",
      answer: "Der Aufenthaltstitel ist Ihre Erlaubnis, in Deutschland zu leben und zu arbeiten. Er wird als Karte ausgestellt und hat verschiedene Formen: Aufenthaltserlaubnis (befristet), Niederlassungserlaubnis (unbefristet), Blaue Karte EU."
    },
    {
      category: "aufenthalt",
      question: "Wie verlängere ich meinen Aufenthaltstitel?",
      answer: "Beantragen Sie die Verlängerung 2-3 Monate vor Ablauf bei der Ausländerbehörde. Benötigt: gültiger Reisepass, Arbeitsvertrag, Krankenversicherungsnachweis, Wohnungsnachweis, Passfotos, ausgefüllter Antrag."
    },
    {
      category: "aufenthalt",
      question: "Was ist die Blaue Karte EU?",
      answer: "Die Blaue Karte EU ist ein Aufenthaltstitel für Hochqualifizierte (Hochschulabschluss + Mindestgehalt). Sie ermöglicht vereinfachte Bedingungen für Familiennachzug und schnellere Niederlassungserlaubnis nach 33 Monaten (21 Monate mit B1-Deutsch)."
    },
    {
      category: "aufenthalt",
      question: "Kann meine Familie nach Deutschland kommen?",
      answer: "Ja, Familiennachzug ist möglich. Bedingungen: ausreichender Wohnraum, gesicherter Lebensunterhalt, Krankenversicherung. Ehepartner und minderjährige Kinder können nachziehen. Details bei der Botschaft/Konsulat im Heimatland klären."
    },
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="glass-morphism border-b border-border sticky top-0 z-10 fade-in-down">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="smooth-transition hover:scale-110"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">FAQ - Häufige Fragen</h1>
              <p className="text-sm text-muted-foreground">Alles über das Leben und Arbeiten in Deutschland</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Search */}
        <Card className="p-4 premium-card scale-in">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Suche nach Fragen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 stagger-children">
          {categories.map((cat, index) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? "default" : "outline"}
              size="sm"
              className="flex-shrink-0 smooth-transition hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <Card className="p-6 premium-card scale-in">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-semibold mb-2">Keine Fragen gefunden</p>
              <p className="text-sm text-muted-foreground mb-6">
                Versuche es mit anderen Suchbegriffen oder stelle deine Frage dem KI-Assistenten
              </p>
              <Button onClick={() => setShowAIChat(true)} className="bg-primary">
                <Bot className="w-4 h-4 mr-2" />
                KI-Assistent fragen
              </Button>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full stagger-children">
              {filteredFAQs.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <AccordionTrigger className="text-left hover:text-primary smooth-transition">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </Card>

        {/* AI Assistant CTA */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 premium-card scale-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Frage nicht dabei?</h3>
              <p className="text-sm text-muted-foreground">
                Nutze unseren KI-Assistenten für individuelle Fragen!
              </p>
            </div>
            <Button onClick={() => setShowAIChat(true)} className="bg-primary btn-premium">
              <Bot className="w-4 h-4 mr-2" />
              KI Fragen
            </Button>
          </div>
        </Card>
      </div>

      {/* AI Chat Dialog */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="max-w-2xl max-h-[80vh] scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              KI-Assistent
            </DialogTitle>
            <DialogDescription>
              Stelle deine individuelle Frage zum Leben und Arbeiten in Deutschland
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Schreibe deine Frage hier..."
              className="min-h-[120px]"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
            />
            <Button className="w-full bg-primary btn-premium" disabled={!aiQuestion.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Frage senden
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Beliebte Fragen:</p>
              <div className="space-y-2">
                {[
                  "Wie beantrage ich Kindergeld?",
                  "Was ist ein Lohnsteuerjahresausgleich?",
                  "Wie funktioniert die Rentenversicherung?"
                ].map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto py-2 px-3"
                    onClick={() => setAiQuestion(q)}
                  >
                    <HelpCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="text-xs">{q}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}