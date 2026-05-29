import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Bell, 
  Globe, 
  Moon, 
  Key, 
  Smartphone, 
  CheckCircle, 
  AlertCircle,
  Mail,
  Lock,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showVerificationCode, setShowVerificationCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("ABCD-EFGH-IJKL-MNOP");

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    documentUpdates: true,
    deadlines: true
  });

  // Load user preferences on mount
  useEffect(() => {
    if (user?.id) {
      loadUserPreferences();
    }
  }, [user?.id]);

  const loadUserPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("notification_preferences")
        .eq("id", user?.id)
        .single();

      if (error) throw error;

      if (data?.notification_preferences) {
        setNotifications(data.notification_preferences);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive"
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Fehler",
        description: "Das Passwort muss mindestens 8 Zeichen lang sein.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Passwort aktualisiert",
        description: "Ihr Passwort wurde erfolgreich geändert.",
      });

      // Reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Fehler",
        description: error.message || "Passwort konnte nicht geändert werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = async (key: string, value: boolean) => {
    const updatedNotifications = { ...notifications, [key]: value };
    setNotifications(updatedNotifications);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_preferences: updatedNotifications })
        .eq("id", user?.id);

      if (error) throw error;

      toast({
        title: "Gespeichert",
        description: "Benachrichtigungseinstellungen aktualisiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Einstellungen konnten nicht gespeichert werden.",
        variant: "destructive"
      });
    }
  };

  const handleEnable2FA = () => {
    setShowVerificationCode(true);
    toast({
      title: "2FA-Code generiert",
      description: "Scannen Sie den QR-Code oder geben Sie den Code manuell ein.",
    });
  };

  const handleVerify2FA = () => {
    if (verificationCode.length === 6) {
      setTwoFactorEnabled(true);
      setShowVerificationCode(false);
      toast({
        title: "2FA aktiviert",
        description: "Zwei-Faktor-Authentifizierung wurde erfolgreich aktiviert.",
      });
    } else {
      toast({
        title: "Ungültiger Code",
        description: "Bitte geben Sie einen 6-stelligen Code ein.",
        variant: "destructive"
      });
    }
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
    toast({
      title: "2FA deaktiviert",
      description: "Zwei-Faktor-Authentifizierung wurde deaktiviert.",
    });
  };

  return (
    <>
      <Topbar title="Einstellungen" subtitle="Verwalten Sie Ihre Kontoeinstellungen" />

      <div className="p-7">
        <Tabs defaultValue="security" className="w-full">
          <TabsList className="bg-[#161c21] border border-white/[0.06] p-1 mb-6">
            <TabsTrigger 
              value="security"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              <Shield className="w-4 h-4 mr-2" />
              Sicherheit
            </TabsTrigger>
            <TabsTrigger 
              value="notifications"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              <Bell className="w-4 h-4 mr-2" />
              Benachrichtigungen
            </TabsTrigger>
            <TabsTrigger 
              value="preferences"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              <Globe className="w-4 h-4 mr-2" />
              Präferenzen
            </TabsTrigger>
          </TabsList>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            {/* Two-Factor Authentication */}
            <Card className="bg-[#161c21] border-white/[0.06] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#f0f4f8] mb-1" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                    Zwei-Faktor-Authentifizierung (2FA)
                  </h3>
                  <p className="text-sm text-[#8fa3b3]">
                    Erhöhen Sie die Sicherheit Ihres Kontos mit 2FA. Sie benötigen dann einen zusätzlichen Code bei der Anmeldung.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {twoFactorEnabled && (
                    <CheckCircle className="w-5 h-5 text-[#10b981]" />
                  )}
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleEnable2FA();
                      } else {
                        handleDisable2FA();
                      }
                    }}
                  />
                </div>
              </div>

              {twoFactorEnabled && !showVerificationCode && (
                <div className="p-4 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] rounded-xl">
                  <div className="flex items-center gap-2 text-[#10b981] mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">2FA ist aktiviert</span>
                  </div>
                  <p className="text-xs text-[#8fa3b3]">
                    Ihr Konto ist durch Zwei-Faktor-Authentifizierung geschützt.
                  </p>
                </div>
              )}

              {showVerificationCode && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#1c242b] rounded-xl border border-white/[0.06]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-[#10b981]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#f0f4f8] text-sm">Authenticator App einrichten</h4>
                        <p className="text-xs text-[#8fa3b3]">Verwenden Sie Google Authenticator oder Authy</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-[#8fa3b3] text-xs mb-2 block">Schritt 1: QR-Code scannen</Label>
                        <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mx-auto">
                          <div className="text-xs text-center text-gray-600">
                            [QR Code hier]<br/>
                            Simuliert für Demo
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#8fa3b3] text-xs mb-2 block">Oder manuell eingeben:</Label>
                        <div className="p-3 bg-[#0f1417] rounded-lg border border-white/[0.06]">
                          <code className="text-sm text-[#10b981] font-mono">{twoFactorCode}</code>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#8fa3b3] text-xs mb-2 block">Schritt 2: 6-stelligen Code eingeben</Label>
                        <Input
                          type="text"
                          maxLength={6}
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="123456"
                          className="bg-[#0f1417] border-white/[0.06] text-[#f0f4f8] text-center text-lg tracking-widest"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setShowVerificationCode(false)}
                          className="flex-1 bg-[#1c242b] border-white/[0.06] text-[#f0f4f8] hover:border-white/[0.10]"
                        >
                          Abbrechen
                        </Button>
                        <Button
                          onClick={handleVerify2FA}
                          disabled={verificationCode.length !== 6}
                          className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white"
                        >
                          Verifizieren
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Password Change */}
            <Card className="bg-[#161c21] border-white/[0.06] p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#1e40af] flex items-center justify-center flex-shrink-0">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-[#f0f4f8] mb-1" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                    Passwort ändern
                  </h3>
                  <p className="text-sm text-[#8fa3b3]">
                    Aktualisieren Sie Ihr Passwort regelmäßig für mehr Sicherheit.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label className="text-[#f0f4f8] mb-2">Neues Passwort</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#566878]" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mindestens 8 Zeichen"
                      required
                      minLength={8}
                      disabled={loading}
                      className="pl-10 bg-[#1c242b] border-white/[0.06] text-[#f0f4f8]"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-[#f0f4f8] mb-2">Neues Passwort bestätigen</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#566878]" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Passwort wiederholen"
                      required
                      disabled={loading}
                      className="pl-10 bg-[#1c242b] border-white/[0.06] text-[#f0f4f8]"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full bg-gradient-to-r from-[#3b82f6] to-[#1e40af] hover:from-[#60a5fa] hover:to-[#3b82f6] text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wird aktualisiert...
                    </>
                  ) : (
                    "Passwort aktualisieren"
                  )}
                </Button>
              </form>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="bg-[#161c21] border-white/[0.06] p-6">
              <h3 className="text-lg font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                Benachrichtigungseinstellungen
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">E-Mail Benachrichtigungen</p>
                      <p className="text-xs text-[#8fa3b3]">Erhalten Sie Updates per E-Mail</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">Push Benachrichtigungen</p>
                      <p className="text-xs text-[#8fa3b3]">Echtzeit-Updates im Browser</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">Aufgaben-Erinnerungen</p>
                      <p className="text-xs text-[#8fa3b3]">Fällige Aufgaben</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.taskReminders}
                    onCheckedChange={(checked) => handleNotificationChange("taskReminders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-[#f59e0b]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">Fristen & Deadlines</p>
                      <p className="text-xs text-[#8fa3b3]">Wichtige Termine</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.deadlines}
                    onCheckedChange={(checked) => handleNotificationChange("deadlines", checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4">
            <Card className="bg-[#161c21] border-white/[0.06] p-6">
              <h3 className="text-lg font-bold text-[#f0f4f8] mb-4" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
                Allgemeine Einstellungen
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">Sprache</p>
                      <p className="text-xs text-[#8fa3b3]">Deutsch</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-[#1c242b] border-white/[0.06] text-[#f0f4f8]">
                    Ändern
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#1c242b] rounded-xl">
                  <div className="flex items-center gap-3">
                    <Moon className="w-5 h-5 text-[#10b981]" />
                    <div>
                      <p className="font-medium text-[#f0f4f8]">Dark Mode</p>
                      <p className="text-xs text-[#8fa3b3]">Aktuelles Theme</p>
                    </div>
                  </div>
                  <Switch checked={true} />
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}