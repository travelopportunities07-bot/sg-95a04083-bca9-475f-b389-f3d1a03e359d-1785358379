import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Accessibility, Eye, Ear, Keyboard, Monitor } from "lucide-react";

export default function BarrierefreiheitPage() {
  return (
    <>
      <Topbar title="Barrierefreiheitserklärung" subtitle="Unser Engagement für Zugänglichkeit" />

      <div className="p-7 max-w-4xl mx-auto">
        <Card className="bg-[#161c21] border-white/[0.06] p-8">
          <div className="space-y-8">
            {/* Intro */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <Accessibility className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Barrierefreiheit
                </h2>
              </div>
              <p className="text-[#8fa3b3] text-sm leading-relaxed pl-13">
                WorkBridgeDe ist bestrebt, seine Website für alle Menschen zugänglich zu machen, unabhängig von ihren Fähigkeiten oder Technologien. Wir bemühen uns, die Web Content Accessibility Guidelines (WCAG) 2.1 Level AA einzuhalten.
              </p>
            </section>

            {/* Visual */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Visuelle Zugänglichkeit
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Unsere Plattform bietet folgende Funktionen für sehbehinderte Nutzer:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Ausreichende Kontrastverhältnisse (WCAG AA-konform)</li>
                  <li>Skalierbare Schriftgrößen</li>
                  <li>Klare, lesbare Schriftarten</li>
                  <li>Alternative Texte für alle Bilder</li>
                  <li>Kompatibilität mit Screenreadern</li>
                </ul>
              </div>
            </section>

            {/* Keyboard */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Tastaturnavigation
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Die gesamte Plattform kann ohne Maus navigiert werden:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Tab-Navigation durch alle interaktiven Elemente</li>
                  <li>Enter/Space zur Aktivierung von Buttons</li>
                  <li>Pfeiltasten in Menüs und Listen</li>
                  <li>Escape zum Schließen von Dialogen</li>
                  <li>Sichtbare Fokusindikatoren</li>
                </ul>
              </div>
            </section>

            {/* Content */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Inhaltsstruktur
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Unsere Inhalte sind strukturiert und semantisch korrekt:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Logische Überschriftenhierarchie</li>
                  <li>Semantische HTML-Elemente</li>
                  <li>ARIA-Labels wo nötig</li>
                  <li>Klare Linkbeschreibungen</li>
                  <li>Konsistente Navigation</li>
                </ul>
              </div>
            </section>

            {/* Language */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center">
                  <Ear className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Mehrsprachigkeit
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Die Plattform ist in Deutsch und Englisch verfügbar. Nutzer können jederzeit zwischen den Sprachen wechseln.
                </p>
                <p>
                  Wir bemühen uns, einfache und klare Sprache zu verwenden, um die Verständlichkeit für alle Nutzer zu gewährleisten.
                </p>
              </div>
            </section>

            {/* Standards */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Einhaltung von Standards
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>WorkBridgeDe orientiert sich an folgenden Standards:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>WCAG 2.1 Level AA</li>
                  <li>BITV 2.0 (Barrierefreie-Informationstechnik-Verordnung)</li>
                  <li>EN 301 549</li>
                  <li>Section 508 (USA)</li>
                </ul>
              </div>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Feedback und Kontakt
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Wir sind ständig bemüht, die Barrierefreiheit unserer Plattform zu verbessern. Wenn Sie auf Barrieren stoßen oder Verbesserungsvorschläge haben, kontaktieren Sie uns bitte:
                </p>
                <div className="mt-3 space-y-2">
                  <p><span className="text-[#f0f4f8] font-medium">E-Mail:</span> barrierefreiheit@workbridgede.de</p>
                  <p><span className="text-[#f0f4f8] font-medium">Telefon:</span> +49 30 12345678</p>
                </div>
                <p className="mt-3">
                  Wir werden Ihr Feedback innerhalb von 7 Werktagen beantworten und uns bemühen, identifizierte Probleme so schnell wie möglich zu beheben.
                </p>
              </div>
            </section>

            {/* Known Issues */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Bekannte Einschränkungen
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Trotz unserer Bemühungen gibt es möglicherweise noch Bereiche, die nicht vollständig barrierefrei sind. Wir arbeiten kontinuierlich daran, diese zu verbessern:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Einige PDF-Dokumente sind möglicherweise nicht vollständig barrierefrei</li>
                  <li>Komplexe Datenvisualisierungen könnten alternative Darstellungen benötigen</li>
                </ul>
              </div>
            </section>

            {/* Last Updated */}
            <div className="pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-[#566878]">
                Letzte Aktualisierung: Mai 2026
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}