import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  FileX,
  TrendingDown,
  UserX,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAlerts,
  getAlertStats,
  resolveAlert,
  dismissAlert,
  triggerAlertGeneration,
  type Alert
} from "@/services/alertService";

export default function AlertsPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (userProfile?.role === "hr_manager") {
      loadAlerts();
      loadStats();
    }
  }, [userProfile, activeTab]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await getAlerts(activeTab === "all" ? undefined : activeTab);
      
      if (error) throw new Error(error);
      
      setAlerts(data);
    } catch (error: any) {
      console.error("Error loading alerts:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Warnungen",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await getAlertStats();
      
      if (error) throw new Error(error);
      
      setStats(data);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      const { error } = await resolveAlert(alertId);
      
      if (error) throw new Error(error);
      
      toast({
        title: "Warnung gelöst",
        description: "Die Warnung wurde als gelöst markiert."
      });
      
      await loadAlerts();
      await loadStats();
    } catch (error: any) {
      console.error("Error resolving alert:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Lösen der Warnung",
        variant: "destructive"
      });
    }
  };

  const handleDismiss = async (alertId: string) => {
    try {
      const { error } = await dismissAlert(alertId);
      
      if (error) throw new Error(error);
      
      toast({
        title: "Warnung ignoriert",
        description: "Die Warnung wurde ignoriert."
      });
      
      await loadAlerts();
      await loadStats();
    } catch (error: any) {
      console.error("Error dismissing alert:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Ignorieren der Warnung",
        variant: "destructive"
      });
    }
  };

  const handleTriggerAlerts = async () => {
    try {
      setTriggering(true);
      const { error } = await triggerAlertGeneration();
      
      if (error) throw new Error(error);
      
      toast({
        title: "Warnungen aktualisiert",
        description: "Neue Warnungen wurden generiert."
      });
      
      await loadAlerts();
      await loadStats();
    } catch (error: any) {
      console.error("Error triggering alerts:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Generieren der Warnungen",
        variant: "destructive"
      });
    } finally {
      setTriggering(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive/10 border-destructive/30 text-destructive";
      case "high": return "bg-warning/10 border-warning/30 text-warning";
      case "medium": return "bg-primary/10 border-primary/30 text-primary";
      case "low": return "bg-muted/10 border-muted/30 text-muted-foreground";
      default: return "bg-muted/10 border-muted/30 text-muted-foreground";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "task_overdue": return Clock;
      case "document_missing": return FileX;
      case "document_rejected": return XCircle;
      case "no_progress": return TrendingDown;
      case "inactivity": return UserX;
      case "multiple_overdue": return AlertTriangle;
      default: return AlertTriangle;
    }
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Warnungen & Alerts</h1>
            <p className="text-muted-foreground">
              Automatische Benachrichtigungen über wichtige Ereignisse
            </p>
          </div>
          <Button
            onClick={handleTriggerAlerts}
            disabled={triggering}
            variant="outline"
          >
            {triggering ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Wird aktualisiert...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Aktualisieren
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="p-3 bg-muted/5">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Gesamt</div>
            </Card>
            <Card className="p-3 bg-primary/5">
              <div className="text-2xl font-bold text-primary">{stats.active}</div>
              <div className="text-xs text-muted-foreground">Aktiv</div>
            </Card>
            <Card className="p-3 bg-destructive/5">
              <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
              <div className="text-xs text-muted-foreground">Kritisch</div>
            </Card>
            <Card className="p-3 bg-warning/5">
              <div className="text-2xl font-bold text-warning">{stats.high}</div>
              <div className="text-xs text-muted-foreground">Hoch</div>
            </Card>
            <Card className="p-3 bg-primary/5">
              <div className="text-2xl font-bold text-primary">{stats.medium}</div>
              <div className="text-xs text-muted-foreground">Mittel</div>
            </Card>
          </div>
        )}

        {/* Alerts List */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="active">Aktiv</TabsTrigger>
              <TabsTrigger value="resolved">Gelöst</TabsTrigger>
              <TabsTrigger value="dismissed">Ignoriert</TabsTrigger>
              <TabsTrigger value="all">Alle</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Lade Warnungen...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Keine Warnungen in dieser Kategorie</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const Icon = getAlertIcon(alert.alert_type);
                    return (
                      <Card key={alert.id} className="p-4 premium-card-interactive">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getSeverityColor(alert.severity)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{alert.title}</h3>
                                <Badge className={getSeverityColor(alert.severity)}>
                                  {alert.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {alert.message}
                              </p>
                              {alert.worker && (
                                <p className="text-xs text-muted-foreground">
                                  Mitarbeiter: {alert.worker.first_name} {alert.worker.last_name}
                                </p>
                              )}
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(alert.triggered_at).toLocaleString('de-DE')}
                              </p>
                            </div>
                          </div>
                          {alert.status === "active" && (
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                size="sm"
                                onClick={() => handleResolve(alert.id)}
                                className="bg-success"
                              >
                                Lösen
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDismiss(alert.id)}
                              >
                                Ignorieren
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}