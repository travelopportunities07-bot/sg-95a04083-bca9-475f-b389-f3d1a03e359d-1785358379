import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function DatenschutzPage() {
  return (
    <>
      <Topbar title="Datenschutzerklärung" subtitle="Schutz Ihrer persönlichen Daten" />

      <div className="p-7 max-w-4xl mx-auto">
        <Card className="bg-[#161c21] border-white/[0.06] p-8">
          <div className="space-y-8">
            {/* Intro */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Datenschutz
                </h2>
              </div>
              <p className="text-[#8fa3b3] text-sm leading-relaxed pl-13">
                Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
              </p>
            </section>

            {/* Data Collection */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center">
                  <Database className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Erfassung und Verarbeitung von Daten
                </h2>
              </div>
              <div className="pl-13 space-y-4 text-[#8fa3b3] text-sm">
                <div>
                  <h3 className="text-[#f0f4f8] font-semibold mb-2">Welche Daten werden erfasst?</h3>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Name, Vorname</li>
                    <li>E-Mail-Adresse</li>
                    <li>Telefonnummer</li>
                    <li>Ankunftsdatum in Deutschland</li>
                    <li>Nationalität</li>
                    <li>Sprachniveau</li>
                    <li>Hochgeladene Dokumente</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-[#f0f4f8] font-semibold mb-2">Zweck der Datenverarbeitung</h3>
                  <p>
                    Wir verarbeiten Ihre Daten ausschließlich zur Erfüllung der vertraglich vereinbarten Leistungen, insbesondere zur Unterstützung bei administrativen Aufgaben in Deutschland.
                  </p>
                </div>
              </div>
            </section>

            {/* Legal Basis */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Rechtsgrundlage
                </h2>
              </div>
              <div className="pl-13 space-y-4 text-[#8fa3b3] text-sm">
                <p>
                  Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage der folgenden Rechtsgrundlagen:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                  <li>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)</li>
                  <li>Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung)</li>
                  <li>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Datensicherheit
                </h2>
              </div>
              <div className="pl-13 space-y-4 text-[#8fa3b3] text-sm">
                <p>
                  Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder den Zugriff unberechtigter Personen zu schützen.
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>SSL/TLS-Verschlüsselung für Datenübertragung</li>
                  <li>Regelmäßige Sicherheits-Updates</li>
                  <li>Zugriffskontrollen und Authentifizierung</li>
                  <li>Regelmäßige Datensicherungen</li>
                </ul>
              </div>
            </section>

            {/* User Rights */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Ihre Rechte
              </h2>
              <div className="pl-13 space-y-3 text-[#8fa3b3] text-sm">
                <p>Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li><span className="text-[#f0f4f8] font-medium">Auskunftsrecht:</span> Sie können Auskunft über Ihre gespeicherten Daten verlangen</li>
                  <li><span className="text-[#f0f4f8] font-medium">Berichtigungsrecht:</span> Sie können die Berichtigung unrichtiger Daten verlangen</li>
                  <li><span className="text-[#f0f4f8] font-medium">Löschungsrecht:</span> Sie können die Löschung Ihrer Daten verlangen</li>
                  <li><span className="text-[#f0f4f8] font-medium">Widerspruchsrecht:</span> Sie können der Verarbeitung widersprechen</li>
                  <li><span className="text-[#f0f4f8] font-medium">Datenübertragbarkeit:</span> Sie können die Übertragung Ihrer Daten verlangen</li>
                </ul>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Kontakt Datenschutzbeauftragter
              </h2>
              <div className="pl-13 space-y-2 text-[#8fa3b3] text-sm">
                <p><span className="text-[#f0f4f8] font-medium">E-Mail:</span> datenschutz@workbridgede.de</p>
                <p><span className="text-[#f0f4f8] font-medium">Telefon:</span> +49 30 12345678</p>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </>
  );
}