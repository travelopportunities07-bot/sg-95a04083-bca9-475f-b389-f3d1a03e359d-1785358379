import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentUpload } from "@/components/DocumentUpload";
import { markTaskAsCompleted } from "@/services/taskService";
import { ArrowLeft, Check, Upload, CreditCard, Smartphone, Building2, CheckCircle2, CheckCircle } from "lucide-react";

type Step = "banks" | "form" | "upload" | "verification" | "confirmation";

const banks = [
  {
    id: "n26",
    name: "N26",
    type: "Online-Bank",
    icon: Smartphone,
    features: ["100% kostenlos", "Smartphone-App", "Sofort-Eröffnung", "Keine Schufa"],
    pros: ["Schnelle Kontoeröffnung", "Modernes Banking", "Keine Gebühren"],
    recommended: true
  },
  {
    id: "sparkasse",
    name: "Sparkasse",
    type: "Filialbank",
    icon: Building2,
    features: ["Filialnetz", "Persönliche Beratung", "EC-Karte", "Girocard"],
    pros: ["Lokale Präsenz", "Bargeld-Service", "Klassisches Banking"],
    recommended: false
  },
  {
    id: "deutsche-bank",
    name: "Deutsche Bank",
    type: "Filialbank",
    icon: Building2,
    features: ["Weltweit präsent", "Premium-Service", "Kreditkarte", "Online-Banking"],
    pros: ["International", "Umfassende Dienste", "Etabliert"],
    recommended: false
  },
  {
    id: "commerzbank",
    name: "Commerzbank",
    type: "Filialbank",
    icon: Building2,
    features: ["Filialen", "Kostenlose Girocard", "Online-Banking", "Mobile-App"],
    pros: ["Gutes Netzwerk", "Student-friendly", "Kostenlos möglich"],
    recommended: false
  }
];

