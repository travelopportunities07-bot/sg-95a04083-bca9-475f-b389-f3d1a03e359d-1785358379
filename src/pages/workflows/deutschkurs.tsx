import { useState } from "react";
import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Calendar as CalendarIcon, Globe, Video, Users, MapPin } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";

type Step = "level" | "format" | "schedule" | "confirmation";
type CourseLevel = "A1" | "A2" | "B1" | "B2";
type CourseFormat = "Online" | "Präsenz" | "Hybrid";

const courseLevels = [
  {
    level: "A1" as CourseLevel,
    name: "Anfänger",
    description: "Grundkenntnisse - Einfache Sätze und alltägliche Ausdrücke",
    duration: "8 Wochen",
    hours: "120 Stunden",
    price: "299€"
  },
  {
    level: "A2" as CourseLevel,
    name: "Grundstufe",
    description: "Erweiterte Basics - Verständigung in vertrauten Situationen",
    duration: "10 Wochen",
    hours: "150 Stunden",
    price: "349€"
  },
  {
    level: "B1" as CourseLevel,
    name: "Mittelstufe",
    description: "Fortgeschritten - Hauptpunkte verstehen bei klarer Standardsprache",
    duration: "12 Wochen",
    hours: "180 Stunden",
    price: "399€"
  },
  {
    level: "B2" as CourseLevel,
    name: "Oberstufe",
    description: "Fließend - Komplexe Texte verstehen und spontan kommunizieren",
    duration: "14 Wochen",
    hours: "210 Stunden",
    price: "449€"
  }
];

const courseSchedules = [
  { id: "1", day: "Montag & Mittwoch", time: "18:00 - 20:00", seats: 8 },
  { id: "2", day: "Dienstag & Donnerstag", time: "19:00 - 21:00", seats: 5 },
  { id: "3", day: "Samstag", time: "10:00 - 14:00", seats: 12 },
  { id: "4", day: "Sonntag", time: "14:00 - 18:00", seats: 3 }
];

