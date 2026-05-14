import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topbar } from "@/components/Topbar";
import {
  Search,
  Home,
  Briefcase,
  FileText,
  HeartPulse,
  MapPin,
  BookOpen,
  ChevronDown,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { useRouter } from "next/router";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "anmeldung" | "arbeiten" | "steuern" | "sozialversicherung" | "aufenthalt" | "allgemein";
}

const faqData: FAQItem[] = [
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
    answer: "Die Sozialversicherungsnummer (Rentenversicherungsnummer) ist Ihre eindeutige Identifikationsnummer für Renten- und Sozialversicherung. Sie bekommen sie automatisch bei der ersten Beschäftigung. Format: 12 Ziffern (z.B. 12 010478 A 123). Sie finden sie auf: Sozialversicherungsausweis, Renteninformation, Gehaltsabrechung. Arbeitgeber benötigt sie für Anmeldung.",
    category: "sozialversicherung"
  },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set());

  const categories = [
    { 
      id: "all", 
      label: "Alle", 
      icon: BookOpen, 
      gradient: "from-[#10b981] to-[#34d399]",
      bgGradient: "from-[#0a1a10] to-[#0f2418]",
      borderColor: "rgba(16,185,129,0.3)",
      emoji: "📚"
    },
    { 
      id: "anmeldung", 
      label: "Anmeldung", 
      icon: Home, 
      gradient: "from-[#3b82f6] to-[#60a5fa]",
      bgGradient: "from-[#0a0f1a] to-[#101828]",
      borderColor: "rgba(59,130,246,0.3)",
      emoji: "🏠"
    },
    { 
      id: "arbeiten", 
      label: "Arbeiten", 
      icon: Briefcase, 
      gradient: "from-[#10b981] to-[#34d399]",
      bgGradient: "from-[#0a1a10] to-[#0f2418]",
      borderColor: "rgba(16,185,129,0.3)",
      emoji: "💼"
    },
    { 
      id: "steuern", 
      label: "Steuern", 
      icon: FileText, 
      gradient: "from-[#f59e0b] to-[#fbbf24]",
      bgGradient: "from-[#1a1200] to-[#201700]",
      borderColor: "rgba(245,158,11,0.3)",
      emoji: "📋"
    },
    { 
      id: "sozialversicherung", 
      label: "Versicherung", 
      icon: HeartPulse, 
      gradient: "from-[#ef4444] to-[#f87171]",
      bgGradient: "from-[#1a0a0a] to-[#2a1010]",
      borderColor: "rgba(239,68,68,0.3)",
      emoji: "❤️"
    },
    { 
      id: "aufenthalt", 
      label: "Aufenthalt", 
      icon: MapPin, 
      gradient: "from-[#8b5cf6] to-[#a78bfa]",
      bgGradient: "from-[#0d0a1a] to-[#141028]",
      borderColor: "rgba(139,92,246,0.3)",
      emoji: "🌍"
    },
    { 
      id: "allgemein", 
      label: "Allgemein", 
      icon: Sparkles, 
      gradient: "from-[#06b6d4] to-[#22d3ee]",
      bgGradient: "from-[#0a1418] to-[#0f2024]",
      borderColor: "rgba(6,182,212,0.3)",
      emoji: "✨"
    }
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

  const toggleQuestion = (id: string) => {
    setOpenQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <>
      <Topbar title="FAQ" subtitle="Häufig gestellte Fragen" />
      
      <div className="p-7">
        {/* Hero Section with Gradient */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2d22] via-[#0a1f17] to-[#071812] border border-[rgba(16,185,129,0.3)] p-8 mb-6">
          <div className="absolute top-[-40px] right-[-40px] w-[200px] h-[200px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)]" />
          <div className="absolute bottom-[-60px] right-[120px] w-[160px] h-[160px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_70%)]" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] rounded-full px-4 py-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#34d399]" />
              <span className="text-xs font-medium text-[#34d399] uppercase tracking-wider">Hilfe & Support</span>
            </div>
            <h2 className="font-display text-[26px] font-bold text-[#f0f4f8] mb-2">Häufig gestellte Fragen</h2>
            <p className="text-[13px] text-[#8fa3b3] mb-4 max-w-xl">
              Finde schnelle Antworten zu Leben und Arbeiten in Deutschland. Von Anmeldung bis Steuern – alles an einem Ort.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#566878]" />
              <Input
                placeholder="Frage suchen... (z.B. 'Krankenversicherung', 'Anmeldung')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-[#161c21] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] placeholder:text-[#566878] rounded-xl h-12 focus:border-[rgba(16,185,129,0.3)] focus:ring-[rgba(16,185,129,0.15)]"
              />
            </div>
          </div>
        </div>

        {/* Category Filters with Emojis */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#8fa3b3] uppercase tracking-wider mb-3">Kategorien</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative overflow-hidden rounded-xl p-4 transition-all hover:scale-105 ${
                    isSelected 
                      ? `bg-gradient-to-br ${category.bgGradient} border-2` 
                      : 'bg-[#161c21] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.10)]'
                  }`}
                  style={{ borderColor: isSelected ? category.borderColor : undefined }}
                >
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-br opacity-10" 
                         style={{ background: `linear-gradient(to bottom right, ${category.borderColor}, transparent)` }} />
                  )}
                  <div className="relative flex flex-col items-center gap-2">
                    <span className="text-2xl">{category.emoji}</span>
                    <span className={`text-xs font-semibold ${isSelected ? 'text-[#f0f4f8]' : 'text-[#8fa3b3] group-hover:text-[#f0f4f8]'}`}>
                      {category.label}
                    </span>
                    <Badge className={`text-[10px] px-2 py-0.5 ${
                      isSelected 
                        ? 'bg-[rgba(16,185,129,0.15)] text-[#34d399] border-[rgba(16,185,129,0.3)]' 
                        : 'bg-[rgba(255,255,255,0.05)] text-[#566878] border-[rgba(255,255,255,0.06)]'
                    }`}>
                      {faqData.filter(f => category.id === "all" || f.category === category.id).length}
                    </Badge>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-[#8fa3b3]">
            <span className="font-semibold text-[#10b981]">{filteredFAQs.length}</span> {filteredFAQs.length === 1 ? "Frage" : "Fragen"} gefunden
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-[#34d399] hover:text-[#10b981] font-medium flex items-center gap-1"
            >
              Suche löschen ✕
            </button>
          )}
        </div>

        {/* FAQ List with Colorful Categories */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => {
              const categoryData = getCategoryData(faq.category);
              const isOpen = openQuestions.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`group relative overflow-hidden bg-[#161c21] border rounded-xl hover:border-[rgba(255,255,255,0.10)] transition-all`}
                  style={{ 
                    borderColor: isOpen ? categoryData.borderColor : 'rgba(255,255,255,0.06)',
                    animationDelay: `${index * 0.05}s` 
                  }}
                >
                  {isOpen && (
                    <div className="absolute inset-0 bg-gradient-to-br opacity-5" 
                         style={{ background: `linear-gradient(to bottom right, ${categoryData.borderColor}, transparent)` }} />
                  )}
                  <button
                    onClick={() => toggleQuestion(faq.id)}
                    className="relative w-full px-6 py-5 flex items-start gap-4 text-left"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${categoryData.bgGradient} border flex items-center justify-center`}
                         style={{ borderColor: categoryData.borderColor }}>
                      <span className="text-xl">{categoryData.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          className={`bg-gradient-to-r text-xs px-2.5 py-0.5 font-medium`}
                          style={{ 
                            background: `linear-gradient(to right, ${categoryData.borderColor}40, ${categoryData.borderColor}20)`,
                            color: '#8fa3b3',
                            borderColor: categoryData.borderColor
                          }}
                        >
                          {categoryData.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-[15px] text-[#f0f4f8] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown 
                      className={`flex-shrink-0 w-5 h-5 text-[#566878] transition-transform ${isOpen ? 'rotate-180 text-[#10b981]' : ''}`} 
                    />
                  </button>
                  {isOpen && (
                    <div className="relative px-6 pb-5 pt-2">
                      <div className="pl-14 text-sm text-[#8fa3b3] leading-relaxed border-t border-[rgba(255,255,255,0.06)] pt-4">
                        {faq.answer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center bg-[#161c21] border-[rgba(255,255,255,0.06)]">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-[#10b981]" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-[#f0f4f8] font-display">
              Keine Fragen gefunden
            </h3>
            <p className="text-sm text-[#8fa3b3] mb-4 max-w-md mx-auto">
              Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="bg-[rgba(16,185,129,0.15)] hover:bg-[rgba(16,185,129,0.25)] text-[#34d399] border border-[rgba(16,185,129,0.3)]"
            >
              Filter zurücksetzen
            </Button>
          </Card>
        )}

        {/* AI Assistant CTA */}
        <div className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1a2e] via-[#0f2040] to-[#0a1428] border border-[rgba(59,130,246,0.3)] p-6">
          <div className="absolute top-[-30px] right-[-30px] w-[150px] h-[150px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15),transparent_70%)]" />
          <div className="relative z-10 flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#1d4ed8] flex items-center justify-center flex-shrink-0 shadow-lg">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-[#f0f4f8] mb-2">
                Frage nicht gefunden? 🤖
              </h3>
              <p className="text-sm text-[#8fa3b3] mb-4 leading-relaxed">
                Unser AI-Assistent steht bereit, um Ihre individuellen Fragen zu beantworten. Erhalten Sie personalisierte Hilfe zu Ihrer Situation in Deutschland.
              </p>
              <Button 
                onClick={() => router.push("/ai-assistant")}
                className="bg-gradient-to-r from-[#3b82f6] to-[#1d4ed8] hover:from-[#2563eb] hover:to-[#1e40af] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Zum AI-Assistenten
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}