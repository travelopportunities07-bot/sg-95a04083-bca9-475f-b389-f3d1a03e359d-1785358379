import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, CreditCard, Home, FileText, Wallet, Globe, Briefcase, CheckCircle, Calendar, Star, Award } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

interface Task {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  gradient: string;
  deadline: string;
  xp: number;
  urgent?: boolean;
  completed?: boolean;
  description: string;
  workflow?: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Krankenversicherung abschließen",
      category: "Gesundheit",
      icon: Heart,
      gradient: "from-[#1a0a0a] to-[#2a1010]",
      deadline: "3 Tage",
      xp: 40,
      urgent: true,
      completed: false,
      description: "Schließe eine deutsche Krankenversicherung ab (TK, AOK, DAK)",
      workflow: "/workflows/krankenversicherung"
    },
    {
      id: "2",
      title: "Anmeldung beim Bürgeramt",
      category: "Anmeldung",
      icon: Home,
      gradient: "from-[#0a0a1a] to-[#101028]",
      deadline: "5 Tage",
      xp: 50,
      urgent: true,
      completed: false,
      description: "Melde dich innerhalb von 14 Tagen bei deinem Bürgeramt an",
      workflow: "/tasks"
    },
    {
      id: "3",
      title: "Bankkonto eröffnen",
      category: "Finanzen",
      icon: CreditCard,
      gradient: "from-[#0a1a10] to-[#0f2418]",
      deadline: "7 Tage",
      xp: 30,
      completed: false,
      description: "Eröffne ein deutsches Bankkonto (N26, Deutsche Bank, Sparkasse)",
      workflow: "/workflows/bankkonto"
    },
    {
      id: "4",
      title: "Deutschkurs buchen",
      category: "Integration",
      icon: Globe,
      gradient: "from-[#0a0f1a] to-[#101828]",
      deadline: "14 Tage",
      xp: 30,
      completed: false,
      description: "Melde dich für einen Integrationskurs oder Deutschkurs an",
      workflow: "/workflows/deutschkurs"
    },
    {
      id: "5",
      title: "Steuernummer beantragen",
      category: "Steuern",
      icon: FileText,
      gradient: "from-[#1a1200] to-[#201700]",
      deadline: "30 Tage",
      xp: 40,
      completed: false,
      description: "Beantrage deine Steuer-ID beim Finanzamt",
      workflow: "/tasks"
    },
    {
      id: "6",
      title: "Arbeitsvertrag prüfen",
      category: "Arbeit",
      icon: Briefcase,
      gradient: "from-[#0d1a2e] to-[#0f2040]",
      deadline: "Keine Frist",
      xp: 20,
      completed: true,
      description: "Überprüfe deinen Arbeitsvertrag und verstehe deine Rechte",
      workflow: "/tasks"
    }
  ]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);
  const totalXP = tasks.reduce((sum, t) => sum + (t.completed ? t.xp : 0), 0);

  return (
    <>
      <Topbar title="Aufgaben" subtitle="Deine Checkliste für Deutschland" />
      
      <div className="p-7">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-[#0f2d22] via-[#0a1f17] to-[#071812] border-[rgba(16,185,129,0.3)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                <CheckCircle className="text-[#10b981]" size={18} />
              </div>
              <Badge className="bg-[rgba(16,185,129,0.15)] text-[#34d399] border-[rgba(16,185,129,0.3)] text-xs">
                +{progressPercent}%
              </Badge>
            </div>
            <div className="font-display text-[28px] font-bold text-[#f0f4f8] leading-none mb-1">
              {completedTasks}/{totalTasks}
            </div>
            <div className="text-xs text-[#8fa3b3]">Aufgaben erledigt</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.12)] flex items-center justify-center">
                <Star className="text-[#f59e0b]" size={18} />
              </div>
              <Badge className="bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)] text-xs">
                XP
              </Badge>
            </div>
            <div className="font-display text-[28px] font-bold text-[#f59e0b] leading-none mb-1">
              {totalXP}
            </div>
            <div className="text-xs text-[#8fa3b3]">Gesammelte Punkte</div>
          </Card>

          <Card className="bg-[#161c21] border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.12)] flex items-center justify-center">
                <Calendar className="text-[#ef4444]" size={18} />
              </div>
              <Badge className="bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-[rgba(239,68,68,0.3)] text-xs">
                URGENT
              </Badge>
            </div>
            <div className="font-display text-[28px] font-bold text-[#f0f4f8] leading-none mb-1">
              {tasks.filter(t => t.urgent && !t.completed).length}
            </div>
            <div className="text-xs text-[#8fa3b3]">Dringende Aufgaben</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#0d1a2e] to-[#0f2040] border-[rgba(59,130,246,0.25)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(59,130,246,0.10)] flex items-center justify-center">
                <Award className="text-[#3b82f6]" size={18} />
              </div>
              <Badge className="bg-[rgba(59,130,246,0.15)] text-[#3b82f6] border-[rgba(59,130,246,0.3)] text-xs">
                Level 3
              </Badge>
            </div>
            <div className="font-display text-[28px] font-bold text-[#3b82f6] leading-none mb-1">
              62%
            </div>
            <div className="text-xs text-[#8fa3b3]">Gesamtfortschritt</div>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="bg-[#161c21] border-white/[0.06] p-6 mb-6">
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-medium text-[15px] text-[#f0f4f8]">Dein Fortschritt</span>
            <span className="font-display text-xl font-bold text-[#10b981]">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-3 bg-[#222c35]" />
          <p className="text-xs text-[#566878] mt-2">
            Du hast {completedTasks} von {totalTasks} Aufgaben abgeschlossen. Weiter so! 🎉
          </p>
        </Card>

        {/* Tasks Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-[#161c21] border border-white/[0.06] p-1 mb-6">
            <TabsTrigger 
              value="active" 
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Aktiv ({tasks.filter(t => !t.completed).length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Erledigt ({completedTasks})
            </TabsTrigger>
            <TabsTrigger 
              value="all"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Alle ({totalTasks})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-2">
            {tasks.filter(t => !t.completed).map((task) => {
              const Icon = task.icon;
              return (
                <Card 
                  key={task.id}
                  className={`bg-[#161c21] border-white/[0.06] ${task.urgent ? 'border-l-[3px] border-l-[#f59e0b]' : ''} p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all cursor-pointer`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${task.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={task.urgent ? "text-[#f87171]" : "text-[#10b981]"} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{task.title}</h3>
                    <p className="text-xs text-[#566878] mb-1.5">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                        {task.category}
                      </Badge>
                      <span className="text-[11px] text-[#566878] flex items-center gap-1">
                        <Calendar size={10} /> {task.deadline}
                      </span>
                      {task.urgent && (
                        <Badge className="bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)] text-[10px] px-2 py-0.5">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">
                    +{task.xp} XP
                  </span>
                  <Button 
                    size="sm" 
                    onClick={() => task.workflow && router.push(task.workflow)}
                    className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs font-semibold"
                  >
                    Starten
                  </Button>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="completed" className="space-y-2">
            {tasks.filter(t => t.completed).map((task) => {
              const Icon = task.icon;
              return (
                <Card 
                  key={task.id}
                  className="bg-[#161c21] border-white/[0.06] p-4 flex items-center gap-3.5 opacity-60"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${task.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="text-[#10b981]" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5 line-through">{task.title}</h3>
                    <p className="text-xs text-[#566878] mb-1.5">{task.description}</p>
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {task.category}
                    </Badge>
                  </div>
                  <CheckCircle className="text-[#10b981]" size={20} />
                  <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">
                    +{task.xp} XP
                  </span>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="all" className="space-y-2">
            {tasks.map((task) => {
              const Icon = task.icon;
              return (
                <Card 
                  key={task.id}
                  className={`bg-[#161c21] border-white/[0.06] ${task.urgent && !task.completed ? 'border-l-[3px] border-l-[#f59e0b]' : ''} p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all cursor-pointer ${task.completed ? 'opacity-60' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${task.gradient} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={task.urgent && !task.completed ? "text-[#f87171]" : "text-[#10b981]"} size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm text-[#f0f4f8] mb-0.5 ${task.completed ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-[#566878] mb-1.5">{task.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                        {task.category}
                      </Badge>
                      {!task.completed && (
                        <span className="text-[11px] text-[#566878] flex items-center gap-1">
                          <Calendar size={10} /> {task.deadline}
                        </span>
                      )}
                      {task.urgent && !task.completed && (
                        <Badge className="bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)] text-[10px] px-2 py-0.5">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  </div>
                  {task.completed ? (
                    <CheckCircle className="text-[#10b981]" size={20} />
                  ) : null}
                  <span className="text-[11px] font-semibold text-[#10b981] bg-[rgba(16,185,129,0.15)] rounded-full px-2 py-1">
                    +{task.xp} XP
                  </span>
                  {!task.completed && (
                    <Button 
                      size="sm" 
                      onClick={() => task.workflow && router.push(task.workflow)}
                      className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs font-semibold"
                    >
                      Starten
                    </Button>
                  )}
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}