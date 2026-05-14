import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle, Scale } from "lucide-react";

export default function AGBPage() {
  return (
    <>
      <Topbar title="AGB" subtitle="Allgemeine Geschäftsbedingungen" />

      <div className="p-7 max-w-4xl mx-auto">
        <Card className="bg-[#161c21] border-white/[0.06] p-8">
          <div className="space-y-8">
            {/* Intro */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Allgemeine Geschäftsbedingungen
                </h2>
              </div>
              <p className="text-[#8fa3b3] text-sm leading-relaxed pl-13">
                Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der WorkBridgeDe-Plattform durch Nutzer.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  § 1 Geltungsbereich
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Diese AGB gelten für alle Verträge über die Nutzung der WorkBridgeDe-Plattform zwischen der WorkBridgeDe GmbH (nachfolgend "Anbieter") und den Nutzern der Plattform.
                </p>
                <p>
                  Die Plattform dient der Unterstützung ausländischer Arbeitnehmer bei administrativen Aufgaben in Deutschland sowie der Verwaltung dieser Prozesse durch HR-Manager.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  § 2 Vertragsschluss
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Der Vertrag kommt durch die Registrierung auf der Plattform zustande. Mit der Registrierung erkennt der Nutzer diese AGB als verbindlich an.
                </p>
                <p>
                  Die Registrierung ist nur volljährigen, geschäftsfähigen Personen gestattet.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                § 3 Leistungsumfang
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Der Anbieter stellt folgende Funktionen zur Verfügung:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Verwaltung von Aufgaben und Checklisten</li>
                  <li>Dokumentenverwaltung und -upload</li>
                  <li>Erinnerungsfunktionen</li>
                  <li>AI-gestützter Assistent für Fragen</li>
                  <li>Dashboard für HR-Manager</li>
                  <li>Mehrsprachige Unterstützung (Deutsch, Englisch)</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  § 4 Pflichten des Nutzers
                </h2>
              </div>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Der Nutzer verpflichtet sich:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Wahrheitsgemäße Angaben bei der Registrierung zu machen</li>
                  <li>Zugangsdaten vertraulich zu behandeln</li>
                  <li>Die Plattform nicht missbräuchlich zu nutzen</li>
                  <li>Keine rechtswidrigen Inhalte hochzuladen</li>
                  <li>Die Rechte Dritter zu respektieren</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                § 5 Haftung
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Der Anbieter haftet nicht für die Richtigkeit, Vollständigkeit oder Aktualität der über die Plattform bereitgestellten Informationen.
                </p>
                <p>
                  Die Haftung für Schäden ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit nicht zwingende gesetzliche Regelungen entgegenstehen.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                § 6 Kündigung
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Der Nutzer kann sein Konto jederzeit kündigen. Die Kündigung erfolgt über die Einstellungen oder per E-Mail an support@workbridgede.de.
                </p>
                <p>
                  Der Anbieter kann das Vertragsverhältnis bei Verstößen gegen diese AGB mit sofortiger Wirkung kündigen.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                § 7 Änderungen der AGB
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Der Anbieter behält sich vor, diese AGB jederzeit zu ändern. Nutzer werden über Änderungen per E-Mail informiert.
                </p>
                <p>
                  Die Nutzung der Plattform nach Inkrafttreten der geänderten AGB gilt als Zustimmung zu den Änderungen.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                § 8 Schlussbestimmungen
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>
                  Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
                </p>
                <p>
                  Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
                </p>
              </div>
            </section>

            {/* Last Updated */}
            <div className="pt-6 border-t border-white/[0.06]">
              <p className="text-xs text-[#566878]">
                Stand: Mai 2026
              </p>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}