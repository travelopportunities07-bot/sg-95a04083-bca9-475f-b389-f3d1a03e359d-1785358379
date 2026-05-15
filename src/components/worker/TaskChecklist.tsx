import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { notifications } from "@/lib/notifications";
import { DocumentUpload } from "@/components/DocumentUpload";
import { useAuth } from "@/contexts/AuthContext";
import { markTaskAsCompleted, updateTaskStatus } from "@/services/taskService";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  HeartPulse,
  Globe,
  MapPin,
  CreditCard,
  Receipt,
  Briefcase,
  Search,
  CheckCircle2,
  Circle,
  Calendar,
  FileText,
  MessageCircle,
  Sparkles
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  xp: number;
  urgent: boolean;
  completed: boolean;
  deadline: string;
  steps: string[];
  requiredDocs: string[];
}

interface Category {
  id: string;
  name: string;
  icon: any;
  tasks: Task[];
  color: string;
}

export function TaskChecklist() {
  const { user } = useAuth();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "completed" | "urgent">("all");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set(["i1"]));
  const [confirmCompleteTask, setConfirmCompleteTask] = useState<Task | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadingForTask, setUploadingForTask] = useState<Task | null>(null);

  const categories: Category[] = [
    {
      id: "gesundheit",
      name: "Gesundheit",
      icon: HeartPulse,
      color: "text-red-500",
      tasks: [
        {
          id: "g1",
          title: "Krankenversicherung abschließen",
          description: "Gesetzliche Krankenversicherung ist in Deutschland Pflicht",
          xp: 40,
          urgent: true,
          completed: completedTasks.has("g1"),
          deadline: "7 Tage",
          steps: [
            "Vergleiche Krankenkassen (TK, AOK, Barmer, etc.)",
            "Wähle eine Krankenkasse aus",
            "Fülle das Online-Formular aus",
            "Erhalte deine Versicherungskarte per Post"
          ],
          requiredDocs: ["Passeport", "Arbeitsvertrag", "Anmeldebescheinigung"]
        },
        {
          id: "g2",
          title: "Hausarzt registrieren",
          description: "Finde einen Hausarzt in deiner Nähe",
          xp: 20,
          urgent: false,
          completed: completedTasks.has("g2"),
          deadline: "30 Tage",
          steps: [
            "Suche Hausärzte in deiner Nähe (Google Maps)",
            "Rufe an und vereinbare einen Termin",
            "Bringe deine Versicherungskarte mit"
          ],
          requiredDocs: ["Krankenversicherungskarte"]
        }
      ]
    },
    {
      id: "integration",
      name: "Integration",
      icon: Globe,
      color: "text-blue-500",
      tasks: [
        {
          id: "i1",
          title: "Deutschkurs buchen",
          description: "Verbessere deine Deutschkenntnisse",
          xp: 30,
          urgent: false,
          completed: completedTasks.has("i1"),
          deadline: "14 Tage",
          steps: [
            "Finde Sprachschulen in deiner Stadt",
            "Wähle das passende Niveau (A1-C2)",
            "Melde dich an und zahle die Gebühr"
          ],
          requiredDocs: []
        },
        {
          id: "i2",
          title: "Integrationskurs anmelden",
          description: "Offizieller Kurs für Integration in Deutschland",
          xp: 40,
          urgent: false,
          completed: completedTasks.has("i2"),
          deadline: "60 Tage",
          steps: [
            "Beantrage den Berechtigungsschein beim BAMF",
            "Wähle einen Kursträger aus",
            "Melde dich zum Kurs an"
          ],
          requiredDocs: ["Aufenthaltstitel", "Anmeldebescheinigung"]
        }
      ]
    },
    {
      id: "anmeldung",
      name: "Anmeldung",
      icon: MapPin,
      color: "text-green-500",
      tasks: [
        {
          id: "a1",
          title: "Wohnsitz anmelden (Einwohnermeldeamt)",
          description: "Pflicht innerhalb von 14 Tagen nach Einzug",
          xp: 40,
          urgent: true,
          completed: completedTasks.has("a1"),
          deadline: "14 Tage",
          steps: [
            "Vereinbare einen Termin beim Bürgeramt",
            "Bringe alle erforderlichen Dokumente mit",
            "Erhalte deine Anmeldebescheinigung"
          ],
          requiredDocs: ["Passeport", "Mietvertrag", "Einzugsbestätigung"]
        }
      ]
    },
    {
      id: "finanzen",
      name: "Finanzen",
      icon: CreditCard,
      color: "text-yellow-600",
      tasks: [
        {
          id: "f1",
          title: "Bankkonto eröffnen",
          description: "Deutsches Konto für Gehalt und Zahlungen",
          xp: 30,
          urgent: false,
          completed: completedTasks.has("f1"),
          deadline: "7 Tage",
          steps: [
            "Wähle eine Bank (N26, Sparkasse, Deutsche Bank)",
            "Online-Antrag ausfüllen oder Termin buchen",
            "Identifizierung (VideoIdent oder PostIdent)",
            "Erhalte deine Bankkarte"
          ],
          requiredDocs: ["Passeport", "Anmeldebescheinigung"]
        },
        {
          id: "f2",
          title: "Steuer-ID beantragen",
          description: "Wichtig für Steuererklärung und Gehalt",
          xp: 20,
          urgent: false,
          completed: completedTasks.has("f2"),
          deadline: "30 Tage",
          steps: [
            "Wird automatisch nach der Anmeldung verschickt",
            "Falls nicht: Beim Finanzamt nachfragen",
            "Bewahre die Nummer sicher auf"
          ],
          requiredDocs: ["Anmeldebescheinigung"]
        }
      ]
    },
    {
      id: "steuern",
      name: "Steuern",
      icon: Receipt,
      color: "text-purple-500",
      tasks: [
        {
          id: "s1",
          title: "Steuerklasse festlegen",
          description: "Bestimmt die Höhe deiner monatlichen Steuerabzüge",
          xp: 20,
          urgent: false,
          completed: completedTasks.has("s1"),
          deadline: "30 Tage",
          steps: [
            "Als Single: automatisch Steuerklasse I",
            "Bei Fragen: Finanzamt kontaktieren"
          ],
          requiredDocs: ["Steuer-ID"]
        }
      ]
    },
    {
      id: "arbeit",
      name: "Arbeit",
      icon: Briefcase,
      color: "text-indigo-500",
      tasks: [
        {
          id: "ar1",
          title: "Sozialversicherung anmelden",
          description: "Wird meist automatisch vom Arbeitgeber erledigt",
          xp: 30,
          urgent: false,
          completed: completedTasks.has("ar1"),
          deadline: "Vor Arbeitsbeginn",
          steps: [
            "Arbeitgeber meldet dich bei der Sozialversicherung an",
            "Du erhältst eine Sozialversicherungsnummer",
            "Bewahre diese Nummer sicher auf"
          ],
          requiredDocs: ["Arbeitsvertrag", "Krankenversicherungsnachweis"]
        }
      ]
    }
  ];

  const allTasks = categories.flatMap(cat => cat.tasks);
  const totalCompleted = allTasks.filter(t => completedTasks.has(t.id)).length;
  const totalTasks = allTasks.length;
  const progressPercentage = Math.round((totalCompleted / totalTasks) * 100);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    tasks: cat.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = 
        filter === "all" ||
        (filter === "open" && !completedTasks.has(task.id)) ||
        (filter === "completed" && completedTasks.has(task.id)) ||
        (filter === "urgent" && task.urgent && !completedTasks.has(task.id));
      return matchesSearch && matchesFilter;
    })
  })).filter(cat => cat.tasks.length > 0);

  const triggerConfetti = () => {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    const colors = ['hsl(var(--primary))', 'hsl(var(--warning))', 'hsl(var(--success))', 'hsl(var(--accent))'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-piece';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 0.3 + 's';
      confetti.style.animationDuration = 2 + Math.random() + 's';
      container.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(container);
    }, 3500);
  };

  const handleTaskToggle = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    const task = allTasks.find(t => t.id === taskId);
    
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      triggerConfetti();
      
      // Show toast notification
      if (task) {
        notifications.taskCompleted(task.title, task.xp);
      }
    }
    setCompletedTasks(newCompleted);
  };

  const handleMarkAsCompleted = async (task: Task) => {
    setConfirmCompleteTask(task);
  };

  const confirmMarkCompleted = async () => {
    if (!confirmCompleteTask) return;
    
    const newCompleted = new Set(completedTasks);
    newCompleted.add(confirmCompleteTask.id);
    setCompletedTasks(newCompleted);
    triggerConfetti();
    
    // Show toast notification
    notifications.taskCompleted(confirmCompleteTask.title, confirmCompleteTask.xp);
    
    // Update in database if user is logged in
    if (user?.id) {
      await markTaskAsCompleted(confirmCompleteTask.id);
    }
    
    setConfirmCompleteTask(null);
  };

  const handleStartWorkflow = (task: Task) => {
    // Open workflow page or show upload dialog
    setUploadingForTask(task);
    setShowUploadDialog(true);
  };

  const handleUploadComplete = (documentId: string) => {
    notifications.success("Dokument erfolgreich hochgeladen.");
    setShowUploadDialog(false);
    setUploadingForTask(null);
  };

  const handleUploadError = (error: string) => {
    notifications.error(error);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 fade-in-down">
        <div className="container">
          <h1 className="text-2xl font-bold mb-2">Meine Aufgaben</h1>
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary-foreground/60" />
              <Input
                type="text"
                placeholder="Aufgabe suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Progress Summary */}
        <Card className="p-6 premium-card fade-in-up">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Gesamtfortschritt</h2>
              <span className="text-2xl font-bold text-primary smooth-transition hover:scale-110">{progressPercentage}%</span>
            </div>
            <div className="relative">
              <Progress value={progressPercentage} className="h-3 progress-glow" />
              <div className="absolute inset-0 shimmer pointer-events-none rounded-full overflow-hidden"></div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {totalCompleted} von {totalTasks} Aufgaben erledigt
            </p>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 fade-in-up" style={{ animationDelay: "0.1s" }}>
          {[
            { id: "all", label: "Alle" },
            { id: "open", label: "Offen" },
            { id: "completed", label: "Erledigt" },
            { id: "urgent", label: "Urgent" }
          ].map(f => (
            <Button
              key={f.id}
              variant={filter === f.id ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.id as any)}
              className="whitespace-nowrap btn-premium"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Categories Accordion */}
        <Accordion type="multiple" className="space-y-4">
          {filteredCategories.map((category, catIndex) => {
            const categoryCompleted = category.tasks.filter(t => completedTasks.has(t.id)).length;
            const categoryTotal = category.tasks.length;
            const categoryProgress = Math.round((categoryCompleted / categoryTotal) * 100);

            return (
              <AccordionItem 
                key={category.id} 
                value={category.id}
                className="border rounded-2xl px-4 bg-card premium-card fade-in-up"
                style={{ animationDelay: `${0.2 + catIndex * 0.05}s` }}
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ${category.color} smooth-transition hover:scale-110`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">{category.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden max-w-[120px]">
                          <div 
                            className="bg-primary h-full transition-all duration-500"
                            style={{ width: `${categoryProgress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {categoryCompleted}/{categoryTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-3">
                  {category.tasks.map((task, taskIndex) => (
                    <Card 
                      key={task.id}
                      className={`p-4 premium-card-interactive ripple-effect ${
                        task.urgent && !completedTasks.has(task.id) ? "border-l-4 border-l-warning shadow-warning/10" : ""
                      } ${completedTasks.has(task.id) ? "bg-success/5 border-success/20" : ""}`}
                      style={{ animationDelay: `${0.1 * taskIndex}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTaskToggle(task.id);
                          }}
                          className="flex-shrink-0 mt-0.5 smooth-transition hover:scale-110"
                        >
                          {completedTasks.has(task.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-success scale-in" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>
                        <div className="flex-1 min-w-0" onClick={() => setSelectedTask(task)}>
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`font-semibold text-sm ${completedTasks.has(task.id) ? "line-through text-muted-foreground" : ""}`}>
                              {task.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs whitespace-nowrap bg-warning/20 text-warning-foreground hover:bg-warning/30 smooth-transition">
                              +{task.xp} XP
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{task.deadline}</span>
                            </div>
                            {task.urgent && !completedTasks.has(task.id) && (
                              <Badge className="bg-warning text-xs animate-pulse">Urgent</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                          {!completedTasks.has(task.id) && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleStartWorkflow(task)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                              >
                                Starten
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsCompleted(task)}
                                className="border-success text-success hover:bg-success/10 whitespace-nowrap"
                              >
                                ✓ Erledigt
                              </Button>
                            </>
                          )}
                          {completedTasks.has(task.id) && (
                            <Badge className="bg-success text-success-foreground whitespace-nowrap">
                              ✅ Erledigt
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto scale-in">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedTask?.title}</span>
              <Badge variant="secondary" className="bg-warning/20 hover:bg-warning/30 smooth-transition">
                +{selectedTask?.xp} XP
              </Badge>
            </DialogTitle>
            <DialogDescription>{selectedTask?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Steps */}
            <div className="fade-in-up">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Wie geht das? (Schritte)
              </h3>
              <div className="space-y-2">
                {selectedTask?.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-3 slide-in-left" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-sm flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            {selectedTask && selectedTask.requiredDocs.length > 0 && (
              <div className="fade-in-up" style={{ animationDelay: "0.2s" }}>
                <h3 className="font-semibold mb-3">Erforderliche Dokumente</h3>
                <div className="space-y-2">
                  {selectedTask.requiredDocs.map((doc, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm slide-in-left" style={{ animationDelay: `${0.3 + idx * 0.05}s` }}>
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deadline */}
            <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Calendar className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium">Frist: {selectedTask?.deadline}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 btn-premium"
                onClick={() => {
                  setSelectedTask(null);
                  if (selectedTask) handleStartWorkflow(selectedTask);
                }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Starten
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 btn-premium border-success text-success hover:bg-success/10"
                onClick={() => {
                  if (selectedTask) {
                    handleMarkAsCompleted(selectedTask);
                    setSelectedTask(null);
                  }
                }}
              >
                ✓ Erledigt
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Marking as Completed */}
      <AlertDialog open={!!confirmCompleteTask} onOpenChange={() => setConfirmCompleteTask(null)}>
        <AlertDialogContent className="scale-in">
          <AlertDialogHeader>
            <AlertDialogTitle>Aufgabe als erledigt markieren?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass diese Aufgabe abgeschlossen ist?
              <br />
              <strong className="text-foreground mt-2 block">{confirmCompleteTask?.title}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmMarkCompleted}
              className="bg-success hover:bg-success/90 text-success-foreground"
            >
              ✓ Als erledigt markieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md scale-in">
          <DialogHeader>
            <DialogTitle>Dokumente hochladen</DialogTitle>
            <DialogDescription>
              Laden Sie die erforderlichen Dokumente für diese Aufgabe hoch.
            </DialogDescription>
          </DialogHeader>
          
          {uploadingForTask && user?.id && (
            <div className="space-y-4">
              <DocumentUpload
                userId={user.id}
                category={uploadingForTask.id}
                taskId={uploadingForTask.id}
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
              
              {uploadingForTask.requiredDocs.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Erforderliche Dokumente:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {uploadingForTask.requiredDocs.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}