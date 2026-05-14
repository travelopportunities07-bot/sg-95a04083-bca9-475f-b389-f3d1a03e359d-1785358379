import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Users,
  MessageSquare,
  Calendar,
  Briefcase,
  Languages,
  Heart,
  Clock,
  BookOpen,
  FileText
} from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const companyInfo = {
    name: "TechVision GmbH",
    logo: "/generated/techvision-logo.png",
    sector: "Informationstechnologie & Software",
    address: "Friedrichstraße 123, 10117 Berlin",
    email: "hr@techvision.de",
    phone: "+49 30 1234567",
    website: "www.techvision.de",
    employees: "250+ Mitarbeiter",
    description: "TechVision ist ein führendes Software-Unternehmen, das innovative Lösungen für die digitale Transformation entwickelt. Wir arbeiten mit neuesten Technologien und fördern eine internationale, kollaborative Arbeitskultur.",
    values: [
      "Innovation & Exzellenz",
      "Vielfalt & Inklusion",
      "Work-Life-Balance",
      "Kontinuierliches Lernen"
    ],
    languages: ["Deutsch", "Englisch", "Französisch", "Spanisch"]
  };

  const hrContact = {
    name: "Sarah Müller",
    position: "HR Manager - International Talent",
    email: "sarah.mueller@techvision.de",
    phone: "+49 30 1234567-89",
    photo: "/generated/hr-manager.png",
    availableHours: "Mo-Fr: 9:00 - 17:00"
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Nachricht erforderlich",
        description: "Bitte geben Sie eine Nachricht ein.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Nachricht gesendet",
      description: "Ihre Nachricht wurde an den HR-Manager gesendet.",
    });
    setMessage("");
    setMessageDialogOpen(false);
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
              <h1 className="text-2xl font-bold">Profil</h1>
              <p className="text-sm text-primary-foreground/80">
                Ihr Unternehmen & HR-Kontakt
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Company Info Card */}
        <Card className="p-6 fade-in-up">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{companyInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{companyInfo.sector}</p>
            </div>
          </div>

          {/* Company Description */}
          <div className="mb-6">
            <p className="text-sm leading-relaxed">{companyInfo.description}</p>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Adresse</p>
                <p className="text-sm font-medium">{companyInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Mitarbeiter</p>
                <p className="text-sm font-medium">{companyInfo.employees}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">E-Mail</p>
                <a href={`mailto:${companyInfo.email}`} className="text-sm font-medium text-primary hover:underline">
                  {companyInfo.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Telefon</p>
                <a href={`tel:${companyInfo.phone}`} className="text-sm font-medium text-primary hover:underline">
                  {companyInfo.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Website</p>
                <a href={`https://${companyInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  {companyInfo.website}
                </a>
              </div>
            </div>
          </div>

          {/* Company Values */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Unsere Werte</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {companyInfo.values.map((value, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  {value}
                </Badge>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Sprachen im Unternehmen</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {companyInfo.languages.map((language, index) => (
                <Badge key={index} variant="outline">
                  {language}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* HR Contact Card */}
        <Card className="p-6 fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Ihr HR-Kontakt</h2>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={hrContact.photo} alt={hrContact.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {hrContact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{hrContact.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{hrContact.position}</p>
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {hrContact.availableHours}
              </Badge>
            </div>
          </div>

          {/* HR Contact Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <a href={`mailto:${hrContact.email}`} className="text-sm font-medium text-primary hover:underline">
                {hrContact.email}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary flex-shrink-0" />
              <a href={`tel:${hrContact.phone}`} className="text-sm font-medium text-primary hover:underline">
                {hrContact.phone}
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setMessageDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Nachricht senden
            </Button>

            <Button
              onClick={() => setAppointmentDialogOpen(true)}
              variant="outline"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Termin buchen
            </Button>
          </div>
        </Card>

        {/* Quick Links */}
        <Card className="p-6 fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h3 className="font-semibold mb-4">Schnellzugriff</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/faq")}>
              <BookOpen className="w-4 h-4 mr-3" />
              FAQ durchsuchen
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-3" />
              Dokumente verwalten
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="w-4 h-4 mr-3" />
              Team-Verzeichnis
            </Button>
          </div>
        </Card>
      </div>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nachricht an {hrContact.name}</DialogTitle>
            <DialogDescription>
              Senden Sie eine Nachricht an Ihren HR-Manager
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="message">Ihre Nachricht</Label>
              <Textarea
                id="message"
                placeholder="Schreiben Sie Ihre Nachricht..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={handleSendMessage} className="flex-1 bg-primary hover:bg-primary/90">
                Senden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Appointment Dialog */}
      <Dialog open={appointmentDialogOpen} onOpenChange={setAppointmentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Termin mit {hrContact.name} buchen</DialogTitle>
            <DialogDescription>
              Wählen Sie ein Datum und eine Uhrzeit für Ihren Termin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="date">Datum</Label>
              <Input
                id="date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="time">Uhrzeit</Label>
              <Input
                id="time"
                type="time"
                min="09:00"
                max="17:00"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="reason">Grund des Termins</Label>
              <Textarea
                id="reason"
                placeholder="Beschreiben Sie kurz den Grund..."
                rows={3}
                className="mt-2"
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setAppointmentDialogOpen(false)} className="flex-1">
                Abbrechen
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Terminanfrage gesendet",
                  description: "Ihr HR-Manager wird sich bei Ihnen melden.",
                });
                setAppointmentDialogOpen(false);
              }} className="flex-1 bg-primary hover:bg-primary/90">
                Termin anfragen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}