import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Camera,
  FolderOpen,
  Download
} from "lucide-react";
import { jsPDF } from "jspdf";
import { notifications } from "@/lib/notifications";

interface Document {
  id: string;
  type: string;
  name: string;
  status: "validated" | "pending" | "rejected" | "missing";
  uploadedAt?: string;
  validatedAt?: string;
  rejectionReason?: string;
  expiresAt?: string;
}

export function DocumentManager() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [exporting, setExporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMethod, setUploadMethod] = useState<"camera" | "gallery" | "pdf" | null>(null);

  const documents: Document[] = [
    {
      id: "1",
      type: "passport",
      name: "Reisepass (Passeport)",
      status: "validated",
      uploadedAt: "15.04.2026",
      validatedAt: "15.04.2026"
    },
    {
      id: "2",
      type: "visa",
      name: "Visum",
      status: "pending",
      uploadedAt: "16.04.2026",
      expiresAt: "15.05.2027"
    },
    {
      id: "3",
      type: "work_contract",
      name: "Arbeitsvertrag (Contrat de travail)",
      status: "validated",
      uploadedAt: "14.04.2026",
      validatedAt: "14.04.2026"
    },
    {
      id: "4",
      type: "health_insurance",
      name: "Krankenversicherung",
      status: "rejected",
      uploadedAt: "16.04.2026",
      rejectionReason: "Dokument ist nicht lesbar. Bitte erneut hochladen."
    },
    {
      id: "5",
      type: "anmeldung",
      name: "Anmeldebescheinigung",
      status: "missing"
    },
    {
      id: "6",
      type: "other",
      name: "Andere Dokumente",
      status: "missing"
    }
  ];

  const stats = {
    validated: documents.filter(d => d.status === "validated").length,
    pending: documents.filter(d => d.status === "pending").length,
    rejected: documents.filter(d => d.status === "rejected").length
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const validatedDocs = documents.filter(d => d.status === "validated");

      if (validatedDocs.length === 0) {
        notifications.error("Keine validierten Dokumente", "Es gibt keine validierten Dokumente zum Exportieren.");
        setExporting(false);
        return;
      }

      // Create PDF with jsPDF
      const doc = new jsPDF();
      
      // Header with logo
      doc.setFillColor(31, 122, 99); // Primary color
      doc.rect(0, 0, 210, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("WorkBridgeDe", 20, 25);
      
      doc.setFontSize(12);
      doc.text("Validierte Dokumente", 20, 33);

      // User info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text("Exportiert am: " + new Date().toLocaleDateString("de-DE"), 20, 50);
      doc.text("Benutzer: Jean Dupont", 20, 56);

      // Document list
      doc.setFontSize(14);
      doc.text("Liste der validierten Dokumente", 20, 70);

      let yPosition = 80;
      validatedDocs.forEach((document, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }

        // Document item
        doc.setFillColor(34, 197, 94); // Success green
        doc.circle(25, yPosition, 2, "F");

        doc.setFontSize(12);
        doc.text(`${index + 1}. ${document.name}`, 30, yPosition + 1);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text(`Hochgeladen: ${document.uploadedAt}`, 35, yPosition + 6);
        doc.text(`Validiert: ${document.validatedAt}`, 35, yPosition + 11);

        doc.setTextColor(0, 0, 0);
        yPosition += 20;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Seite ${i} von ${pageCount} - WorkBridgeDe © ${new Date().getFullYear()}`,
          105,
          290,
          { align: "center" }
        );
      }

      // Save PDF
      doc.save(`WorkBridgeDe_Dokumente_${new Date().toISOString().split('T')[0]}.pdf`);

      notifications.success("PDF exportiert", `${validatedDocs.length} Dokumente wurden erfolgreich exportiert.`);
    } catch (error) {
      console.error("PDF export error:", error);
      notifications.error("Export fehlgeschlagen", "Beim Exportieren der PDF ist ein Fehler aufgetreten.");
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      // Simulate upload - in production, this would upload to Supabase Storage
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      notifications.success(
        "Upload erfolgreich", 
        `${file.name} wurde erfolgreich hochgeladen.`
      );
      
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setUploadMethod(null);
    } catch (error) {
      console.error("Upload error:", error);
      notifications.error(
        "Upload fehlgeschlagen", 
        "Beim Hochladen ist ein Fehler aufgetreten."
      );
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = (method: "camera" | "gallery" | "pdf") => {
    setUploadMethod(method);
    const input = document.createElement("input");
    input.type = "file";
    
    if (method === "camera") {
      input.accept = "image/*";
      input.capture = "environment";
    } else if (method === "pdf") {
      input.accept = "application/pdf";
    } else {
      input.accept = "image/*,application/pdf";
    }
    
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setSelectedFile(file);
        handleFileUpload(file);
      }
    };
    
    input.click();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return <Badge className="bg-success text-white">Validiert</Badge>;
      case "pending":
        return <Badge className="bg-warning text-white">Ausstehend</Badge>;
      case "rejected":
        return <Badge className="bg-destructive text-white">Abgelehnt</Badge>;
      case "missing":
        return <Badge variant="outline" className="text-muted-foreground">Fehlend</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "validated":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "pending":
        return <Clock className="w-5 h-5 text-warning" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "missing":
        return <AlertTriangle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-6 fade-in-down">
        <div className="container">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold">Meine Dokumente</h1>
              <p className="text-primary-foreground/80 text-sm">
                Verwalte deine wichtigen Unterlagen
              </p>
            </div>
            <Button 
              variant="secondary"
              size="sm"
              onClick={() => setUploadDialogOpen(true)}
              className="btn-premium"
            >
              <Upload className="w-4 h-4 mr-2" />
              Hochladen
            </Button>
          </div>
          
          {/* Export PDF Button */}
          {stats.validated > 0 && (
            <Button 
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={exporting}
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 btn-premium"
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? "Exportiere..." : "PDF exportieren"}
            </Button>
          )}
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 stagger-children">
          <Card className="p-4 bg-success/10 border-success/20 premium-card">
            <div className="text-center">
              <CheckCircle2 className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-success">{stats.validated}</div>
              <div className="text-xs text-muted-foreground">Validiert</div>
            </div>
          </Card>
          
          <Card className="p-4 bg-warning/10 border-warning/20 premium-card">
            <div className="text-center">
              <Clock className="w-6 h-6 text-warning mx-auto mb-2" />
              <div className="text-2xl font-bold text-warning">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Ausstehend</div>
            </div>
          </Card>
          
          <Card className="p-4 bg-destructive/10 border-destructive/20 premium-card">
            <div className="text-center">
              <XCircle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Abgelehnt</div>
            </div>
          </Card>
        </div>

        {/* Documents List */}
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <Card 
              key={doc.id}
              className={`p-4 cursor-pointer premium-card-interactive ripple-effect fade-in-up ${
                doc.status === "rejected" ? "border-l-4 border-l-destructive" : ""
              }`}
              onClick={() => setSelectedDoc(doc)}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-muted/20 flex items-center justify-center flex-shrink-0 smooth-transition hover:scale-110">
                  {getStatusIcon(doc.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{doc.name}</h3>
                    {getStatusBadge(doc.status)}
                  </div>
                  {doc.uploadedAt && (
                    <p className="text-xs text-muted-foreground">
                      Hochgeladen am {doc.uploadedAt}
                    </p>
                  )}
                  {doc.status === "rejected" && doc.rejectionReason && (
                    <p className="text-xs text-destructive mt-1">
                      {doc.rejectionReason}
                    </p>
                  )}
                  {doc.expiresAt && (
                    <p className="text-xs text-warning mt-1">
                      ⚠️ Läuft ab am {doc.expiresAt}
                    </p>
                  )}
                </div>
                {(doc.status === "missing" || doc.status === "rejected") && (
                  <Button 
                    size="sm" 
                    className="bg-primary hover:bg-primary/90 flex-shrink-0 btn-premium"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUploadDialogOpen(true);
                    }}
                  >
                    {doc.status === "rejected" ? "Erneut senden" : "Upload"}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md scale-in">
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
            <DialogDescription>
              Wähle eine Methode zum Hochladen deines Dokuments
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4 stagger-children">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4 premium-card-interactive ripple-effect"
              onClick={() => triggerFileInput("camera")}
              disabled={uploading}
            >
              <Camera className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Kamera</div>
                <div className="text-xs text-muted-foreground">Foto aufnehmen</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4 premium-card-interactive ripple-effect"
              onClick={() => triggerFileInput("gallery")}
              disabled={uploading}
            >
              <FolderOpen className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Galerie</div>
                <div className="text-xs text-muted-foreground">Aus Dateien wählen</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4 premium-card-interactive ripple-effect"
              onClick={() => triggerFileInput("pdf")}
              disabled={uploading}
            >
              <FileText className="w-5 h-5 mr-3 text-primary" />
              <div className="text-left">
                <div className="font-semibold">PDF importieren</div>
                <div className="text-xs text-muted-foreground">PDF-Datei hochladen</div>
              </div>
            </Button>

            {uploading && (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Upload läuft...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Detail Dialog */}
      <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
        <DialogContent className="max-w-md scale-in">
          <DialogHeader>
            <DialogTitle>{selectedDoc?.name}</DialogTitle>
            <DialogDescription>
              Dokumentdetails
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="flex items-center justify-between fade-in-up">
              <span className="text-sm text-muted-foreground">Status</span>
              {selectedDoc && getStatusBadge(selectedDoc.status)}
            </div>

            {selectedDoc?.uploadedAt && (
              <div className="flex items-center justify-between fade-in-up" style={{ animationDelay: "0.1s" }}>
                <span className="text-sm text-muted-foreground">Hochgeladen am</span>
                <span className="text-sm font-medium">{selectedDoc.uploadedAt}</span>
              </div>
            )}

            {selectedDoc?.validatedAt && (
              <div className="flex items-center justify-between fade-in-up" style={{ animationDelay: "0.15s" }}>
                <span className="text-sm text-muted-foreground">Validiert am</span>
                <span className="text-sm font-medium">{selectedDoc.validatedAt}</span>
              </div>
            )}

            {selectedDoc?.expiresAt && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg fade-in-up" style={{ animationDelay: "0.2s" }}>
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Läuft ab am {selectedDoc.expiresAt}
                  </span>
                </div>
              </div>
            )}

            {selectedDoc?.status === "rejected" && selectedDoc.rejectionReason && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg fade-in-up" style={{ animationDelay: "0.2s" }}>
                <p className="text-sm text-destructive">
                  <strong>Ablehnungsgrund:</strong><br />
                  {selectedDoc.rejectionReason}
                </p>
              </div>
            )}

            {selectedDoc && (selectedDoc.status === "missing" || selectedDoc.status === "rejected") && (
              <Button 
                className="w-full bg-primary hover:bg-primary/90 btn-premium fade-in-up"
                style={{ animationDelay: "0.25s" }}
                onClick={() => {
                  setSelectedDoc(null);
                  setUploadDialogOpen(true);
                }}
              >
                <Upload className="w-4 h-4 mr-2" />
                {selectedDoc.status === "rejected" ? "Erneut hochladen" : "Jetzt hochladen"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}