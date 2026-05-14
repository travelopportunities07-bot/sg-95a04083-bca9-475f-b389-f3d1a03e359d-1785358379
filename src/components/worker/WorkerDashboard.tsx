import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { 
  CheckSquare, 
  Star, 
  Calendar,
  HeartPulse,
  Globe,
  MapPin,
  CreditCard,
  Receipt,
  Briefcase,
  ArrowRight,
  Trophy,
  Users,
  Bell,
  FileQuestion
} from "lucide-react";
import { useRouter } from "next/router";

export function WorkerDashboard() {
  const router = useRouter();
  const progressPercentage = 62;
  const completedTasks = 5;
  const totalTasks = 8;
  const xpPoints = 340;
  const activeDays = 12;

  const nextTasks = [
    {
      id: "1",
      title: "Krankenversicherung abschließen",
      category: "Gesundheit",
      icon: HeartPulse,
      xp: 40,
      urgent: true,
      deadline: "3 Tage"
    },
    {
      id: "2",
      title: "Bankkonto eröffnen",
      category: "Finanzen",
      icon: CreditCard,
      xp: 30,
      urgent: false,
      deadline: "7 Tage"
    },
    {
      id: "3",
      title: "Deutschkurs buchen",
      category: "Integration",
      icon: Globe,
      xp: 30,
      urgent: false,
      deadline: "14 Tage"
    }
  ];

  const badges = [
    { id: "1", name: "Starter", icon: "🏁", unlocked: true },
    { id: "2", name: "Task Hunter", icon: "📋", unlocked: true },
    { id: "3", name: "Doc Master", icon: "📄", unlocked: false },
    { id: "4", name: "Angemeldet", icon: "🏠", unlocked: false },
    { id: "5", name: "On the Way", icon: "💪", unlocked: true },
  ];

  const getProgressLevel = (percentage: number) => {
    if (percentage < 30) return { label: "Beginner", color: "text-destructive" };
    if (percentage < 70) return { label: "Fortgeschritten", color: "text-warning" };
    if (percentage < 100) return { label: "Fast fertig", color: "text-accent" };
    return { label: "Integriert", color: "text-success" };
  };

  const level = getProgressLevel(progressPercentage);

  return (
    <div className="min-h-screen bg-background">
      {/* Premium Header with Glass Morphism */}
      <div className="bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary opacity-50"></div>
        
        <div className="container relative py-8 fade-in-down">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                JD
              </div>
              <div>
                <h1 className="text-2xl font-bold">Willkommen, Jean 🇩🇪</h1>
                <p className="text-primary-foreground/80 text-sm">
                  Dein Guide durch die deutsche Bürokratie
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeSwitch />
              <Button 
                variant="secondary" 
                size="icon" 
                className="relative btn-premium"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  2
                </span>
              </Button>
            </div>
          </div>

          {/* Integration Level Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 scale-in">
            <span className="text-sm font-medium">{level.label}</span>
            <Badge className={`${level.color} bg-primary-foreground text-primary px-2`}>
              {progressPercentage}%
            </Badge>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Progress Card with Premium Animations */}
        <Card className="p-6 premium-card fade-in-up">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gesamtfortschritt</h2>
              <span className="text-3xl font-bold text-primary smooth-transition hover:scale-110">
                {progressPercentage}%
              </span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3 progress-glow" />
              <div className="absolute inset-0 shimmer pointer-events-none rounded-full overflow-hidden"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {completedTasks} von {totalTasks} Aufgaben erledigt
            </p>
          </div>
        </Card>

        {/* KPI Cards with Stagger Animation */}
        <div className="grid grid-cols-3 gap-4 stagger-children">
          <Card className="p-4 text-center premium-card-interactive bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CheckSquare className="w-8 h-8 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-primary">{totalTasks - completedTasks}</div>
            <div className="text-xs text-muted-foreground mt-1">Aufgaben</div>
          </Card>
          
          <Card className="p-4 text-center premium-card-interactive bg-gradient-to-br from-warning/5 to-warning/10 border-warning/20">
            <Star className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-warning">{xpPoints}</div>
            <div className="text-xs text-muted-foreground mt-1">XP</div>
          </Card>
          
          <Card className="p-4 text-center premium-card-interactive bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
            <Calendar className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{activeDays}</div>
            <div className="text-xs text-muted-foreground mt-1">Tage aktiv</div>
          </Card>
        </div>

        {/* Next Tasks Section */}
        <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Nächste Aufgaben</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary hover:text-primary/80 hover:bg-primary/5 smooth-transition"
            >
              Alle anzeigen
              <ArrowRight className="w-4 h-4 ml-1 smooth-transition group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {nextTasks.map((task, index) => (
              <Card 
                key={task.id}
                className={`p-4 premium-card-interactive ripple-effect ${
                  task.urgent ? "border-l-4 border-l-warning shadow-warning/10" : ""
                }`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 smooth-transition hover:scale-110 hover:bg-primary/20">
                    <task.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
                        <p className="text-xs text-muted-foreground">{task.category}</p>
                      </div>
                      <Badge className="bg-warning/20 text-warning-foreground hover:bg-warning/30 smooth-transition">
                        +{task.xp} XP
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{task.deadline}</span>
                      </div>
                      {task.urgent && (
                        <Badge className="bg-warning text-xs">Urgent</Badge>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 btn-premium"
                    onClick={() => {
                      if (task.id === "1") router.push("/workflows/krankenversicherung");
                      else if (task.id === "2") router.push("/workflows/bankkonto");
                      else if (task.id === "3") router.push("/workflows/deutschkurs");
                    }}
                  >
                    Starten
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Badges Section with Scale Animation */}
        <div className="fade-in-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-warning" />
            <h2 className="text-xl font-bold">Deine Abzeichen</h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {badges.map((badge, index) => (
              <Card
                key={badge.id}
                className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center gap-2 smooth-transition hover:scale-110 ${
                  badge.unlocked
                    ? "premium-card bg-gradient-to-br from-warning/10 to-warning/5 border-warning/30 cursor-pointer"
                    : "opacity-40 grayscale"
                }`}
                style={{ animationDelay: `${0.5 + index * 0.05}s` }}
              >
                <span className="text-3xl">{badge.icon}</span>
                <span className="text-xs font-medium text-center">{badge.name}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Navigation with Glass Morphism */}
        <div className="fixed bottom-0 left-0 right-0 glass-morphism border-t border-border shadow-lg fade-in-up">
          <div className="container">
            <div className="flex items-center justify-around py-4">
              <Button 
                variant="ghost" 
                className="flex-col h-auto gap-1 text-primary smooth-transition hover:scale-105"
                onClick={() => router.push("/")}
              >
                <Users className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-col h-auto gap-1 smooth-transition hover:scale-105"
                onClick={() => router.push("/tasks")}
              >
                <CheckSquare className="w-5 h-5" />
                <span className="text-xs">Aufgaben</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-col h-auto gap-1 smooth-transition hover:scale-105"
                onClick={() => router.push("/documents")}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs">Dokumente</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-col h-auto gap-1 smooth-transition hover:scale-105"
                onClick={() => router.push("/faq")}
              >
                <FileQuestion className="w-5 h-5" />
                <span className="text-xs">FAQ</span>
              </Button>
              <Button 
                variant="ghost" 
                className="flex-col h-auto gap-1 smooth-transition hover:scale-105"
                onClick={() => router.push("/profile")}
              >
                <Trophy className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}