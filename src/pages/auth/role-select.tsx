import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CheckCircle } from "lucide-react";

export default function RoleSelect() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");
  const [role, setRole] = useState<"worker" | "hr_manager">("worker");
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          router.push("/auth/login");
          return;
        }

        if (!session) {
          router.push("/auth/login");
          return;
        }

        setUserEmail(session.user.email || "");
        
        // Extraire le nom depuis les métadonnées Google
        const metadata = session.user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || "";
        setUserName(fullName || "utilisateur");

        // Vérifier si le profil existe déjà avec un rôle défini
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (existingProfile && existingProfile.role) {
          // Profil déjà configuré, rediriger selon le rôle
          if (existingProfile.role === "worker") {
            router.push("/");
          } else if (existingProfile.role === "hr_manager") {
            router.push("/hr/employees");
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        router.push("/auth/login");
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No session found");
      }

      const metadata = session.user.user_metadata || {};
      
      // Extraction complète des données Google
      const fullName = metadata.full_name || metadata.name || "";
      const firstName = metadata.given_name || fullName.split(" ")[0] || "";
      const lastName = metadata.family_name || fullName.split(" ").slice(1).join(" ") || "";
      const avatarUrl = metadata.avatar_url || metadata.picture || "";
      const googleId = metadata.sub || "";

      // Créer ou mettre à jour le profil avec toutes les informations Google
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: session.user.id,
          email: session.user.email || "",
          role: role,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
          avatar_url: avatarUrl,
          google_id: googleId,
          auth_provider: 'google',
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error("Profile upsert error:", profileError);
        throw profileError;
      }

      // Vérifier que le profil a bien été créé
      const { data: verifyProfile, error: verifyError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (verifyError || !verifyProfile) {
        console.error("Profile verification error:", verifyError);
        throw new Error("Le profil n'a pas pu être créé. Veuillez réessayer.");
      }

      console.log("Profile created successfully:", verifyProfile);

      // Rediriger selon le rôle
      if (role === "worker") {
        router.push("/");
      } else if (role === "hr_manager") {
        router.push("/hr/employees");
      }
    } catch (err: any) {
      console.error("Error setting role:", err);
      setError(err.message || "Une erreur est survenue lors de la création de votre profil");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
        <Card className="w-full max-w-md p-8 premium-card text-center bg-[#161c21] border-[rgba(16,185,129,0.3)]">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-[#8fa3b3]">Chargement de votre profil...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <Card className="w-full max-w-md p-8 premium-card fade-in-up bg-[#161c21] border-[rgba(16,185,129,0.3)] relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[rgba(16,185,129,0.3)]">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
            Bienvenue{userName ? `, ${userName}` : ''} !
          </h1>
          <p className="text-[#8fa3b3] text-sm">
            Compte Google connecté : <strong className="text-[#34d399]">{userEmail}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-sm fade-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Label className="text-[#f0f4f8] text-base">Je suis...</Label>
            <RadioGroup
              value={role}
              onValueChange={(value: "worker" | "hr_manager") => setRole(value)}
              disabled={loading}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-4 bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl cursor-pointer hover:border-[rgba(16,185,129,0.3)] transition-colors">
                <RadioGroupItem value="worker" id="worker" />
                <Label htmlFor="worker" className="cursor-pointer flex-1 text-[#f0f4f8]">
                  <div className="font-semibold">Travailleur étranger</div>
                  <div className="text-xs text-[#8fa3b3] mt-1">Fachkraft ou Azubi en Allemagne</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl cursor-pointer hover:border-[rgba(16,185,129,0.3)] transition-colors">
                <RadioGroupItem value="hr_manager" id="hr_manager" />
                <Label htmlFor="hr_manager" className="cursor-pointer flex-1 text-[#f0f4f8]">
                  <div className="font-semibold">Gestionnaire RH</div>
                  <div className="text-xs text-[#8fa3b3] mt-1">J'accompagne des travailleurs étrangers</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Création du profil...
              </>
            ) : (
              "Continuer"
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="p-4 bg-[#1c242b] border border-[rgba(255,255,255,0.06)] rounded-xl">
            <p className="text-xs text-[#8fa3b3] text-center">
              🔒 Votre compte Google est sécurisé. Un email de confirmation sera envoyé à votre adresse.
            </p>
          </div>
          
          <div className="p-3 bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)] rounded-xl">
            <p className="text-xs text-[#34d399] text-center">
              ✓ Connexion rapide · ✓ Données synchronisées · ✓ Sécurité renforcée
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}