import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { SEO } from "@/components/SEO";

export default function HRDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    } else if (!loading && user && "role" in user && user.role !== "hr") {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <Layout view="hr">
        <SEO title="HR Dashboard - WorkBridge" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Lade Dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || ("role" in user && user.role !== "hr")) {
    return null;
  }

  return (
    <Layout view="hr">
      <SEO 
        title="HR Dashboard - WorkBridge"
        description="Verwalten Sie Mitarbeiter, Aufgaben und Einladungen"
      />
      
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-primary text-primary-foreground">
          <div className="container py-6">
            <div>
              <h1 className="text-2xl font-bold">HR Dashboard</h1>
              <p className="text-sm text-primary-foreground/80">
                Mitarbeiterverwaltung & Übersicht
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container py-6">
          <HRDashboard />
        </div>
      </div>
    </Layout>
  );
}