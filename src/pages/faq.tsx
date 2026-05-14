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
  ArrowLeft,
  Search,
  Home,
  Briefcase,
  CreditCard,
  HeartPulse,
  MapPin,
  HelpCircle,
  Bot,
  MessageSquare,
  BookOpen,
  FileText,
  Users
} from "lucide-react";
import { useRouter } from "next/router";
import { useLanguage } from "@/contexts/LanguageContext";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "anmeldung" | "arbeiten" | "steuern" | "sozialversicherung" | "aufenthalt" | "allgemein";
}

const faqData: FAQItem[] = [
  // Anmeldung & Wohnen
  {
    id: "1",
    question: "Was ist eine Anmeldung und warum ist sie wichtig?",
    answer: "Die Anmeldung beim Einwohnermeldeamt ist in Deutschland Pflicht. Sie müssen sich innerhalb von 14 Tagen nach Einzug in eine Wohnung anmelden. Ohne Anmeldung können Sie keine weiteren Behördengänge erledigen (z.B. Bankkonto eröffnen, Arbeitsvertrag abschließen). Sie benötigen: Reisepass, Wohnungsgeberbestätigung vom Vermieter, ausgefülltes Anmeldeformular.",
    category: "anmeldung"
  },
  {
    id: "2",
    question: "Welche Dokumente brauche ich für die Anmeldung?",
    answer: "Für die Anmeldung beim Einwohnermeldeamt benötigen Sie: 1) Ihren gültigen Reisepass oder Personalausweis, 2) Wohnungsgeberbestätigung (vom Vermieter ausgefüllt), 3) Ausgefülltes Anmeldeformular (erhältlich beim Amt oder online), 4) Bei Familien: Geburtsurkunden der Kinder.",
    category: "anmeldung"
  },
  {
    id: "3",
    question: "Wie finde ich eine Wohnung in Deutschland?",
    answer: "Wohnungssuche in Deutschland: 1) Online-Portale nutzen (ImmobilienScout24, WG-Gesucht, Immowelt), 2) Lokale Zeitungen prüfen, 3) Schwarze Bretter an Universitäten, 4) Facebook-Gruppen für Ihre Stadt, 5) Arbeitgeber fragen (manche bieten Unterstützung). Tipp: Bereiten Sie eine Bewerbungsmappe vor (Gehaltsnachweis, Schufa, Personalausweis-Kopie).",
    category: "anmeldung"
  },

  // Arbeiten in Deutschland
  {
    id: "4",
    question: "Brauche ich eine Arbeitserlaubnis?",
    answer: "EU-Bürger: Keine Arbeitserlaubnis nötig, freier Zugang zum Arbeitsmarkt. Nicht-EU-Bürger: Sie benötigen eine Aufenthalts- und Arbeitserlaubnis. Diese ist meist mit Ihrem Visum verbunden. Fachkräfte können ein Blue Card oder Fachkräftevisum beantragen. Ihr Arbeitgeber kann Sie beim Prozess unterstützen.",
    category: "arbeiten"
  },
  {
    id: "5",
    question: "Was ist ein Arbeitsvertrag und was muss drin stehen?",
    answer: "Der Arbeitsvertrag regelt Ihr Arbeitsverhältnis. Er muss enthalten: 1) Namen und Adressen (Arbeitgeber & Arbeitnehmer), 2) Beginn des Arbeitsverhältnisses, 3) Arbeitsort, 4) Tätigkeitsbeschreibung, 5) Gehalt und Zahlungsweise, 6) Arbeitszeit (Stunden pro Woche), 7) Urlaubsanspruch, 8) Kündigungsfristen, 9) Hinweis auf Tarifverträge (falls zutreffend).",
    category: "arbeiten"
  },
  {
    id: "6",
    question: "Wie viele Urlaubstage habe ich?",
    answer: "Gesetzlicher Mindesturlaub: 20 Tage bei einer 5-Tage-Woche (24 Tage bei 6-Tage-Woche). Viele Arbeitgeber bieten mehr: 28-30 Tage sind üblich. Urlaubsanspruch steht im Arbeitsvertrag. Sie haben nach 6 Monaten Beschäftigung Anspruch auf den vollen Urlaub. Urlaubstage verfallen meist zum Jahresende (31. März des Folgejahres).",
    category: "arbeiten"
  },

  // Steuern
  {
    id: "7",
    question: "Was ist die Lohnsteuer?",
    answer: "Die Lohnsteuer wird direkt vom Gehalt abgezogen (vor Auszahlung). Ihr Arbeitgeber überweist sie ans Finanzamt. Die Höhe hängt ab von: Gehalt, Steuerklasse, Kirchensteuerpflicht, Kinderfreibeträgen. Steuerklassen: I (ledig), II (alleinerziehend), III/V (verheiratet, unterschiedliche Einkommen), IV (verheiratet, ähnliche Einkommen), VI (Zweitjob).",
    category: "steuern"
  },
  {
    id: "8",
    question: "Muss ich eine Steuererklärung machen?",
    answer: "Pflicht zur Steuererklärung besteht wenn: mehrere Einkommensquellen, Nebeneinkünfte über 410€/Jahr, Steuerklasse III/V oder VI, auf Aufforderung des Finanzamts. Freiwillig lohnt sich oft: Werbungskosten, Sonderausgaben, außergewöhnliche Belastungen können abgesetzt werden. Frist: 31. Juli des Folgejahres (mit Steuerberater: bis Februar übernächstes Jahr).",
    category: "steuern"
  },
  {
    id: "9",
    question: "Was kann ich von der Steuer absetzen?",
    answer: "Absetzbare Kosten: 1) Werbungskosten (Fahrten Wohnung-Arbeit, Arbeitsmittel, Fortbildungen, Homeoffice-Pauschale), 2) Sonderausgaben (Versicherungen, Spenden, Kinderbetreuung), 3) Außergewöhnliche Belastungen (Krankheitskosten, Pflegekosten), 4) Handwerkerleistungen, haushaltsnahe Dienstleistungen. Belege aufbewahren!",
    category: "steuern"
  },

  // Sozialversicherung
  {
    id: "10",
    question: "Was ist eine Krankenversicherung?",
    answer: "Krankenversicherung ist in Deutschland Pflicht. Zwei Systeme: 1) Gesetzlich (GKV): Für die meisten Arbeitnehmer, Beitrag ca. 14,6% des Bruttogehalts (Arbeitgeber zahlt Hälfte), freie Arztwahl, Familienversicherung möglich. 2) Privat (PKV): Ab ca. 66.600€ Jahresgehalt, individuelle Tarife, oft umfangreichere Leistungen, keine Familienversicherung. Große Anbieter: TK, AOK, Barmer, DAK.",
    category: "sozialversicherung"
  },
  {
    id: "11",
    question: "Welche Versicherungen sind in Deutschland wichtig?",
    answer: "Pflichtversicherungen: Krankenversicherung, Pflegeversicherung (automatisch mit Krankenversicherung), Rentenversicherung (Arbeitgeber zieht ab), Arbeitslosenversicherung (Arbeitgeber zieht ab). Wichtige freiwillige Versicherungen: Haftpflichtversicherung (dringend empfohlen!), Hausratversicherung (für Wohnungseinrichtung), Berufsunfähigkeitsversicherung (Einkommensabsicherung).",
    category: "sozialversicherung"
  },
  {
    id: "12",
    question: "Was ist die Sozialversicherungsnummer?",
    answer: "Die Sozialversicherungsnummer (Rentenversicherungsnummer) ist Ihre eindeutige Identifikationsnummer für Renten- und Sozialversicherung. Sie bekommen sie automatisch bei der ersten Beschäftigung. Format: 12 Ziffern (z.B. 12 010478 A 123). Sie finden sie auf: Sozialversicherungsausweis, Renteninformation, Gehaltsabrechnung. Arbeitgeber benötigt sie für Anmeldung.",
    category: "sozialversicherung"
  },

  // Aufenthalt & Visum
  {
    id: "13",
    question: "Welches Visum brauche ich als Fachkraft?",
    answer: "Visa für Fachkräfte: 1) EU Blue Card: Für Hochqualifizierte, Gehalt mind. 44.304€ (2024), erleichterte Bedingungen für Familiennachzug. 2) Fachkräftevisum (§18a/18b AufenthG): Anerkannter Berufs-/Hochschulabschluss, konkretes Jobangebot. 3) Visum zur Arbeitsplatzsuche: 6 Monate zur Jobsuche, dann Umwandlung in Arbeitsvisum. Beantragung bei deutscher Auslandsvertretung im Heimatland.",
    category: "aufenthalt"
  },
  {
    id: "14",
    question: "Wie verlängere ich meinen Aufenthaltstitel?",
    answer: "Verlängerung 3-6 Monate VOR Ablauf bei zuständiger Ausländerbehörde beantragen. Benötigt: 1) Gültiger Reisepass, 2) Aktueller Arbeitsvertrag, 3) Gehaltsabrechnungen (letzte 3 Monate), 4) Nachweis Krankenversicherung, 5) Aktuelles biometrisches Foto, 6) Ausgefüllter Antrag, 7) Mietvertrag. Kosten: ca. 100€. Bearbeitungszeit: 4-12 Wochen. Während der Bearbeitung dürfen Sie weiterarbeiten (Fiktionsbescheinigung).",
    category: "aufenthalt"
  },
  {
    id: "15",
    question: "Kann meine Familie nach Deutschland kommen?",
    answer: "Familiennachzug ist möglich für: Ehepartner, minderjährige Kinder. Voraussetzungen: 1) Ausreichender Wohnraum (ca. 12qm pro Person), 2) Gesichertes Einkommen (ausreichend für Familie), 3) Krankenversicherung für alle, 4) Visum für Familienangehörige. Bei EU Blue Card: erleichterter Nachzug, teils ohne Deutschkenntnisse. Antrag bei deutscher Botschaft im Heimatland.",
    category: "aufenthalt"
  },

  // Allgemeines
  {
    id: "16",
    question: "Wie eröffne ich ein Bankkonto?",
    answer: "Bankkonto eröffnen: 1) Wählen Sie eine Bank (N26, Sparkasse, Deutsche Bank, Commerzbank, DKB). 2) Termin vereinbaren oder online beantragen. 3) Dokumente mitbringen: Reisepass, Meldebescheinigung (Anmeldung), bei manchen Banken: Arbeitsvertrag. 4) VideoIdent oder PostIdent zur Identifikation. 5) Girokonto meist kostenlos für junge Erwachsene/Studenten. Dauer: 3-7 Tage bis zur Kontoeröffnung.",
    category: "allgemein"
  },
  {
    id: "17",
    question: "Was ist ein Rundfunkbeitrag?",
    answer: "Der Rundfunkbeitrag (früher GEZ) finanziert öffentlich-rechtliche Sender (ARD, ZDF). Kosten: 18,36€ pro Monat pro Wohnung (nicht pro Person!). Zahlung ist Pflicht für jeden Haushalt, unabhängig davon, ob Sie Radio/TV nutzen. Anmeldung erfolgt automatisch nach Anmeldung beim Einwohnermeldeamt. Befreiung möglich für: Empfänger von Sozialleistungen, BAföG-Empfänger (unter Bedingungen), Menschen mit Behinderung.",
    category: "allgemein"
  },
  {
    id: "18",
    question: "Wo lerne ich Deutsch?",
    answer: "Deutschkurse in Deutschland: 1) Volkshochschule (VHS): günstig, breites Angebot (A1-C2). 2) Goethe-Institut: hochwertig, teurer, international anerkannte Zertifikate. 3) Private Sprachschulen: flexibel, oft intensiv. 4) Integrationskurse: für Migranten, staatlich gefördert (ca. 2€/Stunde), 600-900 Stunden. 5) Online: DeutschAkademie, Deutsche Welle. Apps: Duolingo, Babbel. Einstufungstest vor Kursbeginn empfohlen.",
    category: "allgemein"
  },
  {
    id: "19",
    question: "Was ist eine Schufa-Auskunft?",
    answer: "Die Schufa (Schutzgemeinschaft für allgemeine Kreditsicherung) speichert Daten zu Ihrer Kreditwürdigkeit. Sie benötigen eine Schufa-Auskunft für: Wohnungssuche (Vermieter verlangen sie), Kredite/Finanzierungen. Inhalt: Bankkonten, Kredite, Zahlungsverhalten, negative Einträge (unbezahlte Rechnungen). Kostenlose Selbstauskunft: 1x jährlich auf meineschufa.de. Vermieter-Auskunft: ca. 30€. Guter Score (>90%) wichtig für Verträge.",
    category: "allgemein"
  },
  {
    id: "20",
    question: "Wie funktioniert Mülltrennung in Deutschland?",
    answer: "Deutschland trennt Müll streng: 1) Restmüll (schwarze Tonne): nicht recycelbar. 2) Biomüll (braune Tonne): Essensreste, Pflanzen. 3) Papier (blaue Tonne): Zeitungen, Kartons (kein verschmutztes Papier). 4) Gelber Sack/Tonne: Plastik, Verpackungen mit Grünem Punkt. 5) Glas: nach Farben getrennt in Container (weiß, grün, braun). 6) Pfandflaschen: zurück zum Supermarkt (0,08-0,25€ Pfand). Elektroschrott/Batterien zu Recyclinghöfen.",
    category: "allgemein"
  }
];

