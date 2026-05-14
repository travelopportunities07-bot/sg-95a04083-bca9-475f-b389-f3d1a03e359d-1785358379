import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "worker" | "hr_manager") => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-[#0a0d0f] flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <div className="text-center mb-12 fade-in-up">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[rgba(16,185,129,0.3)]">
            <span className="text-3xl font-bold text-white" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>WB</span>
          </div>
          <h1 className="text-4xl font-bold text-[#f0f4f8] mb-3" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
            Willkommen bei WorkBridgeDe
          </h1>
          <p className="text-[#8fa3b3] text-lg">
            Dein Guide durch die deutsche Bürokratie
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 stagger-children">
          <Card 
            className="p-8 cursor-pointer premium-card-interactive bg-[#161c21] border-[rgba(255,255,255,0.06)] hover:border-[rgba(16,185,129,0.3)] transition-all"
            onClick={() => onSelectRole("worker")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-[#34d399]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                  Fachkraft / Azubi
                </h3>
                <p className="text-[#8fa3b3] text-sm">
                  Ich bin ein ausländischer Arbeitnehmer und möchte meine Aufgaben verwalten
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium">
                Als Mitarbeiter anmelden
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer premium-card-interactive bg-[#161c21] border-[rgba(255,255,255,0.06)] hover:border-[rgba(16,185,129,0.3)] transition-all"
            onClick={() => onSelectRole("hr_manager")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[rgba(59,130,246,0.15)] border border-[rgba(59,130,246,0.3)] flex items-center justify-center">
                <Users className="w-8 h-8 text-[#3b82f6]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                  HR Manager
                </h3>
                <p className="text-[#8fa3b3] text-sm">
                  Ich bin ein Personalverantwortlicher und möchte mein Team verwalten
                </p>
              </div>
              <Button className="w-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#60a5fa] hover:to-[#3b82f6] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(59,130,246,0.3)] btn-premium">
                Als HR Manager anmelden
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}