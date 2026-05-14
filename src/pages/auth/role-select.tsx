import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase } from "lucide-react";

export default function RoleSelect() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[rgba(16,185,129,0.3)]">
            <span className="text-3xl font-bold text-white" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>WB</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
            Willkommen bei WorkBridgeDe
          </h1>
          <p className="text-[#8fa3b3] text-lg">Wählen Sie Ihren Kontotyp</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Fachkraft / Azubis / Mitarbeiter */}
          <Card 
            className="bg-[#161c21] border-[rgba(16,185,129,0.3)] p-8 cursor-pointer hover:border-[rgba(16,185,129,0.5)] hover:-translate-y-1 transition-all group"
            onClick={() => router.push("/auth/login?role=employee")}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                Fachkraft / Azubi
              </h2>
              <p className="text-[#8fa3b3] mb-6">
                Für ausländische Arbeitnehmer in Deutschland
              </p>
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                  Aufgaben-Checkliste
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                  Dokumentenverwaltung
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></div>
                  AI-Assistent
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold">
                Weiter als Mitarbeiter
              </Button>
            </div>
          </Card>

          {/* HR Manager */}
          <Card 
            className="bg-[#161c21] border-[rgba(59,130,246,0.3)] p-8 cursor-pointer hover:border-[rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all group"
            onClick={() => router.push("/auth/login?role=hr")}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                HR Manager
              </h2>
              <p className="text-[#8fa3b3] mb-6">
                Für Personalverantwortliche
              </p>
              <div className="space-y-2 text-left mb-6">
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                  Team-Dashboard
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                  Mitarbeiterverwaltung
                </div>
                <div className="flex items-center gap-2 text-sm text-[#8fa3b3]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></div>
                  Erinnerungen & Benachrichtigungen
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#1e40af] hover:from-[#60a5fa] hover:to-[#3b82f6] text-white font-semibold">
                Weiter als HR Manager
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}