import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createInvitation } from "@/services/invitationService";
import { ArrowLeft, Mail, Loader2, Copy, CheckCircle, QrCode } from "lucide-react";
import QRCode from "qrcode";

export default function InvitePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "worker" as "worker" | "hr_manager"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !("company_id" in user)) {
      toast({
        title: "Erreur",
        description: "Aucune entreprise associée",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error, inviteLink: link } = await createInvitation(
        formData.email,
        (user as any).company_id,
        user.id,
        formData.firstName,
        formData.lastName,
        formData.role
      );

      if (error) throw error;

      if (data && link) {
        setInviteLink(link);
        setInviteCode(data.code);
        
        // Generate QR code
        const qrUrl = await QRCode.toDataURL(link, {
          width: 300,
          margin: 2,
          color: {
            dark: "#1F7A63",
            light: "#F5F7F6"
          }
        });
        setQrCodeUrl(qrUrl);

        // Send invitation email
        const emailResponse = await fetch("/api/send-invite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            inviteLink: link,
            inviteCode: data.code
          })
        });

        if (!emailResponse.ok) {
          throw new Error("Erreur lors de l'envoi de l'email");
        }

        toast({
          title: "Invitation envoyée",
          description: `Un email a été envoyé à ${formData.email}`,
        });

        // Reset form
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          role: "worker"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de l'invitation",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié",
        description: "Lien copié dans le presse-papier"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement("a");
    link.download = `invitation-${inviteCode}.png`;
    link.href = qrCodeUrl;
    link.click();
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
              <h1 className="text-2xl font-bold">Mitarbeiter einladen</h1>
              <p className="text-sm text-primary-foreground/80">
                Neuen Mitarbeiter zur Plattform einladen
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 max-w-2xl space-y-6">
        {/* Invitation Form */}
        <Card className="p-6 premium-card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="mitarbeiter@example.de"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Max"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Mustermann"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rolle *</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "worker" | "hr_manager") => 
                  setFormData({ ...formData, role: value })
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Mitarbeiter (Worker)</SelectItem>
                  <SelectItem value="hr_manager">HR Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Einladung senden
                </>
              )}
            </Button>
          </form>
        </Card>

        {/* Invitation Result */}
        {inviteLink && (
          <Card className="p-6 premium-card space-y-4 fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Einladung erstellt</h3>
                <p className="text-sm text-muted-foreground">
                  Code: <span className="font-mono font-bold text-primary">{inviteCode}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Einladungslink</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(inviteLink)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Gültig für 7 Tage
              </p>
            </div>

            {qrCodeUrl && (
              <div className="space-y-2">
                <Label>QR-Code</Label>
                <div className="flex flex-col items-center gap-3 p-4 bg-muted/5 rounded-lg border">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code"
                    className="w-48 h-48 rounded-lg"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadQRCode}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR-Code herunterladen
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Der Mitarbeiter kann den QR-Code scannen, um sich direkt zu registrieren
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card className="p-4 bg-muted/5 border-muted/30">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            So funktioniert's
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Der Mitarbeiter erhält eine E-Mail mit dem Einladungslink</li>
            <li>• Beim Klicken wird automatisch ein Konto erstellt</li>
            <li>• Der Mitarbeiter wird automatisch Ihrem Unternehmen zugeordnet</li>
            <li>• Der Einladungslink ist 7 Tage gültig</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}