import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity as ActivityIcon,
  Mail,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  UserPlus,
  Clock,
  TrendingUp,
  Loader2
} from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { getActivities, type ActivityLog } from "@/services/activityService";

export default function ActivityPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (userProfile?.role === "hr_manager") {
      loadActivities();
    }
  }, [userProfile, filter]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await getActivities(filter === "all" ? undefined : filter);
      
      if (error) throw new Error(error);
      
      setActivities(data);
    } catch (error: any) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "reminder_sent": return Mail;
      case "task_completed": return CheckCircle;
      case "task_created": return FileText;
      case "document_uploaded": return FileText;
      case "document_validated": return CheckCircle;
      case "document_rejected": return XCircle;
      case "invitation_sent": return UserPlus;
      case "invitation_accepted": return CheckCircle;
      case "alert_created": return AlertTriangle;
      case "alert_resolved": return CheckCircle;
      case "report_generated": return TrendingUp;
      case "absence_requested": return Clock;
      case "absence_approved": return CheckCircle;
      case "absence_rejected": return XCircle;
      default: return ActivityIcon;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "reminder_sent":
      case "invitation_sent":
      case "task_created":
      case "document_uploaded":
      case "absence_requested":
        return "bg-primary/10 border-primary/30 text-primary";
      case "task_completed":
      case "document_validated":
      case "invitation_accepted":
      case "alert_resolved":
      case "absence_approved":
        return "bg-success/10 border-success/30 text-success";
      case "document_rejected":
      case "absence_rejected":
        return "bg-destructive/10 border-destructive/30 text-destructive";
      case "alert_created":
        return "bg-warning/10 border-warning/30 text-warning";
      default:
        return "bg-muted/10 border-muted/30 text-muted-foreground";
    }
  };

  const getActivityLabel = (type: string) => {
    const labels: Record<string, string> = {
      "reminder_sent": "Erinnerung gesendet",
      "task_completed": "Aufgabe erledigt",
      "task_created": "Aufgabe erstellt",
      "document_uploaded": "Dokument hochgeladen",
      "document_validated": "Dokument validiert",
      "document_rejected": "Dokument abgelehnt",
      "invitation_sent": "Einladung gesendet",
      "invitation_accepted": "Einladung akzeptiert",
      "alert_created": "Warnung erstellt",
      "alert_resolved": "Warnung gelöst",
      "report_generated": "Bericht generiert",
      "absence_requested": "Abwesenheit beantragt",
      "absence_approved": "Abwesenheit genehmigt",
      "absence_rejected": "Abwesenheit abgelehnt"
    };
    return labels[type] || type;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `vor ${diffInMinutes} Min.`;
    } else if (diffInHours < 24) {
      return `vor ${diffInHours} Std.`;
    } else {
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
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
            <h1 className="text-3xl font-bold">Aktivitätsverlauf</h1>
            <p className="text-muted-foreground">
              Alle Aktivitäten Ihres Teams im Überblick
            </p>
          </div>
          <Button variant="outline" onClick={loadActivities}>
            <ActivityIcon className="w-4 h-4 mr-2" />
            Aktualisieren
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="all">Alle</TabsTrigger>
              <TabsTrigger value="reminder_sent">Erinnerungen</TabsTrigger>
              <TabsTrigger value="document_validated">Dokumente</TabsTrigger>
              <TabsTrigger value="invitation_sent">Einladungen</TabsTrigger>
              <TabsTrigger value="alert_created">Warnungen</TabsTrigger>
            </TabsList>
          </Tabs>
        </Card>

        {/* Activity Timeline */}
        <Card className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Lade Aktivitäten...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <ActivityIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Keine Aktivitäten gefunden</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.activity_type);
                const isLast = index === activities.length - 1;
                
                return (
                  <div key={activity.id} className="relative">
                    {!isLast && (
                      <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.activity_type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <div>
                            <Badge className={`${getActivityColor(activity.activity_type)} mb-2`}>
                              {getActivityLabel(activity.activity_type)}
                            </Badge>
                            <p className="text-sm">
                              {activity.details}
                            </p>
                            {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                              <div className="mt-2 p-2 bg-muted/5 rounded-lg">
                                <p className="text-xs text-muted-foreground">
                                  {JSON.stringify(activity.metadata, null, 2)}
                                </p>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(activity.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
}