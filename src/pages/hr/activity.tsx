import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getActivityLogs, type ActionType } from "@/services/activityService";
import { 
  Activity, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Bell, 
  UserPlus, 
  FileText,
  Clock,
  Filter,
  Calendar
} from "lucide-react";
import { useRouter } from "next/router";

interface ActivityLog {
  id: string;
  user_id: string;
  action_type: ActionType;
  target_user_id: string | null;
  target_user_email: string | null;
  details: any;
  created_at: string;
  profiles: {
    full_name: string;
    email: string;
  } | null;
  target_profile: {
    full_name: string;
    email: string;
  } | null;
}

export default function HRActivityPage() {
  const { user, userProfile } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActionType, setSelectedActionType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    if (userProfile?.role !== "hr_manager") {
      router.push("/");
      return;
    }

    fetchActivityLogs();
  }, [user, userProfile, selectedActionType, selectedPeriod]);

  const fetchActivityLogs = async () => {
    setLoading(true);

    const filters: any = {};
    
    if (selectedActionType !== "all") {
      filters.actionType = selectedActionType as ActionType;
    }

    if (selectedPeriod !== "all") {
      const now = new Date();
      const startDate = new Date();

      switch (selectedPeriod) {
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "3months":
          startDate.setMonth(now.getMonth() - 3);
          break;
      }

      filters.startDate = startDate.toISOString();
    }

    const { logs: fetchedLogs, error } = await getActivityLogs(filters);

    if (error) {
      console.error("Error fetching activity logs:", error);
    } else {
      setLogs(fetchedLogs as any);
    }

    setLoading(false);
  };

  const getActionIcon = (actionType: ActionType) => {
    switch (actionType) {
      case "invite_sent":
        return <Mail className="w-5 h-5 text-[#3B82F6]" />;
      case "document_approved":
        return <CheckCircle className="w-5 h-5 text-[#22C55E]" />;
      case "document_rejected":
        return <XCircle className="w-5 h-5 text-[#EF4444]" />;
      case "reminder_sent":
        return <Bell className="w-5 h-5 text-[#F59E0B]" />;
      case "profile_updated":
        return <UserPlus className="w-5 h-5 text-[#8B5CF6]" />;
      case "task_assigned":
        return <FileText className="w-5 h-5 text-[#06B6D4]" />;
      case "worker_onboarded":
        return <UserPlus className="w-5 h-5 text-[#10B981]" />;
      default:
        return <Activity className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const getActionColor = (actionType: ActionType) => {
    switch (actionType) {
      case "invite_sent":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "document_approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "document_rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "reminder_sent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "profile_updated":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "task_assigned":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "worker_onboarded":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActionLabel = (actionType: ActionType) => {
    switch (actionType) {
      case "invite_sent":
        return "Invitation envoyée";
      case "document_approved":
        return "Document approuvé";
      case "document_rejected":
        return "Document rejeté";
      case "reminder_sent":
        return "Rappel envoyé";
      case "profile_updated":
        return "Profil mis à jour";
      case "task_assigned":
        return "Tâche assignée";
      case "worker_onboarded":
        return "Travailleur intégré";
      default:
        return actionType;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupLogsByDate = () => {
    const grouped: { [key: string]: ActivityLog[] } = {};

    logs.forEach((log) => {
      const date = new Date(log.created_at);
      const dateKey = date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(log);
    });

    return grouped;
  };

  const groupedLogs = groupLogsByDate();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1F7A63]"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F5F7F6]">
        <div className="container py-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#1E293B]">Journal d'activité</h1>
            <p className="text-[#64748B]">Historique de toutes vos actions HR</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Total des actions</CardDescription>
                <CardTitle className="text-2xl font-bold text-[#1E293B]">{logs.length}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Invitations</CardDescription>
                <CardTitle className="text-2xl font-bold text-[#3B82F6]">
                  {logs.filter((l) => l.action_type === "invite_sent").length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Documents approuvés</CardDescription>
                <CardTitle className="text-2xl font-bold text-[#22C55E]">
                  {logs.filter((l) => l.action_type === "document_approved").length}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="text-[#64748B] text-sm">Rappels envoyés</CardDescription>
                <CardTitle className="text-2xl font-bold text-[#F59E0B]">
                  {logs.filter((l) => l.action_type === "reminder_sent").length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="w-5 h-5" />
                Filtres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1E293B]">Type d'action</label>
                  <Select value={selectedActionType} onValueChange={setSelectedActionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les actions</SelectItem>
                      <SelectItem value="invite_sent">Invitations envoyées</SelectItem>
                      <SelectItem value="document_approved">Documents approuvés</SelectItem>
                      <SelectItem value="document_rejected">Documents rejetés</SelectItem>
                      <SelectItem value="reminder_sent">Rappels envoyés</SelectItem>
                      <SelectItem value="profile_updated">Profils mis à jour</SelectItem>
                      <SelectItem value="task_assigned">Tâches assignées</SelectItem>
                      <SelectItem value="worker_onboarded">Travailleurs intégrés</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1E293B]">Période</label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les périodes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les périodes</SelectItem>
                      <SelectItem value="week">Dernière semaine</SelectItem>
                      <SelectItem value="month">Dernier mois</SelectItem>
                      <SelectItem value="3months">3 derniers mois</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <div className="space-y-6">
            {Object.keys(groupedLogs).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Activity className="w-16 h-16 mx-auto mb-4 text-[#64748B] opacity-50" />
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-2">
                    Aucune activité enregistrée
                  </h3>
                  <p className="text-[#64748B]">
                    Les actions que vous effectuez apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            ) : (
              Object.keys(groupedLogs)
                .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                .map((dateKey) => (
                  <div key={dateKey} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#1F7A63]" />
                      <h2 className="text-xl font-semibold text-[#1E293B]">{dateKey}</h2>
                      <div className="flex-1 border-t border-[#E2E8F0]"></div>
                    </div>

                    <div className="space-y-3">
                      {groupedLogs[dateKey].map((log) => (
                        <Card key={log.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#F5F7F6] flex items-center justify-center">
                                {getActionIcon(log.action_type)}
                              </div>

                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getActionColor(log.action_type)} px-2 py-1 text-xs`}>
                                        {getActionLabel(log.action_type)}
                                      </Badge>
                                    </div>
                                    
                                    <div className="text-sm text-[#1E293B]">
                                      {log.target_user_email && (
                                        <span className="font-medium">{log.target_user_email}</span>
                                      )}
                                      {log.details?.document_name && (
                                        <span className="text-[#64748B]"> - {log.details.document_name}</span>
                                      )}
                                      {log.details?.message && (
                                        <p className="text-[#64748B] mt-1">{log.details.message}</p>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-[#64748B]">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(log.created_at)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}