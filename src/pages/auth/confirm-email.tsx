import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ConfirmEmail() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        // Supabase gère automatiquement la confirmation d'email via le hash URL
        // On vérifie juste si l'utilisateur est maintenant authentifié
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setStatus("error");
          setErrorMessage("Erreur lors de la vérification de la session");
          return;
        }

        // Si on a une session, l'email a été confirmé avec succès
        if (session) {
          setStatus("success");
          
          // Déconnecter l'utilisateur pour qu'il se connecte manuellement
          await supabase.auth.signOut();
          
          // Rediriger vers la page de connexion après 2 secondes
          setTimeout(() => {
            router.push("/auth/login?verified=true");
          }, 2000);
        } else {
          // Pas de session = lien invalide ou expiré
          setStatus("error");
          setErrorMessage("Lien de confirmation invalide ou expiré");
        }
      } catch (error: any) {
        console.error("Error confirming email:", error);
        setStatus("error");
        setErrorMessage(error.message || "Une erreur est survenue lors de la confirmation");
      }
    };

    // Attendre que le composant soit monté et que le hash soit disponible
    if (window.location.hash) {
      handleEmailConfirmation();
    } else {
      setStatus("error");
      setErrorMessage("Lien de confirmation manquant");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0d0f] p-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f2d22] via-[#0a1f17] to-[#071812] opacity-30"></div>
      </div>

      <Card className="w-full max-w-md p-8 premium-card fade-in-up text-center bg-[#161c21] border-[rgba(16,185,129,0.3)] relative z-10">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4">
              <Loader2 className="w-8 h-8 text-[#34d399] animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
              Vérification en cours...
            </h1>
            <p className="text-[#8fa3b3]">
              Veuillez patienter pendant que nous vérifions votre email.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto mb-4 animate-pulse">
              <CheckCircle className="w-8 h-8 text-[#34d399]" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
              Email vérifié !
            </h1>
            <p className="text-[#8fa3b3] mb-4">
              Votre adresse email a été vérifiée avec succès.
            </p>
            <div className="bg-[#1c242b] border border-[rgba(16,185,129,0.3)] rounded-xl p-4 mb-4">
              <p className="text-sm text-[#34d399]">
                ✓ Redirection vers la page de connexion...
              </p>
            </div>
            <Link href="/auth/login?verified=true">
              <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium">
                Se connecter maintenant
              </Button>
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-[#ef4444]" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-[#f0f4f8]" style={{fontFamily: 'Bricolage Grotesque, system-ui, sans-serif'}}>
              Erreur de vérification
            </h1>
            <p className="text-[#ef4444] mb-6 text-sm">
              {errorMessage}
            </p>
            <div className="space-y-2">
              <Link href="/auth/signup">
                <Button 
                  variant="outline"
                  className="w-full btn-premium bg-[#1c242b] border-[rgba(255,255,255,0.06)] text-[#f0f4f8] hover:border-[rgba(16,185,129,0.3)] hover:bg-[#222c35]"
                >
                  Créer un nouveau compte
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="w-full bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white font-semibold rounded-xl h-12 shadow-lg shadow-[rgba(16,185,129,0.3)] btn-premium">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}