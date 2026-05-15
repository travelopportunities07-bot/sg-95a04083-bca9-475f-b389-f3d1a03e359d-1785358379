import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentUpload } from "@/components/DocumentUpload";
import { markTaskAsCompleted } from "@/services/taskService";
import { ArrowLeft, Check, Upload, HeartPulse, Star, Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "info" | "selection" | "form" | "upload" | "confirmation";

const insuranceProviders = [
  {
    id: "tk",
    name: "Techniker Krankenkasse (TK)",
    type: "gesetzlich",
    rating: 4.8,
    features: ["Online-Services", "Bonus-Programm", "24/7 Support", "App verfügbar"],
    recommended: true
  },
  {
    id: "aok",
    name: "AOK",
    type: "gesetzlich",
    rating: 4.6,
    features: ["Regional stark", "Familien-Service", "Präventionskurse", "Digitale Angebote"],
    recommended: false
  },
  {
    id: "barmer",
    name: "Barmer",
    type: "gesetzlich",
    rating: 4.7,
    features: ["Telemedicine", "7Tage-Service", "Bonus-App", "Gesundheitskurse"],
    recommended: false
  },
  {
    id: "dak",
    name: "DAK Gesundheit",
    type: "gesetzlich",
    rating: 4.5,
    features: ["Fit & Gesund", "Online-Coach", "Servicezentren", "Präventionsangebote"],
    recommended: false
  }
];

export default function KrankenversicherungWorkflow() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [selectedInsurance, setSelectedInsurance] = useState("");
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
    email: "",
    employer: "",
    arrivalDate: ""
  });

  const steps: { id: Step; label: string; progress: number }[] = [
    { id: "info", label: "Information", progress: 20 },
    { id: "selection", label: "Auswahl", progress: 40 },
    { id: "form", label: "Formular", progress: 60 },
    { id: "upload", label: "Dokumente", progress: 80 },
    { id: "confirmation", label: "Bestätigung", progress: 100 }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);

  const handleNext = () => {
    const stepOrder: Step[] = ["info", "selection", "form", "upload", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["info", "selection", "form", "upload", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleMarkAsCompleted = async () => {
    if (user?.id) {
      await markTaskAsCompleted("krankenversicherung");
    }
    toast({
      title: "✓ Erledigt!",
      description: "Krankenversicherung als erledigt markiert.",
    });
    setTimeout(() => router.push("/"), 1500);
  };

  const handleSubmit = () => {
    toast({
      title: "Erfolgreich!",
      description: "Ihre Krankenversicherung wurde erfolgreich beantragt.",
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
              <h1 className="text-2xl font-bold">Krankenversicherung</h1>
              <p className="text-sm text-primary-foreground/80">
                Gesetzliche oder private Versicherung wählen
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Step: Info */}
        {currentStep === "info" && (
          <div className="space-y-6 fade-in">
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HeartPulse className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-2">Was ist Krankenversicherung?</h2>
                  <p className="text-sm text-muted-foreground">
                    In Deutschland ist eine Krankenversicherung Pflicht. Sie deckt medizinische Kosten wie Arztbesuche, Medikamente und Krankenhausaufenthalte ab.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Gesetzliche vs. Private Versicherung</h3>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Gesetzliche Krankenversicherung (GKV)
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Für die meisten Arbeitnehmer verpflichtend</li>
                    <li>• Beitrag abhängig vom Einkommen (~15%)</li>
                    <li>• Familienversicherung möglich</li>
                    <li>• Standardleistungen garantiert</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="font-medium mb-2">Private Krankenversicherung (PKV)</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                    <li>• Ab 66.600€ Jahreseinkommen (2024)</li>
                    <li>• Individuelle Tarife</li>
                    <li>• Keine Familienversicherung</li>
                    <li>• Erweiterte Leistungen möglich</li>
                  </ul>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4 p-3 bg-accent/10 rounded-lg">
                💡 <strong>Empfehlung:</strong> Als Fachkraft oder Azubi empfehlen wir die gesetzliche Krankenversicherung.
              </p>
            </Card>

            <Button onClick={handleNext} className="w-full" size="lg">
              Weiter zur Auswahl
            </Button>
          </div>
        )}

        {/* Step: Selection */}
        {currentStep === "selection" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Wählen Sie Ihre Krankenkasse</h2>
            
            <RadioGroup value={selectedInsurance} onValueChange={setSelectedInsurance}>
              {insuranceProviders.map(provider => (
                <Card
                  key={provider.id}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedInsurance === provider.id ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedInsurance(provider.id)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={provider.id} id={provider.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Label htmlFor={provider.id} className="text-base font-semibold cursor-pointer">
                            {provider.name}
                          </Label>
                          {provider.recommended && (
                            <Badge className="ml-2 bg-warning/20 text-warning-foreground">
                              Empfohlen
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-warning text-warning" />
                          <span className="text-sm font-medium">{provider.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {provider.type === "gesetzlich" ? "Gesetzliche Krankenkasse" : "Private Krankenkasse"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {provider.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </RadioGroup>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1" 
                disabled={!selectedInsurance}
              >
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Step: Form */}
        {currentStep === "form" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Ihre persönlichen Daten</h2>
            
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

              <div className="space-y-2">
                <Label htmlFor="address">Adresse in Deutschland *</Label>
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
                <Label htmlFor="employer">Arbeitgeber *</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={e => setFormData({ ...formData, employer: e.target.value })}
                  placeholder="Firma GmbH"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalDate">Ankunftsdatum in Deutschland *</Label>
                <Input
                  id="arrivalDate"
                  type="date"
                  value={formData.arrivalDate}
                  onChange={e => setFormData({ ...formData, arrivalDate: e.target.value })}
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
                disabled={!formData.firstName || !formData.lastName || !formData.email}
              >
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Step: Upload */}
        {currentStep === "upload" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Dokumente hochladen</h2>
            
            {user?.id && (
              <DocumentUpload
                userId={user.id}
                category="krankenversicherung"
                taskId="krankenversicherung"
                onUploadComplete={handleUploadComplete}
                onUploadError={handleUploadError}
              />
            )}

            <Card className="p-4 bg-accent/10">
              <h3 className="font-medium mb-2">Erforderliche Dokumente:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reisepass oder Personalausweis</li>
                <li>• Arbeitsvertrag</li>
                <li>• Anmeldebestätigung (falls vorhanden)</li>
              </ul>
            </Card>

            {uploadedDocuments.length > 0 && (
              <Card className="p-4 bg-success/10 border-success/20">
                <div className="flex items-center gap-2 mb-2">
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

        {/* Step: Confirmation */}
        {currentStep === "confirmation" && (
          <div className="space-y-6 fade-in text-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-10 h-10 text-success" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">Erfolgreich!</h2>
              <p className="text-muted-foreground">
                Ihre Krankenversicherung wurde erfolgreich beantragt.
              </p>
            </div>

            <Card className="p-6 text-left space-y-3">
              <h3 className="font-semibold">Zusammenfassung</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Krankenkasse:</span>
                  <span className="font-medium">
                    {insuranceProviders.find(p => p.id === selectedInsurance)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">E-Mail:</span>
                  <span className="font-medium">{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="bg-warning/20 text-warning-foreground">In Bearbeitung</Badge>
                </div>
              </div>
            </Card>

            <div className="p-4 bg-accent/10 rounded-lg text-left">
              <p className="text-sm">
                <strong>Nächste Schritte:</strong>
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
                <li>• Sie erhalten eine E-Mail-Bestätigung</li>
                <li>• Die Krankenkasse prüft Ihre Unterlagen</li>
                <li>• Sie erhalten Ihre Versicherungskarte per Post</li>
                <li>• Bearbeitungszeit: ca. 5-10 Werktage</li>
              </ul>
            </div>

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
              <strong className="text-foreground mt-2 block">Krankenversicherung abschließen</strong>
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