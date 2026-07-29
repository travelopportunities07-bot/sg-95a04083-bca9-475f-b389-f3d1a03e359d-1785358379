import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase,
  Send,
  Loader2,
  FileText,
  CheckCircle,
  Clock
} from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getHRReminders } from "@/services/reminderService";

interface Employee {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  phone?: string;
  nationality?: string;
  arrival_date?: string;
  job_type?: string;
  company?: string;
  created_at: string;
  tasks?: {
    completed: number;
    total: number;
    overdue: number;
  };
  documents?: {
    uploaded: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  progress: number;
  status: "ok" | "attention" | "critical";
}

export default function EmployeesPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  
  // Reminder form state
  const [selectedTask, setSelectedTask] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");
  const [sendingReminder, setSendingReminder] = useState(false);

  useEffect(() => {
    if (userProfile?.role === "hr_manager") {
      loadEmployees();
    }
  }, [userProfile]);

  useEffect(() => {
    if (selectedEmployee) {
      loadEmployeeDetails(selectedEmployee.id);
    }
  }, [selectedEmployee]);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      
      // Get all workers linked to this HR manager
      const { data: workers, error: workersError } = await supabase
        .from("profiles")
        .select("*")
        .eq("hr_manager_id", userProfile?.id)
        .eq("role", "worker")
        .order("created_at", { ascending: false });

      if (workersError) throw workersError;

      // For each worker, get their tasks and documents stats
      const employeesWithStats = await Promise.all(
        (workers || []).map(async (worker) => {
          // Get tasks
          const { data: workerTasks } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", worker.id);

          const completedTasks = workerTasks?.filter(t => t.status === "completed").length || 0;
          const totalTasks = workerTasks?.length || 0;
          const overdueTasks = workerTasks?.filter(t => 
            t.due_date && new Date(t.due_date) < new Date() && t.status !== "completed"
          ).length || 0;

          // Get documents
          const { data: workerDocs } = await supabase
            .from("documents")
            .select("*")
            .eq("user_id", worker.id);

          const uploadedDocs = workerDocs?.length || 0;
          const pendingDocs = workerDocs?.filter(d => d.status === "pending").length || 0;
          const approvedDocs = workerDocs?.filter(d => d.status === "approved").length || 0;
          const rejectedDocs = workerDocs?.filter(d => d.status === "rejected").length || 0;

          // Calculate progress
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          // Determine status
          let status: "ok" | "attention" | "critical" = "ok";
          if (progress === 0 && totalTasks > 0) {
            status = "critical";
          } else if (overdueTasks >= 3 || rejectedDocs > 0) {
            status = "critical";
          } else if (overdueTasks > 0 || pendingDocs > 2) {
            status = "attention";
          }

          return {
            ...worker,
            tasks: {
              completed: completedTasks,
              total: totalTasks,
              overdue: overdueTasks
            },
            documents: {
              uploaded: uploadedDocs,
              pending: pendingDocs,
              approved: approvedDocs,
              rejected: rejectedDocs
            },
            progress,
            status
          } as Employee;
        })
      );

