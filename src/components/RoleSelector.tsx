import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Briefcase } from "lucide-react";

interface RoleSelectorProps {
  onSelectRole: (role: "worker" | "hr_manager") => void;
}

export function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Willkommen bei WorkBridgeDe
          </h1>
          <p className="text-muted-foreground text-lg">
            Dein Guide durch die deutsche Bürokratie
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="p-8 cursor-pointer hover:border-primary transition-all hover:shadow-lg"
            onClick={() => onSelectRole("worker")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Fachkraft / Azubi
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ich bin ein ausländischer Arbeitnehmer und möchte meine Aufgaben verwalten
                </p>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Als Mitarbeiter anmelden
              </Button>
            </div>
          </Card>

          <Card 
            className="p-8 cursor-pointer hover:border-secondary transition-all hover:shadow-lg"
            onClick={() => onSelectRole("hr_manager")}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  HR Manager
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ich bin ein Personalverantwortlicher und möchte mein Team verwalten
                </p>
              </div>
              <Button className="w-full bg-secondary hover:bg-secondary/90">
                Als HR Manager anmelden
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}