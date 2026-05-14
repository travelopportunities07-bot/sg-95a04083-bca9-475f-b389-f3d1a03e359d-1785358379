import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Users, 
  Bell,
  AlertTriangle,
  FileX,
  Clock,
  TrendingUp,
  ChevronRight,
  Send,
  Settings
} from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export function HRDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  const hrData = {
    employeesCount: 12,
    avgIntegration: 68,
    overdueTasks: 8,
    missingDocs: 5,
    urgentWarnings: 3
  };

  const urgentAlerts = [
    {
      id: 1,
      name: "Ahmed K.",
      issue: "Krankenversicherung fehlt seit 7 Tagen",
      severity: "high",
      daysOverdue: 7,
      defaultTask: "Krankenversicherung abschließen"
    },
    {
      id: 2,
      name: "Maria S.",
      issue: "Visum läuft in 15 Tagen ab",
      severity: "medium",
      daysOverdue: 0,
      defaultTask: "Visum verlängern"
    },
    {
      id: 3,
      name: "Dimitri P.",
      issue: "0% Progression nach 21 Tagen",
      severity: "high",
      daysOverdue: 21,
      defaultTask: "Anmeldung beim Bürgeramt"
    }
  ];

  const employees = [
    {
      id: 1,
      name: "Ahmed K.",
      position: "Fachkraft",
      progress: 45,
      status: "attention",
      avatar: "AK"
    },
    {
      id: 2,
      name: "Maria S.",
      position: "Azubi",
      progress: 78,
      status: "ok",
      avatar: "MS"
    },
    {
      id: 3,
      name: "Dimitri P.",
      position: "Fachkraft",
      progress: 0,
      status: "critical",
      avatar: "DP"
    },
    {
      id: 4,
      name: "Yuki T.",
      position: "Azubi",
      progress: 92,
      status: "ok",
      avatar: "YT"
    }
  ];

  const tasks = [
    "Krankenversicherung abschließen",
    "Bankkonto eröffnen",
    "Anmeldung beim Bürgeramt",
    "Deutschkurs buchen",
    "Steuer-ID beantragen",
    "Visum verlängern"
  ];

  const handleSendReminder = () => {
    if (!selectedTask) {
      toast({
        title: "Fehler",
        description: "Bitte wähle eine Aufgabe aus.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Erinnerung gesendet",
      description: `Erinnerung an ${selectedAlert?.name} wurde erfolgreich gesendet.`
    });

    setShowReminderDialog(false);
    setSelectedAlert(null);
    setSelectedTask("");
    setReminderMessage("");
  };

  const openReminderDialog = (alert: any) => {
    setSelectedAlert(alert);
    setSelectedTask(alert.defaultTask);
    setReminderMessage(`Hallo ${alert.name}, bitte denke daran, diese wichtige Aufgabe zu erledigen.`);
    setShowReminderDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "bg-success/10 border-success/30 text-success";
      case "attention": return "bg-warning/10 border-warning/30 text-warning";
      case "critical": return "bg-destructive/10 border-destructive/30 text-destructive";
      default: return "bg-muted/10 border-muted/30 text-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ok": return "OK";
      case "attention": return "Achtung";
      case "critical": return "Kritisch";
      default: return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">HR Dashboard</h1>
              <p className="text-primary-foreground/80 text-sm">
                {hrData.employeesCount} Mitarbeiter betreut
              </p>
            </div>
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <div className="relative">
                <Bell className="w-5 h-5" />
                {hrData.urgentWarnings > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full text-xs flex items-center justify-center font-bold">
                    {hrData.urgentWarnings}
                  </span>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* KPI Cards - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Average Integration */}
          <Card className="p-4 bg-secondary/10 border-secondary/20">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span>Ø Integration</span>
              </div>
              <div className="text-3xl font-bold text-secondary">{hrData.avgIntegration}%</div>
              <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full transition-all duration-500"
                  style={{ width: `${hrData.avgIntegration}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Overdue Tasks */}
          <Card className={`p-4 ${hrData.overdueTasks > 5 ? 'bg-destructive/10 border-destructive/20' : 'bg-warning/10 border-warning/20'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Überfällig</span>
              </div>
              <div className={`text-3xl font-bold ${hrData.overdueTasks > 5 ? 'text-destructive' : 'text-warning'}`}>
                {hrData.overdueTasks}
              </div>
              <p className="text-xs text-muted-foreground">Aufgaben</p>
            </div>
          </Card>

          {/* Missing Documents */}
          <Card className={`p-4 ${hrData.missingDocs > 3 ? 'bg-warning/10 border-warning/20' : 'bg-muted/10 border-muted/20'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <FileX className="w-4 h-4" />
                <span>Dokumente</span>
              </div>
              <div className={`text-3xl font-bold ${hrData.missingDocs > 3 ? 'text-warning' : 'text-muted'}`}>
                {hrData.missingDocs}
              </div>
              <p className="text-xs text-muted-foreground">Fehlen</p>
            </div>
          </Card>

          {/* Urgent Warnings */}
          <Card className={`p-4 ${hrData.urgentWarnings > 0 ? 'bg-destructive/10 border-destructive/20' : 'bg-success/10 border-success/20'}`}>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                <span>Warnungen</span>
              </div>
              <div className={`text-3xl font-bold ${hrData.urgentWarnings > 0 ? 'text-destructive' : 'text-success'}`}>
                {hrData.urgentWarnings}
              </div>
              <p className="text-xs text-muted-foreground">Dringend</p>
            </div>
          </Card>
        </div>

        {/* Urgent Alerts Section */}
        {urgentAlerts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Dringende Warnungen
              </h2>
            </div>
            
            <div className="space-y-3">
              {urgentAlerts.map((alert) => (
                <Card 
                  key={alert.id}
                  className={`p-4 ${
                    alert.severity === "high" 
                      ? "border-l-4 border-l-destructive bg-destructive/5" 
                      : "border-l-4 border-l-warning bg-warning/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{alert.name}</h3>
                      <p className="text-sm text-muted-foreground">{alert.issue}</p>
                      {alert.daysOverdue > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          {alert.daysOverdue} Tage überfällig
                        </p>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => openReminderDialog(alert)}
                    >
                      Jetzt erinnern
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Employee List Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary">Mitarbeiter</h2>
            <Button variant="ghost" size="sm" className="text-accent">
              Alle anzeigen
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {employees.map((employee) => (
              <Card key={employee.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                    {employee.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold text-sm">{employee.name}</h3>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <Badge className={getStatusColor(employee.status)}>
                        {getStatusLabel(employee.status)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <Progress value={employee.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground text-right">{employee.progress}%</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="container">
          <div className="flex items-center justify-around py-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col h-auto py-2 text-primary"
              onClick={() => router.push("/hr")}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Dashboard</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col h-auto py-2 text-muted-foreground"
              onClick={() => router.push("/hr/employees")}
            >
              <Users className="w-5 h-5 mb-1" />
              <span className="text-xs">Mitarbeiter</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col h-auto py-2 text-muted-foreground"
              onClick={() => router.push("/hr/reminders")}
            >
              <Bell className="w-5 h-5 mb-1" />
              <span className="text-xs">Erinnerungen</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex-col h-auto py-2 text-muted-foreground"
              onClick={() => router.push("/hr/settings")}
            >
              <Settings className="w-5 h-5 mb-1" />
              <span className="text-xs">Einstellungen</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Erinnerung senden
            </DialogTitle>
            <DialogDescription>
              Sende eine Erinnerung an {selectedAlert?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold mb-1">Problem:</p>
              <p className="text-sm text-muted-foreground">{selectedAlert?.issue}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task">Aufgabe auswählen</Label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger>
                  <SelectValue placeholder="Aufgabe wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Nachricht</Label>
              <Textarea
                id="message"
                placeholder="Persönliche Nachricht..."
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSendReminder}
                className="flex-1 bg-primary"
              >
                <Send className="w-4 h-4 mr-2" />
                Jetzt senden
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowReminderDialog(false)}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}