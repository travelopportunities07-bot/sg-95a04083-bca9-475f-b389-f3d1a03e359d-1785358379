import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Calendar,
  Bell,
  ArrowRight,
  Settings,
  UserPlus,
  Mail,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle,
  XOctagon,
  FileX,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/router";
import { getCompanyInvitations, resendInvitation, deleteInvitation } from "@/services/invitationService";
import type { Invitation } from "@/services/invitationService";
import { useToast } from "@/hooks/use-toast";
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

export function HRDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  // Reminder dialog state
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState("");
  const [reminderMessage, setReminderMessage] = useState("");

  // Load invitations
  useEffect(() => {
    if (user && "company_id" in user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    if (!user || !("company_id" in user)) return;
    
    setLoadingInvitations(true);
    try {
      const { data, error } = await getCompanyInvitations((user as any).company_id);
      if (error) throw error;
      setInvitations(data || []);
    } catch (error: any) {
      console.error("Error loading invitations:", error);
    } finally {
      setLoadingInvitations(false);
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    setActionLoading(invitationId);
    try {
      const { success, error } = await resendInvitation(invitationId);
      if (error) throw error;
      
      toast({
        title: "Einladung erneut gesendet",
        description: "Die Einladung wurde erfolgreich erneut gesendet",
      });
      
      await loadInvitations();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim erneuten Senden",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteInvitation = async () => {
    if (!selectedInvitation) return;
    
    setActionLoading(selectedInvitation);
    try {
      const { success, error } = await deleteInvitation(selectedInvitation);
      if (error) throw error;
      
      toast({
        title: "Einladung gelöscht",
        description: "Die Einladung wurde erfolgreich gelöscht",
      });
      
      await loadInvitations();
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Löschen",
        variant: "destructive"
      });
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setSelectedInvitation(null);
    }
  };

  const getInvitationStatusBadge = (invitation: Invitation) => {
    switch (invitation.status) {
      case "accepted":
        return (
          <Badge className="bg-success/10 border-success/30 text-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            Akzeptiert
          </Badge>
        );
      case "expired":
        return (
          <Badge className="bg-muted/10 border-muted/30 text-muted-foreground">
            <XOctagon className="w-3 h-3 mr-1" />
            Abgelaufen
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-warning/10 border-warning/30 text-warning">
            <Clock className="w-3 h-3 mr-1" />
            Ausstehend
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="employees">Mitarbeiter</TabsTrigger>
          <TabsTrigger value="invitations">
            Einladungen
            {invitations.filter(i => i.status === "pending").length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                {invitations.filter(i => i.status === "pending").length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
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
        </TabsContent>

        {/* Invitations Tab */}
        <TabsContent value="invitations" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Mitarbeiter-Einladungen</h3>
              <p className="text-sm text-muted-foreground">
                Verwalten Sie gesendete Einladungen
              </p>
            </div>
            <Button
              onClick={() => router.push("/hr/invite")}
              className="bg-primary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Neue Einladung
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-warning/5 border-warning/20">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-warning" />
                <div>
                  <div className="text-2xl font-bold text-warning">
                    {invitations.filter(i => i.status === "pending").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Ausstehend</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <div className="text-2xl font-bold text-success">
                    {invitations.filter(i => i.status === "accepted").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Akzeptiert</div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 bg-muted/5 border-muted/20">
              <div className="flex items-center gap-3">
                <XOctagon className="w-8 h-8 text-muted-foreground" />
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {invitations.filter(i => i.status === "expired").length}
                  </div>
                  <div className="text-xs text-muted-foreground">Abgelaufen</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Invitations List */}
          {loadingInvitations ? (
            <Card className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Lade Einladungen...</p>
            </Card>
          ) : invitations.length === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Keine Einladungen</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Sie haben noch keine Mitarbeiter eingeladen
              </p>
              <Button
                onClick={() => router.push("/hr/invite")}
                variant="outline"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Erste Einladung senden
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <Card key={invitation.id} className="p-4 premium-card">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">
                          {invitation.first_name && invitation.last_name
                            ? `${invitation.first_name} ${invitation.last_name}`
                            : invitation.email}
                        </h4>
                        {getInvitationStatusBadge(invitation)}
                      </div>
                      
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {invitation.email}
                        </p>
                        <p>
                          Rolle: <span className="font-medium">
                            {invitation.role === "worker" ? "Mitarbeiter" : "HR Manager"}
                          </span>
                        </p>
                        <p>
                          Code: <span className="font-mono font-bold text-primary">
                            {invitation.code}
                          </span>
                        </p>
                        <p>
                          Gesendet: {formatDate(invitation.created_at)}
                        </p>
                        {invitation.status === "accepted" && invitation.accepted_at ? (
                          <p className="text-success">
                            ✓ Akzeptiert am {formatDate(invitation.accepted_at)}
                          </p>
                        ) : isExpired(invitation.expires_at) ? (
                          <p className="text-destructive">
                            ⚠ Abgelaufen am {formatDate(invitation.expires_at)}
                          </p>
                        ) : (
                          <p>
                            Läuft ab: {formatDate(invitation.expires_at)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {invitation.status === "pending" && (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvitation(invitation.id)}
                          disabled={actionLoading === invitation.id}
                        >
                          {actionLoading === invitation.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Erneut senden
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInvitation(invitation.id);
                            setDeleteDialogOpen(true);
                          }}
                          disabled={actionLoading === invitation.id}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Löschen
                        </Button>
                      </div>
                    )}
                    
                    {invitation.status === "expired" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInvitation(invitation.id);
                          setDeleteDialogOpen(true);
                        }}
                        disabled={actionLoading === invitation.id}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Löschen
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Einladung löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Einladung wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInvitation}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}