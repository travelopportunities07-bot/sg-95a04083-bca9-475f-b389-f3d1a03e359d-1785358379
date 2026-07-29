import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  Calendar,
  BarChart3
} from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { generateMonthlyReport, getMonthlyReports, type MonthlyReport } from "@/services/reportService";

export default function ReportsPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { toast } = useToast();
  
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    if (userProfile?.role === "hr_manager") {
      loadReports();
    }
  }, [userProfile]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await getMonthlyReports();
      
      if (error) throw new Error(error);
      
      setReports(data);
    } catch (error: any) {
      console.error("Error loading reports:", error);
      toast({
        title: "Fehler",
        description: "Fehler beim Laden der Berichte",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      
      const reportMonth = `${selectedMonth}-01`;
      const { data, error } = await generateMonthlyReport(reportMonth);
      
      if (error) throw new Error(error);
      
      toast({
        title: "Bericht erstellt",
        description: "Der monatliche Bericht wurde erfolgreich erstellt."
      });
      
      await loadReports();
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast({
        title: "Fehler",
        description: error.message || "Fehler beim Erstellen des Berichts",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const formatMonth = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
  };

  const getMonthOptions = () => {
    const options = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
      options.push({ value, label });
    }
    return options;
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
            <h1 className="text-3xl font-bold">Monatsberichte</h1>
            <p className="text-muted-foreground">
              Übersicht über Team-Performance und Fortschritt
            </p>
          </div>
        </div>

        {/* Generate New Report */}
        <Card className="p-6 premium-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Neuen Bericht erstellen</h3>
                <p className="text-sm text-muted-foreground">
                  Wähle einen Monat und erstelle einen Bericht
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getMonthOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGenerateReport}
                disabled={generating}
                className="bg-primary"
              >
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bericht erstellen
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Reports List */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Lade Berichte...</p>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Keine Berichte vorhanden</p>
            <p className="text-sm text-muted-foreground mt-2">
              Erstelle deinen ersten Monatsbericht oben
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="p-6 premium-card-interactive">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formatMonth(report.report_month)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Erstellt am {new Date(report.generated_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Card className="p-3 bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Mitarbeiter</span>
                    </div>
                    <div className="text-2xl font-bold">{report.total_employees}</div>
                    <div className="text-xs text-muted-foreground">
                      {report.active_employees} aktiv
                    </div>
                  </Card>

                  <Card className="p-3 bg-success/5">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-xs text-muted-foreground">Fortschritt</span>
                    </div>
                    <div className="text-2xl font-bold text-success">
                      {report.avg_progress.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Durchschnitt
                    </div>
                  </Card>

                  <Card className="p-3 bg-primary/5">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Aufgaben</span>
                    </div>
                    <div className="text-2xl font-bold">{report.completed_tasks}</div>
                    <div className="text-xs text-muted-foreground">
                      erledigt
                    </div>
                  </Card>

                  <Card className="p-3 bg-warning/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-warning" />
                      <span className="text-xs text-muted-foreground">Überfällig</span>
                    </div>
                    <div className="text-2xl font-bold text-warning">
                      {report.overdue_tasks}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Aufgaben
                    </div>
                  </Card>
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-3 gap-3 mt-3">
                  <div className="text-center p-3 bg-muted/5 rounded-lg">
                    <div className="text-lg font-bold">{report.documents_approved}</div>
                    <div className="text-xs text-muted-foreground">Docs genehmigt</div>
                  </div>
                  <div className="text-center p-3 bg-muted/5 rounded-lg">
                    <div className="text-lg font-bold">{report.reminders_sent}</div>
                    <div className="text-xs text-muted-foreground">Erinnerungen</div>
                  </div>
                  <div className="text-center p-3 bg-muted/5 rounded-lg">
                    <div className="text-lg font-bold">{report.new_hires}</div>
                    <div className="text-xs text-muted-foreground">Neue</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}