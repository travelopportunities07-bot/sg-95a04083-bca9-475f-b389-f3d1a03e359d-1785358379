import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Settings,
  Bell,
  Mail,
  Globe,
  Shield,
  Save
} from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoReminders, setAutoReminders] = useState(false);
  const [language, setLanguage] = useState("de");
  const [companyName, setCompanyName] = useState("TechCorp GmbH");
  const [companyEmail, setCompanyEmail] = useState("hr@techcorp.de");
  const [companyPhone, setCompanyPhone] = useState("+49 30 1234 5678");

  const handleSaveSettings = () => {
    toast({
      title: "Einstellungen gespeichert",
      description: "Deine Änderungen wurden erfolgreich gespeichert."
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
              <h1 className="text-2xl font-bold">Einstellungen</h1>
              <p className="text-sm text-primary-foreground/80">
                HR-Systemkonfiguration
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 space-y-6">
        {/* Company Settings */}
        <Card className="p-6 premium-card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Firmeninformationen</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Firmenname</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-email">Firmen E-Mail</Label>
              <Input
                id="company-email"
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company-phone">Telefon</Label>
              <Input
                id="company-phone"
                type="tel"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 premium-card">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Benachrichtigungen</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notif">E-Mail Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">
                  Erhalte Updates per E-Mail
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notif">Push-Benachrichtigungen</Label>
                <p className="text-sm text-muted-foreground">
                  Erhalte Benachrichtigungen auf deinem Gerät
                </p>
              </div>
              <Switch
                id="push-notif"
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-remind">Automatische Erinnerungen</Label>
                <p className="text-sm text-muted-foreground">
                  Automatische Erinnerungen bei überfälligen Aufgaben
                </p>
              </div>
              <Switch
                id="auto-remind"
                checked={autoReminders}
                onCheckedChange={setAutoReminders}
              />
            </div>
          </div>
        </Card>

        {/* Language Settings */}
        <Card className="p-6 premium-card">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Sprache & Region</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">Sprache</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Email Templates */}
        <Card className="p-6 premium-card">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">E-Mail Vorlagen</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-template">Erinnerungsvorlage</Label>
              <Textarea
                id="reminder-template"
                placeholder="Hallo {name}, bitte denke daran, {task} bis {deadline} zu erledigen..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Verfügbare Platzhalter: {"{name}"}, {"{task}"}, {"{deadline}"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-template">Willkommensnachricht</Label>
              <Textarea
                id="welcome-template"
                placeholder="Willkommen bei {company}! Wir freuen uns, dich bei uns zu haben..."
                className="min-h-[120px]"
              />
              <p className="text-xs text-muted-foreground">
                Verfügbare Platzhalter: {"{name}"}, {"{company}"}, {"{position}"}
              </p>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <Button 
          onClick={handleSaveSettings}
          className="w-full bg-primary btn-premium"
          size="lg"
        >
          <Save className="w-5 h-5 mr-2" />
          Einstellungen speichern
        </Button>
      </div>
    </div>
  );
}