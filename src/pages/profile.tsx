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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Languages,
  FileText,
  MessageSquare,
  Building2,
  GraduationCap,
  Clock,
  Globe,
  IdCard,
  Shield,
  Pencil,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  // Employee Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Ahmad",
    lastName: "Hassan",
    email: "ahmad.hassan@techvision.de",
    phone: "+49 176 12345678",
    dateOfBirth: "1995-06-15",
    nationality: "Syrien",
    address: "Hauptstraße 45, 10115 Berlin",
    postcode: "10115",
    city: "Berlin",
    country: "Deutschland"
  });

  // Professional Information
  const [professionalInfo, setProfessionalInfo] = useState({
    position: "Software Entwickler",
    department: "IT Development",
    employeeId: "EMP-2024-1245",
    contractType: "Fachkraft",
    startDate: "2024-03-01",
    workPermit: "Gültig bis 31.12.2027",
    status: "Active"
  });

  // HR Contact Information
  const hrContact = {
    name: "Sarah Müller",
    position: "HR Manager - International Talent",
    email: "sarah.mueller@techvision.de",
    phone: "+49 30 1234567-89",
    mobile: "+49 176 98765432",
    photo: "/generated/hr-manager.png",
    office: "Raum 304, 3. OG",
    availableHours: "Mo-Fr: 9:00 - 17:00",
    company: "TechVision GmbH",
    department: "Human Resources"
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

  const handleSaveProfile = () => {
    toast({
      title: "Profil aktualisiert",
      description: "Ihre Änderungen wurden erfolgreich gespeichert.",
    });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0d0f] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(16,185,129,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(20,184,166,0.15),transparent_50%)]" />
        
        <div className="container relative py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-display font-bold text-white">Mein Profil</h1>
            <Button
              onClick={() => setEditMode(!editMode)}
              className="bg-white/20 hover:bg-white/30 text-white border-0"
            >
              <Pencil className="w-4 h-4 mr-2" />
              {editMode ? "Abbrechen" : "Bearbeiten"}
            </Button>
          </div>

          {/* Profile Avatar & Quick Info */}
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/20">
              <AvatarImage src="/generated/employee-avatar.png" alt={`${personalInfo.firstName} ${personalInfo.lastName}`} />
              <AvatarFallback className="bg-white/20 text-white text-2xl font-bold">
                {personalInfo.firstName[0]}{personalInfo.lastName[0]}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-display font-bold text-white mb-2">
                {personalInfo.firstName} {personalInfo.lastName}
              </h2>
              <div className="flex flex-wrap gap-3 mb-3">
                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {professionalInfo.position}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 hover:bg-white/30">
                  <IdCard className="w-3 h-3 mr-1" />
                  {professionalInfo.employeeId}
                </Badge>
                <Badge className="bg-emerald-400/30 text-white border-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {professionalInfo.status}
                </Badge>
              </div>
              <p className="text-white/80 text-sm">
                Mitglied seit {new Date(professionalInfo.startDate).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Personal Information */}
        <Card className="bg-[#161c21] border-white/10 p-6 fade-in-up hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">Persönliche Informationen</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Vorname</Label>
              {editMode ? (
                <Input
                  value={personalInfo.firstName}
                  onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Nachname</Label>
              {editMode ? (
                <Input
                  value={personalInfo.lastName}
                  onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.lastName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                E-Mail
              </Label>
              {editMode ? (
                <Input
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                Telefon
              </Label>
              {editMode ? (
                <Input
                  type="tel"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Geburtsdatum
              </Label>
              <p className="text-white font-medium">
                {new Date(personalInfo.dateOfBirth).toLocaleDateString('de-DE')}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                Nationalität
              </Label>
              <p className="text-white font-medium">{personalInfo.nationality}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Adresse
              </Label>
              {editMode ? (
                <Input
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({...personalInfo, address: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs">PLZ</Label>
              {editMode ? (
                <Input
                  value={personalInfo.postcode}
                  onChange={(e) => setPersonalInfo({...personalInfo, postcode: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.postcode}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Stadt</Label>
              {editMode ? (
                <Input
                  value={personalInfo.city}
                  onChange={(e) => setPersonalInfo({...personalInfo, city: e.target.value})}
                  className="bg-[#0f1417] border-white/10 text-white"
                />
              ) : (
                <p className="text-white font-medium">{personalInfo.city}</p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setEditMode(false)}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Speichern
              </Button>
            </div>
          )}
        </Card>

        {/* Professional Information */}
        <Card className="bg-[#161c21] border-white/10 p-6 fade-in-up hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">Berufliche Informationen</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Position</Label>
              <p className="text-white font-medium">{professionalInfo.position}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Abteilung</Label>
              <p className="text-white font-medium">{professionalInfo.department}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <IdCard className="w-4 h-4 text-blue-400" />
                Mitarbeiter-ID
              </Label>
              <p className="text-white font-medium">{professionalInfo.employeeId}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs">Vertragstyp</Label>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <GraduationCap className="w-3 h-3 mr-1" />
                {professionalInfo.contractType}
              </Badge>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                Eintrittsdatum
              </Label>
              <p className="text-white font-medium">
                {new Date(professionalInfo.startDate).toLocaleDateString('de-DE')}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white/60 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                Arbeitserlaubnis
              </Label>
              <p className="text-white font-medium flex items-center gap-2">
                {professionalInfo.workPermit}
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </p>
            </div>
          </div>
        </Card>

        {/* HR Contact */}
        <Card className="bg-[#161c21] border-white/10 p-6 fade-in-up hover:border-emerald-500/30 transition-all duration-300" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-display font-bold text-white">HR Kontakt</h3>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Avatar className="w-16 h-16 border-2 border-emerald-500/30">
              <AvatarImage src={hrContact.photo} alt={hrContact.name} />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-lg">
                {hrContact.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white mb-1">{hrContact.name}</h4>
              <p className="text-white/60 text-sm mb-2">{hrContact.position}</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {hrContact.department}
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                  <Clock className="w-3 h-3 mr-1" />
                  {hrContact.availableHours}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f1417] border border-white/5">
              <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">E-Mail</p>
                <a 
                  href={`mailto:${hrContact.email}`} 
                  className="text-white font-medium hover:text-emerald-400 transition-colors"
                >
                  {hrContact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f1417] border border-white/5">
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Büro</p>
                <a 
                  href={`tel:${hrContact.phone}`} 
                  className="text-white font-medium hover:text-emerald-400 transition-colors"
                >
                  {hrContact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f1417] border border-white/5">
              <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Mobil</p>
                <a 
                  href={`tel:${hrContact.mobile}`} 
                  className="text-white font-medium hover:text-emerald-400 transition-colors"
                >
                  {hrContact.mobile}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0f1417] border border-white/5">
              <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white/60 text-xs mb-1">Büro</p>
                <p className="text-white font-medium">{hrContact.office}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={() => setMessageDialogOpen(true)}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Nachricht senden
          </Button>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="bg-[#161c21] border-white/10 p-4 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group fade-in-up"
            style={{ animationDelay: "0.3s" }}
            onClick={() => router.push("/documents")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 flex items-center justify-center transition-colors">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium">Dokumente</p>
                <p className="text-white/60 text-xs">Verwalten</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-[#161c21] border-white/10 p-4 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group fade-in-up"
            style={{ animationDelay: "0.35s" }}
            onClick={() => router.push("/tasks")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 group-hover:bg-purple-500/30 flex items-center justify-center transition-colors">
                <CheckCircle className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-medium">Aufgaben</p>
                <p className="text-white/60 text-xs">Checkliste</p>
              </div>
            </div>
          </Card>

          <Card 
            className="bg-[#161c21] border-white/10 p-4 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer group fade-in-up"
            style={{ animationDelay: "0.4s" }}
            onClick={() => router.push("/faq")}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 group-hover:bg-emerald-500/30 flex items-center justify-center transition-colors">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">FAQ</p>
                <p className="text-white/60 text-xs">Hilfe</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="bg-[#161c21] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-display">Nachricht an {hrContact.name}</DialogTitle>
            <DialogDescription className="text-white/60">
              Senden Sie eine Nachricht an Ihren HR-Manager
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="message" className="text-white/60">Ihre Nachricht</Label>
              <Textarea
                id="message"
                placeholder="Schreiben Sie Ihre Nachricht..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="mt-2 bg-[#0f1417] border-white/10 text-white placeholder:text-white/30"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setMessageDialogOpen(false)} 
                className="flex-1 border-white/10 text-white hover:bg-white/5"
              >
                Abbrechen
              </Button>
              <Button 
                onClick={handleSendMessage} 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0"
              >
                Senden
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}