export default function BankkontoWorkflow() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("banks");
  const [selectedBank, setSelectedBank] = useState("");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
    taxId: "",
    employer: ""
  });

  const steps: { id: Step; label: string; progress: number }[] = [
    { id: "banks", label: "Bank wählen", progress: 20 },
    { id: "form", label: "Daten", progress: 40 },
    { id: "upload", label: "Dokumente", progress: 60 },
    { id: "verification", label: "Prüfung", progress: 80 },
    { id: "confirmation", label: "Fertig", progress: 100 }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);

  const handleNext = () => {
    const stepOrder: Step[] = ["banks", "form", "upload", "verification", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["banks", "form", "upload", "verification", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedDocuments([...uploadedDocuments, ...fileNames]);
      toast({
        title: "Dokument hochgeladen",
        description: `${files.length} Datei(en) erfolgreich hochgeladen.`
      });
    }
  };

  const handleMarkAsCompleted = async () => {
    if (user?.id) {
      await markTaskAsCompleted("bankkonto");
    }
    toast({
      title: "✓ Erledigt!",
      description: "Bankkonto als erledigt markiert.",
    });
    setTimeout(() => router.push("/"), 1500);
  };

  const handleSubmit = () => {
    toast({
      title: "Erfolg!",
      description: "Ihr Bankkonto-Antrag wurde erfolgreich gesendet.",
    });
    setTimeout(() => router.push("/"), 2000);
  };

  const handleUploadComplete = (documentId: string) => {
    setUploadedDocuments([...uploadedDocuments, documentId]);
    toast({
      title: "Dokument hochgeladen",
      description: "Dokument erfolgreich hochgeladen.",
    });
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Fehler",
      description: error,
      variant: "destructive"
    });
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
              <h1 className="text-2xl font-bold">Bankkonto eröffnen</h1>
              <p className="text-sm text-primary-foreground/80">
                Wähle deine Bank und eröffne dein Konto
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Step: Banks */}
        {currentStep === "banks" && (
          <div className="space-y-4 fade-in">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold mb-2">Wählen Sie Ihre Bank</h2>
              <p className="text-muted-foreground text-sm">
                Vergleichen Sie die Vorteile und wählen Sie die beste Bank für Sie
              </p>
            </div>

            <RadioGroup value={selectedBank} onValueChange={setSelectedBank}>
              {banks.map(bank => {
                const BankIcon = bank.icon;
                return (
                  <Card
                    key={bank.id}
                    className={`p-5 cursor-pointer transition-all ${
                      selectedBank === bank.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedBank(bank.id)}
                  >
                    <div className="flex items-start gap-4">
                      <RadioGroupItem value={bank.id} id={bank.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <BankIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <Label htmlFor={bank.id} className="text-base font-bold cursor-pointer">
                                {bank.name}
                              </Label>
                              <p className="text-xs text-muted-foreground">{bank.type}</p>
                            </div>
                          </div>
                          {bank.recommended && (
                            <Badge className="bg-warning/20 text-warning-foreground">
                              Empfohlen
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs font-medium mb-2">Vorteile:</p>
                            <div className="flex flex-wrap gap-2">
                              {bank.pros.map(pro => (
                                <div key={pro} className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <CheckCircle2 className="w-3 h-3 text-success" />
                                  <span>{pro}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {bank.features.map(feature => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </RadioGroup>

            <Button 
              onClick={handleNext} 
              className="w-full" 
              size="lg"
              disabled={!selectedBank}
            >
              Konto eröffnen
            </Button>
          </div>
        )}

        {/* Step: Form */}
        {currentStep === "form" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Persönliche Informationen</h2>
            
            <Card className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Vorname *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Max"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nachname *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Geburtsdatum *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Staatsangehörigkeit *</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={e => setFormData({ ...formData, nationality: e.target.value })}
                    placeholder="Deutschland"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse (Anmeldung) *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Musterstraße 123, 10115 Berlin"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+49 123 456789"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-Mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Steueridentifikationsnummer (optional)</Label>
                <Input
                  id="taxId"
                  value={formData.taxId}
                  onChange={e => setFormData({ ...formData, taxId: e.target.value })}
                  placeholder="12 345 678 901"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employer">Arbeitgeber *</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={e => setFormData({ ...formData, employer: e.target.value })}
                  placeholder="Firma GmbH"
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.birthDate}
              >
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Step: Upload */}
        {currentStep === "upload" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Erforderliche Dokumente</h2>
            
            {user?.id && (
              <DocumentUpload
                userId={user.id}
                category="bankkonto"
                taskId="bankkonto"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            )}

            <Card className="p-4 bg-accent/10">
              <h3 className="font-medium mb-2">Benötigte Dokumente:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reisepass oder Personalausweis</li>
                <li>• Meldebescheinigung (Anmeldung)</li>
                <li>• Arbeitsvertrag</li>
                <li>• Steuer-ID (optional)</li>
              </ul>
            </Card>

            {uploadedDocuments.length > 0 && (
              <Card className="p-4 bg-success/10 border-success/20">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-medium text-success">
                    {uploadedDocuments.length} Dokument(e) hochgeladen
                  </span>
                </div>
              </Card>
            )}

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Step: Verification */}
        {currentStep === "verification" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Überprüfen Sie Ihre Angaben</h2>
            
            <Card className="p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-3">Bank</h3>
                <p className="text-sm text-muted-foreground">
                  {banks.find(b => b.id === selectedBank)?.name}
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Persönliche Daten</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Geburtsdatum</p>
                    <p className="font-medium">{formData.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">E-Mail</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Telefon</p>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Dokumente</h3>
                <p className="text-sm text-muted-foreground">
                  {uploadedDocuments.length} Dokument(e) hochgeladen
                </p>
              </div>
            </Card>

            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm">
                <strong>Wichtig:</strong> Bitte überprüfen Sie alle Angaben sorgfältig. Nach dem Absenden können diese nicht mehr geändert werden.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button onClick={handleNext} className="flex-1">
                Antrag absenden
              </Button>
            </div>
          </div>
        )}

        {/* Step: Confirmation */}
        {currentStep === "confirmation" && (
          <div className="space-y-6 fade-in text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-success" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Antrag erfolgreich!</h2>
              <p className="text-muted-foreground">
                Ihr Bankkonto-Antrag wurde erfolgreich gesendet.
              </p>
            </div>

            <Card className="p-6 text-left">
              <h3 className="font-semibold mb-4">Nächste Schritte</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">E-Mail-Bestätigung</p>
                    <p className="text-xs text-muted-foreground">
                      Sie erhalten eine Bestätigung an {formData.email}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Identitätsprüfung</p>
                    <p className="text-xs text-muted-foreground">
                      Video-Ident oder PostIdent (Link in der E-Mail)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Karte per Post</p>
                    <p className="text-xs text-muted-foreground">
                      EC-Karte und PIN kommen separat (5-10 Werktage)
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} variant="outline" className="flex-1">
                Zurück zur Startseite
              </Button>
              <Button 
                onClick={() => setShowCompleteDialog(true)} 
                className="flex-1 bg-success hover:bg-success/90 text-success-foreground"
              >
                ✓ Als erledigt markieren
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Alert Dialog for Erledigt */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Aufgabe als erledigt markieren?</AlertDialogTitle>
            <AlertDialogDescription>
              Sind Sie sicher, dass diese Aufgabe abgeschlossen ist?
              <br />
              <strong className="text-foreground mt-2 block">Bankkonto eröffnen</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMarkAsCompleted}
              className="bg-success hover:bg-success/90"
            >
              ✓ Als erledigt markieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}