      setEmployees(employeesWithStats);
    } catch (error: any) {
      console.error("Error loading employees:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Mitarbeiter",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadEmployeeDetails = async (employeeId: string) => {
    try {
      // Load tasks
      const { data: taskData, error: taskError } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", employeeId)
        .order("created_at", { ascending: false });

      if (taskError) throw taskError;
      setTasks(taskData || []);

      // Load documents
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", employeeId)
        .order("created_at", { ascending: false });

      if (docError) throw docError;
      setDocuments(docData || []);

      // Load reminders
      const { data: reminderData, error: reminderError } = await supabase
        .from("reminders")
        .select("*")
        .eq("worker_id", employeeId)
        .order("sent_at", { ascending: false })
        .limit(10);

      if (reminderError) throw reminderError;
      setReminders(reminderData || []);
    } catch (error: any) {
      console.error("Error loading employee details:", error);
    }
  };

  const handleSendReminder = async () => {
    if (!selectedEmployee || !selectedTask) {
      toast({
        title: "Fehler",
        description: "Bitte wähle eine Aufgabe aus.",
        variant: "destructive"
      });
      return;
    }

    setSendingReminder(true);

    try {
      const task = tasks.find(t => t.id === selectedTask);
      
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: selectedEmployee.id,
          taskId: task?.id,
          taskTitle: task?.title || "Allgemeine Erinnerung",
          message: reminderMessage,
          workerEmail: selectedEmployee.email,
          workerName: `${selectedEmployee.first_name} ${selectedEmployee.last_name}`
        })
      });

      if (!response.ok) {
        throw new Error("Failed to send reminder");
      }

      toast({
        title: "Erinnerung gesendet",
        description: `Erinnerung an ${selectedEmployee.first_name} ${selectedEmployee.last_name} wurde erfolgreich gesendet.`
      });

      setShowReminderDialog(false);
      setSelectedTask("");
      setReminderMessage("");
      
      // Reload reminders
      await loadEmployeeDetails(selectedEmployee.id);
    } catch (error: any) {
      console.error("Error sending reminder:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Senden der Erinnerung",
        variant: "destructive"
      });
    } finally {
      setSendingReminder(false);
    }
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
      case "ok": return "Gut";
      case "attention": return "Achtung";
      case "critical": return "Kritisch";
      default: return "N/A";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ok": return CheckCircle2;
      case "attention": return AlertTriangle;
      case "critical": return XCircle;
      default: return CheckCircle2;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.job_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  if (userProfile?.role !== "hr_manager") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <p className="text-destructive mb-4">Nur für HR Manager verfügbar</p>
            <Button onClick={() => router.push("/")}>
              Zurück zum Dashboard
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 space-y-6">
        {/* Search */}
        <Card className="p-4 premium-card">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Mitarbeiter suchen..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-success/5 border-success/20">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">
                  {employees.filter(e => e.status === "ok").length}
                </div>
                <div className="text-xs text-muted-foreground">Gut</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-warning/5 border-warning/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">
                  {employees.filter(e => e.status === "attention").length}
                </div>
                <div className="text-xs text-muted-foreground">Achtung</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 bg-destructive/5 border-destructive/20">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">
                  {employees.filter(e => e.status === "critical").length}
                </div>
                <div className="text-xs text-muted-foreground">Kritisch</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Employee List */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Lade Mitarbeiter...</p>
          </Card>
        ) : filteredEmployees.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Keine Mitarbeiter gefunden</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEmployees.map((employee) => {
              const StatusIcon = getStatusIcon(employee.status);
              return (
                <Card 
                  key={employee.id} 
                  className="p-4 premium-card-interactive cursor-pointer"
                  onClick={() => {
                    setSelectedEmployee(employee);
                    setShowDetails(true);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                      {getInitials(employee.first_name, employee.last_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold">{employee.first_name} {employee.last_name}</h3>
                          <p className="text-xs text-muted-foreground">{employee.job_type || "Mitarbeiter"}</p>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusLabel(employee.status)}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <Progress value={employee.progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {employee.tasks?.completed}/{employee.tasks?.total} Aufgaben
                          </span>
                          <span className="font-medium">{employee.progress}%</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Employee Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedEmployee && getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
              </div>
              <div>
                <div className="text-xl">
                  {selectedEmployee?.first_name} {selectedEmployee?.last_name}
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  {selectedEmployee?.job_type || "Mitarbeiter"}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-6 pt-4">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-3">Kontaktinformationen</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  {selectedEmployee.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEmployee.phone}</span>
                    </div>
                  )}
                  {selectedEmployee.job_type && (
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEmployee.job_type}</span>
                    </div>
                  )}
                  {selectedEmployee.nationality && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{selectedEmployee.nationality}</span>
                    </div>
                  )}
                  {selectedEmployee.arrival_date && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Ankunft: {new Date(selectedEmployee.arrival_date).toLocaleDateString('de-DE')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Stats */}
              <div>
                <h3 className="font-semibold mb-3">Fortschritt</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3 bg-primary/5">
                    <div className="text-2xl font-bold text-primary">{selectedEmployee.tasks?.completed}</div>
                    <div className="text-xs text-muted-foreground">Erledigt</div>
                  </Card>
                  <Card className="p-3 bg-warning/5">
                    <div className="text-2xl font-bold text-warning">{selectedEmployee.tasks?.overdue}</div>
                    <div className="text-xs text-muted-foreground">Überfällig</div>
                  </Card>
                  <Card className="p-3 bg-muted/5">
                    <div className="text-2xl font-bold">{selectedEmployee.tasks?.total}</div>
                    <div className="text-xs text-muted-foreground">Gesamt</div>
                  </Card>
                </div>
              </div>

              {/* Tasks */}
              <div>
                <h3 className="font-semibold mb-3">Aufgaben ({tasks.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {tasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Keine Aufgaben</p>
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{task.title}</p>
                            <p className="text-xs text-muted-foreground">{task.category}</p>
                          </div>
                          <Badge className={
                            task.status === "completed" 
                              ? "bg-success/20 text-success" 
                              : task.status === "in_progress"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted/20 text-muted-foreground"
                          }>
                            {task.status === "completed" ? "Erledigt" : 
                             task.status === "in_progress" ? "In Bearbeitung" : "Offen"}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">Dokumente</h3>
                <div className="grid grid-cols-4 gap-3">
                  <Card className="p-3 bg-muted/5">
                    <div className="text-2xl font-bold">{selectedEmployee.documents?.uploaded}</div>
                    <div className="text-xs text-muted-foreground">Hochgeladen</div>
                  </Card>
                  <Card className="p-3 bg-warning/5">
                    <div className="text-2xl font-bold text-warning">{selectedEmployee.documents?.pending}</div>
                    <div className="text-xs text-muted-foreground">Ausstehend</div>
                  </Card>
                  <Card className="p-3 bg-success/5">
                    <div className="text-2xl font-bold text-success">{selectedEmployee.documents?.approved}</div>
                    <div className="text-xs text-muted-foreground">Genehmigt</div>
                  </Card>
                  <Card className="p-3 bg-destructive/5">
                    <div className="text-2xl font-bold text-destructive">{selectedEmployee.documents?.rejected}</div>
                    <div className="text-xs text-muted-foreground">Abgelehnt</div>
                  </Card>
                </div>
              </div>

              {/* Reminder History */}
              <div>
                <h3 className="font-semibold mb-3">Erinnerungen ({reminders.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {reminders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Keine Erinnerungen gesendet</p>
                  ) : (
                    reminders.map((reminder) => (
                      <Card key={reminder.id} className="p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{reminder.task_title}</p>
                            {reminder.message && (
                              <p className="text-xs text-muted-foreground mt-1">{reminder.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(reminder.sent_at).toLocaleString('de-DE')}
                            </p>
                          </div>
                          <Badge className={
                            reminder.status === "completed" 
                              ? "bg-success/20 text-success" 
                              : reminder.status === "read"
                              ? "bg-primary/20 text-primary"
                              : "bg-muted/20 text-muted-foreground"
                          }>
                            {reminder.status === "completed" ? "Erledigt" : 
                             reminder.status === "read" ? "Gelesen" : "Gesendet"}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-primary"
                  onClick={() => {
                    setShowDetails(false);
                    setShowReminderDialog(true);
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Erinnerung senden
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Erinnerung senden
            </DialogTitle>
            <DialogDescription>
              Sende eine Erinnerung an {selectedEmployee?.first_name} {selectedEmployee?.last_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="task">Aufgabe auswählen *</Label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger>
                  <SelectValue placeholder="Aufgabe wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {tasks.filter(t => t.status !== "completed").map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
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
                value={reminderMessage}
                onChange={(e) => setReminderMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleSendReminder}
                disabled={sendingReminder || !selectedTask}
                className="flex-1 bg-primary"
              >
                {sendingReminder ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Jetzt senden
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowReminderDialog(false);
                  setSelectedTask("");
                  setReminderMessage("");
                }}
                disabled={sendingReminder}
              >
                Abbrechen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}