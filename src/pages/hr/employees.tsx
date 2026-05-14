import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  ArrowLeft,
  Search,
  Users,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/router";

export default function EmployeesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const employees = [
    {
      id: 1,
      name: "Ahmed K.",
      email: "ahmed.k@company.de",
      phone: "+49 151 1234 5678",
      position: "Fachkraft IT",
      department: "Development",
      arrivalDate: "2024-01-15",
      nationality: "Ägypten",
      progress: 45,
      status: "attention",
      avatar: "AK",
      tasks: {
        completed: 5,
        total: 11,
        overdue: 2
      },
      documents: {
        uploaded: 8,
        missing: 3,
        rejected: 1
      },
      nextDeadline: "Krankenversicherung - 3 Tage"
    },
    {
      id: 2,
      name: "Maria S.",
      email: "maria.s@company.de",
      phone: "+49 151 2345 6789",
      position: "Azubi Pflege",
      department: "Healthcare",
      arrivalDate: "2024-02-01",
      nationality: "Spanien",
      progress: 78,
      status: "ok",
      avatar: "MS",
      tasks: {
        completed: 9,
        total: 11,
        overdue: 0
      },
      documents: {
        uploaded: 11,
        missing: 1,
        rejected: 0
      },
      nextDeadline: "Visum-Verlängerung - 15 Tage"
    },
    {
      id: 3,
      name: "Dimitri P.",
      email: "dimitri.p@company.de",
      phone: "+49 151 3456 7890",
      position: "Fachkraft Mechanik",
      department: "Manufacturing",
      arrivalDate: "2023-12-10",
      nationality: "Ukraine",
      progress: 0,
      status: "critical",
      avatar: "DP",
      tasks: {
        completed: 0,
        total: 11,
        overdue: 8
      },
      documents: {
        uploaded: 0,
        missing: 12,
        rejected: 0
      },
      nextDeadline: "Anmeldung - 21 Tage überfällig"
    },
    {
      id: 4,
      name: "Yuki T.",
      email: "yuki.t@company.de",
      phone: "+49 151 4567 8901",
      position: "Azubi Gastronomie",
      department: "Service",
      arrivalDate: "2024-03-01",
      nationality: "Japan",
      progress: 92,
      status: "ok",
      avatar: "YT",
      tasks: {
        completed: 10,
        total: 11,
        overdue: 0
      },
      documents: {
        uploaded: 12,
        missing: 0,
        rejected: 0
      },
      nextDeadline: "Deutschkurs B1 - 7 Tage"
    },
    {
      id: 5,
      name: "Carlos R.",
      email: "carlos.r@company.de",
      phone: "+49 151 5678 9012",
      position: "Fachkraft Elektro",
      department: "Engineering",
      arrivalDate: "2024-01-20",
      nationality: "Mexiko",
      progress: 55,
      status: "ok",
      avatar: "CR",
      tasks: {
        completed: 6,
        total: 11,
        overdue: 1
      },
      documents: {
        uploaded: 9,
        missing: 2,
        rejected: 0
      },
      nextDeadline: "Bankkonto eröffnen - 5 Tage"
    }
  ];

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
      default: return Users;
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-2xl font-bold">Mitarbeiter</h1>
              <p className="text-sm text-primary-foreground/80">
                Team-Übersicht und Details
              </p>
            </div>
          </div>
        </div>
      </div>

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
                    {employee.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-semibold">{employee.name}</h3>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
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
                          {employee.tasks.completed}/{employee.tasks.total} Aufgaben
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
      </div>

      {/* Employee Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedEmployee?.avatar}
              </div>
              <div>
                <div className="text-xl">{selectedEmployee?.name}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  {selectedEmployee?.position}
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
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedEmployee.nationality}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Ankunft: {new Date(selectedEmployee.arrivalDate).toLocaleDateString('de-DE')}</span>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div>
                <h3 className="font-semibold mb-3">Fortschritt</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3 bg-primary/5">
                    <div className="text-2xl font-bold text-primary">{selectedEmployee.tasks.completed}</div>
                    <div className="text-xs text-muted-foreground">Erledigt</div>
                  </Card>
                  <Card className="p-3 bg-warning/5">
                    <div className="text-2xl font-bold text-warning">{selectedEmployee.tasks.overdue}</div>
                    <div className="text-xs text-muted-foreground">Überfällig</div>
                  </Card>
                  <Card className="p-3 bg-muted/5">
                    <div className="text-2xl font-bold">{selectedEmployee.tasks.total}</div>
                    <div className="text-xs text-muted-foreground">Gesamt</div>
                  </Card>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="font-semibold mb-3">Dokumente</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Card className="p-3 bg-success/5">
                    <div className="text-2xl font-bold text-success">{selectedEmployee.documents.uploaded}</div>
                    <div className="text-xs text-muted-foreground">Hochgeladen</div>
                  </Card>
                  <Card className="p-3 bg-warning/5">
                    <div className="text-2xl font-bold text-warning">{selectedEmployee.documents.missing}</div>
                    <div className="text-xs text-muted-foreground">Fehlend</div>
                  </Card>
                  <Card className="p-3 bg-destructive/5">
                    <div className="text-2xl font-bold text-destructive">{selectedEmployee.documents.rejected}</div>
                    <div className="text-xs text-muted-foreground">Abgelehnt</div>
                  </Card>
                </div>
              </div>

              {/* Next Deadline */}
              <div>
                <h3 className="font-semibold mb-3">Nächste Deadline</h3>
                <Card className="p-4 border-l-4 border-l-warning bg-warning/5">
                  <p className="text-sm font-medium">{selectedEmployee.nextDeadline}</p>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary">
                  Erinnerung senden
                </Button>
                <Button variant="outline" className="flex-1">
                  Details anzeigen
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}