export default function DeutschkursWorkflow() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>("level");
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | "">("");
  const [selectedFormat, setSelectedFormat] = useState<CourseFormat | "">("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });

  const steps: { id: Step; label: string; progress: number }[] = [
    { id: "level", label: "Niveau", progress: 25 },
    { id: "format", label: "Format", progress: 50 },
    { id: "schedule", label: "Termine", progress: 75 },
    { id: "confirmation", label: "Bestätigung", progress: 100 }
  ];

  const currentStepData = steps.find(s => s.id === currentStep);

  const handleNext = () => {
    const stepOrder: Step[] = ["level", "format", "schedule", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: Step[] = ["level", "format", "schedule", "confirmation"];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Erfolgreich gebucht!",
      description: "Ihr Deutschkurs wurde erfolgreich gebucht.",
    });
    setTimeout(() => router.push("/"), 2000);
  };

  const selectedLevelData = courseLevels.find(l => l.level === selectedLevel);
  const selectedScheduleData = courseSchedules.find(s => s.id === selectedSchedule);

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
              <h1 className="text-2xl font-bold">Deutschkurs buchen</h1>
              <p className="text-sm text-primary-foreground/80">
                Wähle deinen Kurs und starte deine Sprachreise
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Step: Level */}
        {currentStep === "level" && (
          <div className="space-y-4 fade-in">
            <div className="text-center mb-6">
              <Globe className="w-12 h-12 text-primary mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-2">Wählen Sie Ihr Sprachniveau</h2>
              <p className="text-muted-foreground text-sm">
                Wählen Sie das passende Niveau für Ihre Deutschkenntnisse
              </p>
            </div>

            <RadioGroup value={selectedLevel} onValueChange={(val) => setSelectedLevel(val as CourseLevel)}>
              {courseLevels.map(course => (
                <Card
                  key={course.level}
                  className={`p-5 cursor-pointer transition-all ${
                    selectedLevel === course.level ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => setSelectedLevel(course.level)}
                >
                  <div className="flex items-start gap-4">
                    <RadioGroupItem value={course.level} id={course.level} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Label htmlFor={course.level} className="text-lg font-bold cursor-pointer">
                              {course.level}
                            </Label>
                            <Badge variant="secondary">{course.name}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{course.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">{course.price}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                        <span>📅 {course.duration}</span>
                        <span>⏱️ {course.hours}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </RadioGroup>

            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm">
                <strong>💡 Nicht sicher welches Niveau?</strong> Sie können einen kostenlosen Einstufungstest machen, um Ihr aktuelles Niveau zu bestimmen.
              </p>
            </div>

            <Button 
              onClick={handleNext} 
              className="w-full" 
              size="lg"
              disabled={!selectedLevel}
            >
              Weiter
            </Button>
          </div>
        )}

        {/* Step: Format */}
        {currentStep === "format" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Kursformat wählen</h2>

            <RadioGroup value={selectedFormat} onValueChange={(val) => setSelectedFormat(val as CourseFormat)}>
              <Card
                className={`p-5 cursor-pointer transition-all ${
                  selectedFormat === "Online" ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedFormat("Online")}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="Online" id="online" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Video className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="online" className="text-base font-bold cursor-pointer">
                          Online
                        </Label>
                        <p className="text-xs text-muted-foreground">Live-Unterricht per Videokonferenz</p>
                      </div>
                    </div>
                    <div className="space-y-1 ml-13 text-sm text-muted-foreground">
                      <p>✓ Flexibel von überall teilnehmen</p>
                      <p>✓ Interaktive Übungen und Gruppenarbeit</p>
                      <p>✓ Aufzeichnungen zum Nacharbeiten</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-5 cursor-pointer transition-all ${
                  selectedFormat === "Präsenz" ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedFormat("Präsenz")}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="Präsenz" id="praesenz" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="praesenz" className="text-base font-bold cursor-pointer">
                          Präsenz
                        </Label>
                        <p className="text-xs text-muted-foreground">Vor Ort im Klassenzimmer</p>
                      </div>
                    </div>
                    <div className="space-y-1 ml-13 text-sm text-muted-foreground">
                      <p>✓ Direkter Kontakt mit Lehrern</p>
                      <p>✓ Intensive Gruppenarbeit</p>
                      <p>✓ Strukturiertes Lernumfeld</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card
                className={`p-5 cursor-pointer transition-all ${
                  selectedFormat === "Hybrid" ? "border-primary ring-2 ring-primary/20" : ""
                }`}
                onClick={() => setSelectedFormat("Hybrid")}
              >
                <div className="flex items-start gap-4">
                  <RadioGroupItem value="Hybrid" id="hybrid" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Label htmlFor="hybrid" className="text-base font-bold cursor-pointer">
                          Hybrid
                        </Label>
                        <p className="text-xs text-muted-foreground">Kombination aus Online und Präsenz</p>
                      </div>
                    </div>
                    <div className="space-y-1 ml-13 text-sm text-muted-foreground">
                      <p>✓ Maximale Flexibilität</p>
                      <p>✓ Online- und Präsenztermine</p>
                      <p>✓ Beste Kombination beider Formate</p>
                    </div>
                  </div>
                </div>
              </Card>
            </RadioGroup>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={!selectedFormat}
              >
                Weiter
              </Button>
            </div>
          </div>
        )}

        {/* Step: Schedule */}
        {currentStep === "schedule" && (
          <div className="space-y-4 fade-in">
            <h2 className="text-lg font-semibold">Terminauswahl</h2>

            <Card className="p-6 space-y-4">
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
            </Card>

            <div className="space-y-3">
              <Label>Kursbeginn wählen</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: de }) : "Datum auswählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    locale={de}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-3">
              <Label>Wählen Sie Ihre bevorzugten Kurszeiten</Label>
              <RadioGroup value={selectedSchedule} onValueChange={setSelectedSchedule}>
                {courseSchedules.map(schedule => (
                  <Card
                    key={schedule.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedSchedule === schedule.id ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                    onClick={() => setSelectedSchedule(schedule.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value={schedule.id} id={schedule.id} />
                        <div>
                          <Label htmlFor={schedule.id} className="font-semibold cursor-pointer">
                            {schedule.day}
                          </Label>
                          <p className="text-sm text-muted-foreground">{schedule.time}</p>
                        </div>
                      </div>
                      <Badge variant={schedule.seats < 5 ? "destructive" : "secondary"}>
                        {schedule.seats} Plätze frei
                      </Badge>
                    </div>
                  </Card>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleBack} variant="outline" className="flex-1">
                Zurück
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={!selectedSchedule || !startDate || !formData.email}
              >
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
              <h2 className="text-2xl font-bold mb-2">Kurs erfolgreich gebucht!</h2>
              <p className="text-muted-foreground">
                Ihr Deutschkurs wurde erfolgreich gebucht.
              </p>
            </div>

            <Card className="p-6 text-left space-y-3">
              <h3 className="font-semibold">Kurszusammenfassung</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Niveau:</span>
                  <span className="font-medium">{selectedLevel} - {selectedLevelData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span className="font-medium">{selectedFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Termine:</span>
                  <span className="font-medium">{selectedScheduleData?.day}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uhrzeit:</span>
                  <span className="font-medium">{selectedScheduleData?.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beginn:</span>
                  <span className="font-medium">
                    {startDate ? format(startDate, "PPP", { locale: de }) : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dauer:</span>
                  <span className="font-medium">{selectedLevelData?.duration}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-muted-foreground">Preis:</span>
                  <span className="font-bold text-primary">{selectedLevelData?.price}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 text-left">
              <h3 className="font-semibold mb-3">Nächste Schritte</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✉️ Sie erhalten eine Bestätigungs-E-Mail mit allen Details</p>
                <p>📚 Kursmaterialien werden 3 Tage vor Kursbeginn bereitgestellt</p>
                <p>🎓 Zugang zur Online-Lernplattform wird aktiviert</p>
                <p>💳 Rechnung folgt separat per E-Mail</p>
              </div>
            </Card>

            <Button onClick={handleSubmit} className="w-full" size="lg">
              Zurück zur Startseite
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}