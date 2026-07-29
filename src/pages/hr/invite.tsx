import { useState } from "react";
import { Layout } from "@/components/Layout";
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
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { Mail, Loader2, CheckCircle2, Copy, ArrowLeft } from "lucide-react";
import { createInvitation } from "@/services/invitationService";
import { sendInvitationEmail } from "@/services/emailService";
import Link from "next/link";

export default function InvitePage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "worker" as "worker" | "hr_manager",
    jobType: "Fachkraft" as "Fachkraft" | "Azubi"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!userProfile?.id) {
        throw new Error("User profile not found");
      }

      // Create invitation in database
      const { data: invitation, error: inviteError } = await createInvitation({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        invitedBy: userProfile.id,
        companyId: userProfile.company_id
      });

      if (inviteError) throw inviteError;

      const baseUrl = window.location.origin;
      const link = `${baseUrl}/auth/signup?invite=${invitation.code}`;
      
      setInviteLink(link);
      setInviteCode(invitation.code);

      // Send invitation email
      const inviterName = `${userProfile.first_name} ${userProfile.last_name}` || userProfile.email;
      const companyName = userProfile.company || "Ihr Unternehmen";

      await sendInvitationEmail({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        inviterName,
        companyName,
        inviteLink: link,
        inviteCode: invitation.code
      });

      setSuccess(true);
    } catch (err: any) {
      console.error("Error creating invitation:", err);
      setError(err.message || "Fehler beim Erstellen der Einladung");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!userProfile || userProfile.role !== "hr_manager") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="p-8 text-center">
            <p className="text-destructive mb-4">Nur für HR Manager verfügbar</p>
            <Button onClick={() => router.push("/")}>
              Zurück zum Dashboard
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <Card className="p-8 text-center border-[rgba(16,185,129,0.3)]">
            <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#34d399]" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]">
              Einladung erfolgreich gesendet!
            </h1>
            <p className="text-[#8fa3b3] mb-6">
              Eine E-Mail wurde an <strong className="text-[#34d399]">{formData.email}</strong> gesendet.
            </p>

            <div className="bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-4">
              <Label className="text-sm text-[#8fa3b3] mb-2 block">Einladungscode</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-[#0f1417] px-4 py-3 rounded-lg text-[#34d399] font-mono text-lg">
                  {inviteCode}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(inviteCode)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl p-4 mb-6">
              <Label className="text-sm text-[#8fa3b3] mb-2 block">Einladungslink</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1 bg-[#0f1417] text-[#8fa3b3] text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(inviteLink)}
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSuccess(false);
                  setFormData({
                    email: "",
                    firstName: "",
                    lastName: "",
                    role: "worker",
                    jobType: "Fachkraft"
                  });
                }}
                variant="outline"
                className="flex-1"
              >
                Weitere Einladung senden
              </Button>
              <Button
                onClick={() => router.push("/hr/employees")}
                className="flex-1 bg-gradient-to-r from-[#10b981] to-[#059669]"
              >
                Zu Mitarbeitern
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Link href="/hr/employees">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Mitarbeiter
          </Button>
        </Link>

        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#f0f4f8]">
                Mitarbeiter einladen
              </h1>
              <p className="text-[#8fa3b3] text-sm">
                Senden Sie eine Einladung an einen neuen Mitarbeiter
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Vorname</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  placeholder="Max"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Nachname</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  placeholder="Mustermann"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="max.mustermann@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rolle</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="worker">Fachkraft / Azubi</SelectItem>
                  <SelectItem value="hr_manager">HR Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === "worker" && (
              <div className="space-y-2">
                <Label htmlFor="jobType">Art der Stelle</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value: any) => setFormData({ ...formData, jobType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fachkraft">Fachkraft (Skilled Worker)</SelectItem>
                    <SelectItem value="Azubi">Azubi (Apprentice)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="bg-[#1c242b] border border-[rgba(16,185,129,0.3)] rounded-xl p-4">
              <p className="text-sm text-[#8fa3b3]">
                <strong className="text-[#34d399]">ℹ️ Hinweis:</strong> Der Mitarbeiter erhält eine E-Mail mit einem einzigartigen Einladungslink. 
                Der Link ist 7 Tage gültig.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold h-12"
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
      </div>
    </Layout>
  );
}