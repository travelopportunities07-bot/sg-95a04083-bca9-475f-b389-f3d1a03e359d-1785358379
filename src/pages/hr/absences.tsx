import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Check,
  X,
  Clock,
  Loader2,
  User,
  FileText
} from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getTeamAbsences,
  approveAbsence,
  rejectAbsence,
  getAbsenceStats,
  type Absence
} from "@/services/absenceService";

export default function AbsencesPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [absences, setAbsences] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedAbsence, setSelectedAbsence] = useState<any | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (userProfile?.role === "hr_manager") {
      loadAbsences();
      loadStats();
    }
  }, [userProfile, activeTab]);

  const loadAbsences = async () => {
    try {
      setLoading(true);
      const { data, error } = await getTeamAbsences(activeTab === "all" ? undefined : activeTab);
      
      if (error) throw new Error(error);
      
      setAbsences(data);
    } catch (error: any) {
      console.error("Error loading absences:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Abwesenheiten",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await getAbsenceStats();
      
      if (error) throw new Error(error);
      
      setStats(data);
    } catch (error: any) {
      console.error("Error loading stats:", error);
    }
  };

  const handleApprove = async (absenceId: string) => {
    try {
      setProcessing(true);
      const { error } = await approveAbsence(absenceId);
      
      if (error) throw new Error(error);
      
      toast({
        title: "Genehmigt",
        description: "Die Abwesenheit wurde genehmigt."
      });
      
      await loadAbsences();
      await loadStats();
    } catch (error: any) {
      console.error("Error approving absence:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Genehmigen der Abwesenheit",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedAbsence || !rejectionReason) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie einen Grund ein",
        variant: "destructive"
      });
      return;
    }

    try {
      setProcessing(true);
      const { error } = await rejectAbsence(selectedAbsence.id, rejectionReason);
      
      if (error) throw new Error(error);
      
      toast({
        title: "Abgelehnt",
        description: "Die Abwesenheit wurde abgelehnt."
      });
      
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedAbsence(null);
      
      await loadAbsences();
      await loadStats();
    } catch (error: any) {
      console.error("Error rejecting absence:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Ablehnen der Abwesenheit",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-success/10 border-success/30 text-success";
      case "rejected": return "bg-destructive/10 border-destructive/30 text-destructive";
      case "pending": return "bg-warning/10 border-warning/30 text-warning";
      case "cancelled": return "bg-muted/10 border-muted/30 text-muted-foreground";
      default: return "bg-muted/10 border-muted/30 text-muted-foreground";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      sick_leave: "Krankmeldung",
      vacation: "Urlaub",
      personal: "Persönlich",
      emergency: "Notfall",
      unpaid: "Unbezahlt",
      parental_leave: "Elternzeit",
      other: "Sonstiges"
    };
    return labels[type] || type;
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
        <div>
          <h1 className="text-3xl font-bold">Abwesenheitsverwaltung</h1>
          <p className="text-muted-foreground">
            Verwalte Abwesenheitsanträge deiner Mitarbeiter
          </p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card className="p-3 bg-muted/5">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-muted-foreground">Gesamt</div>
            </Card>
            <Card className="p-3 bg-warning/5">
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Ausstehend</div>
            </Card>
            <Card className="p-3 bg-success/5">
              <div className="text-2xl font-bold text-success">{stats.approved}</div>
              <div className="text-xs text-muted-foreground">Genehmigt</div>
            </Card>
            <Card className="p-3 bg-destructive/5">
              <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Abgelehnt</div>
            </Card>
            <Card className="p-3 bg-primary/5">
              <div className="text-2xl font-bold text-primary">{stats.total_days}</div>
              <div className="text-xs text-muted-foreground">Tage (genehmigt)</div>
            </Card>
          </div>
        )}

        {/* Absences List */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Ausstehend</TabsTrigger>
              <TabsTrigger value="approved">Genehmigt</TabsTrigger>
              <TabsTrigger value="rejected">Abgelehnt</TabsTrigger>
              <TabsTrigger value="all">Alle</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              {loading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Lade Abwesenheiten...</p>
                </div>
              ) : absences.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Keine Abwesenheiten in dieser Kategorie</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {absences.map((absence) => (
                    <Card key={absence.id} className="p-4 premium-card-interactive">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {absence.worker?.first_name?.[0]}{absence.worker?.last_name?.[0]}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {absence.worker?.first_name} {absence.worker?.last_name}
                              </h3>
                              <Badge className={getStatusColor(absence.status)}>
                                {absence.status === "pending" ? "Ausstehend" :
                                 absence.status === "approved" ? "Genehmigt" :
                                 absence.status === "rejected" ? "Abgelehnt" : "Storniert"}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="w-4 h-4" />
                                <span>{getTypeLabel(absence.absence_type)}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(absence.start_date).toLocaleDateString('de-DE')} - {new Date(absence.end_date).toLocaleDateString('de-DE')}
                                  {" "}({absence.total_days} Tage)
                                </span>
                              </div>
                              {absence.reason && (
                                <p className="text-muted-foreground italic">
                                  "{absence.reason}"
                                </p>
                              )}
                              {absence.rejection_reason && (
                                <p className="text-destructive text-xs">
                                  Ablehnungsgrund: {absence.rejection_reason}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        {absence.status === "pending" && (
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(absence.id)}
                              disabled={processing}
                              className="bg-success"
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Genehmigen
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAbsence(absence);
                                setShowRejectDialog(true);
                              }}
                              disabled={processing}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Ablehnen
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abwesenheit ablehnen</DialogTitle>
            <DialogDescription>
              Bitte geben Sie einen Grund für die Ablehnung an.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Textarea
              placeholder="Grund für die Ablehnung..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex gap-3">
              <Button
                onClick={handleReject}
                disabled={processing || !rejectionReason}
                className="flex-1 bg-destructive"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird abgelehnt...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Ablehnen
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                  setSelectedAbsence(null);
                }}
                disabled={processing}
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