export default function FAQPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const categories = [
    { id: "all", label: "Alle", icon: BookOpen, color: "bg-primary" },
    { id: "anmeldung", label: "Anmeldung", icon: Home, color: "bg-accent" },
    { id: "arbeiten", label: "Arbeiten", icon: Briefcase, color: "bg-success" },
    { id: "steuern", label: "Steuern", icon: FileText, color: "bg-warning" },
    { id: "sozialversicherung", label: "Versicherung", icon: Users, color: "bg-secondary" },
    { id: "aufenthalt", label: "Aufenthalt", icon: FileText, color: "bg-destructive" },
    { id: "allgemein", label: "Allgemein", icon: BookOpen, color: "bg-muted" }
  ];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryData = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[0];
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">FAQ - Häufige Fragen</h1>
              <p className="text-sm text-primary-foreground/80">
                Alles über das Leben und Arbeiten in Deutschland
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground/60" />
            <Input
              placeholder="Frage suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 ${isSelected ? category.color : ""}`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? "Frage" : "Fragen"} gefunden
          </p>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="text-primary"
            >
              Suche löschen
            </Button>
          )}
        </div>

        {/* FAQ Accordion */}
        {filteredFAQs.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {filteredFAQs.map((faq, index) => {
              const categoryData = getCategoryData(faq.category);
              return (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border rounded-lg px-5 py-1 fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-start gap-3 text-left">
                      <Badge
                        variant="secondary"
                        className={`flex-shrink-0 ${categoryData.color} text-white`}
                      >
                        {categoryData.label}
                      </Badge>
                      <span className="font-semibold">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 pb-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keine Fragen gefunden</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}>
              Filter zurücksetzen
            </Button>
          </Card>
        )}

        {/* Help Card */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold mb-2">Frage nicht gefunden?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Nutzen Sie unseren AI-Assistenten für individuelle Fragen zu Ihrem Aufenthalt in Deutschland.
          </p>
          <Button className="bg-primary hover:bg-primary/90">
            Zum AI-Assistenten
          </Button>
        </Card>
      </div>

      {/* Floating AI Assistant Button */}
      <Button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 btn-premium animate-bounce"
        onClick={() => router.push("/ai-assistant")}
      >
        <Bot className="w-6 h-6" />
      </Button>
    </div>
  );
}