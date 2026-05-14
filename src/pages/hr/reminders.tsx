import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
  ArrowLeft,
  Bell,
  Plus,
  Clock,
  CheckCircle2,
  Send,
  Calendar
} from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function RemindersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [message, setMessage] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const employees = [
    { id: "1", name: "Ahmed K.", avatar: "AK" },
    { id: "2", name: "Maria S.", avatar: "MS" },
    { id: "3", name: "Dimitri P.", avatar: "DP" },
    { id: "4", name: "Yuki T.", avatar: "YT" },
    { id: "5", name: "Carlos R.", avatar: "CR" }
  ];

  const tasks = [
    "Krankenversicherung abschließen",
    "Bankkonto eröffnen",
    "Anmeldung beim Bürgeramt",
    "Deutschkurs buchen",
    "Steuer-ID beantragen",
    "Arbeitsgenehmigung verlängern",
    "Visum verlängern",
    "Dokumente hochladen"
  ];

  const reminders = [
    {
      id: 1,
      employee: "Ahmed K.",
      avatar: "AK",
      task: "Krankenversicherung abschließen",
      message: "Bitte schließe deine Krankenversicherung ab. Die Deadline ist in 3 Tagen.",
      sentDate: "2024-05-12",
      status: "sent",
      dueDate: "2024-05-17"
    },
    {
      id: 2,
      employee: "Dimitri P.",
      avatar: "DP",
      task: "Anmeldung beim Bürgeramt",
      message: "Wichtig: Die Anmeldung ist bereits überfällig. Bitte erledige dies so schnell wie möglich.",
      sentDate: "2024-05-10",
      status: "sent",
      dueDate: "2024-04-25"
    },
    {
      id: 3,
      employee: "Maria S.",
      avatar: "MS",
      task: "Visum verlängern",
      message: "Dein Visum läuft bald ab. Bitte kümmere dich um die Verlängerung.",
      sentDate: "2024-05-13",
      status: "pending",
      dueDate: "2024-05-29"
    }
  ];

  const handleSendReminder = () => {
    if (!selectedEmployee || !selectedTask) {
      toast({
        title: "Fehler",
        description: "Bitte wähle einen Mitarbeiter und eine Aufgabe aus.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Erinnerung gesendet",
      description: `Erinnerung an ${employees.find(e => e.id === selectedEmployee)?.name} wurde erfolgreich gesendet.`
    });

    setShowNewReminder(false);
    setSelectedEmployee("");
    setSelectedTask("");
    setMessage("");
    setScheduledDate("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground">
        <div className="container py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Erinnerungen</h1>
              <p className="text-sm text-primary-foreground/80">
                Verwalten Sie Team-Erinnerungen
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">
                  {reminders.filter(r => r.status === "sent").length}
                </div>
                <div className="text-xs text-muted-foreground">Gesendet</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-warning/5 border-warning/20">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">
                  {reminders.filter(r => r.status === "pending").length}
                </div>
                <div className="text-xs text-muted-foreground">Ausstehend</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-success/5 border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">0</div>
                <div className="text-xs text-muted-foreground">Erledigt</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Reminders List */}
        <div className="space-y-3">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4 premium-card">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                  {reminder.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold">{reminder.employee}</h3>
                      <p className="text-sm text-muted-foreground">{reminder.task}</p>
                    </div>
                    <Badge className={reminder.status === "sent" ? "bg-success/20 text-success" : "bg-warning/20 text-warning"}>
                      {reminder.status === "sent" ? "Gesendet" : "Ausstehend"}
                    </Badge>
                  </div>
                  <p className="text-sm mb-3">{reminder.message}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Gesendet: {new Date(reminder.sentDate).toLocaleDateString('de-DE')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className={new Date(reminder.dueDate) < new Date() ? "text-destructive font-semibold" : ""}>
                        Fällig: {new Date(reminder.dueDate).toLocaleDateString('de-DE')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New Reminder Dialog */}
      <Dialog open={showNewReminder} onOpenChange={setShowNewReminder}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Neue Erinnerung erstellen
            </DialogTitle>
            <DialogDescription>
              Sende eine Erinnerung an einen Mitarbeiter für eine ausstehende Aufgabe
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Mitarbeiter auswählen</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Mitarbeiter wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {emp.avatar}
                        </div>
                        {emp.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="message">Nachricht (optional)</Label>
              <Textarea
                id="message"
                placeholder="Füge eine persönliche Nachricht hinzu..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Fälligkeitsdatum (optional)</Label>
              <Input
                id="date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
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
                onClick={() => setShowNewReminder(false)}
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