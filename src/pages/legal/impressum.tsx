import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Building2, Mail, Phone, Scale } from "lucide-react";

export default function ImpressumPage() {
  return (
    <>
      <Topbar title="Impressum" subtitle="Rechtliche Informationen" />

      <div className="p-7 max-w-4xl mx-auto">
        <Card className="bg-[#161c21] border-white/[0.06] p-8">
          <div className="space-y-8">
            {/* Company Info */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Angaben gemäß § 5 TMG
                </h2>
              </div>
              <div className="pl-13 space-y-2 text-[#8fa3b3]">
                <p className="text-[#f0f4f8] font-semibold">WorkBridgeDe GmbH</p>
                <p>Musterstraße 123</p>
                <p>10115 Berlin</p>
                <p>Deutschland</p>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Kontakt
                </h2>
              </div>
              <div className="pl-13 space-y-2 text-[#8fa3b3]">
                <p><span className="text-[#f0f4f8] font-medium">E-Mail:</span> info@workbridgede.de</p>
                <p><span className="text-[#f0f4f8] font-medium">Telefon:</span> +49 30 12345678</p>
                <p><span className="text-[#f0f4f8] font-medium">Fax:</span> +49 30 12345679</p>
              </div>
            </section>

            {/* Legal */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center">
                  <Scale className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque'}}>
                  Registereintrag
                </h2>
              </div>
              <div className="pl-13 space-y-2 text-[#8fa3b3]">
                <p><span className="text-[#f0f4f8] font-medium">Handelsregister:</span> HRB 123456</p>
                <p><span className="text-[#f0f4f8] font-medium">Registergericht:</span> Amtsgericht Berlin-Charlottenburg</p>
                <p><span className="text-[#f0f4f8] font-medium">Umsatzsteuer-ID:</span> DE123456789</p>
              </div>
            </section>

            {/* Management */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Vertreten durch
              </h2>
              <div className="pl-13 space-y-2 text-[#8fa3b3]">
                <p className="text-[#f0f4f8]">Geschäftsführer: Max Mustermann</p>
              </div>
            </section>

            {/* Liability */}
            <section>
              <h2 className="text-xl font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque'}}>
                Haftungsausschluss
              </h2>
              <div className="space-y-4 text-[#8fa3b3] text-sm">
                <div>
                  <h3 className="text-[#f0f4f8] font-semibold mb-2">Haftung für Inhalte</h3>
                  <p>
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#f0f4f8] font-semibold mb-2">Haftung für Links</h3>
                  <p>
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#f0f4f8] font-semibold mb-2">Urheberrecht</h3>
                  <p>
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </Card>
      </div>
    </>
  );
}