import { useState } from "react";
import { WorkerDashboard } from "@/components/worker/WorkerDashboard";
import { TaskChecklist } from "@/components/worker/TaskChecklist";
import { DocumentManager } from "@/components/worker/DocumentManager";
import { AIAssistant } from "@/components/worker/AIAssistant";
import { HRDashboard } from "@/components/hr/HRDashboard";
import { RoleSelector } from "@/components/RoleSelector";
import { Onboarding } from "@/components/Onboarding";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SEO } from "@/components/SEO";

type WorkerView = "dashboard" | "tasks" | "documents" | "assistant";

export default function Home() {
  const [userRole, setUserRole] = useState<"worker" | "hr_manager" | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentView, setCurrentView] = useState<WorkerView>("dashboard");

  if (showOnboarding) {
    return (
      <LanguageProvider>
        <SEO 
          title="WorkBridgeDe - Administrative Guide for Foreign Workers in Germany"
          description="Complete platform to help foreign workers (Fachkraft/Azubi) manage their administrative tasks in Germany with remote monitoring by HR Managers."
        />
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </LanguageProvider>
    );
  }

  if (!userRole) {
    return (
      <LanguageProvider>
        <SEO 
          title="WorkBridgeDe - Choose Your Role"
          description="Select your role: Worker or HR Manager to access your dedicated dashboard."
        />
        <RoleSelector onSelectRole={setUserRole} />
      </LanguageProvider>
    );
  }

  if (userRole === "hr_manager") {
    return (
      <LanguageProvider>
        <SEO 
          title="HR Dashboard - WorkBridgeDe"
          description="Monitor and support your international team members through their administrative journey in Germany."
        />
        <HRDashboard />
      </LanguageProvider>
    );
  }

  const renderWorkerView = () => {
    switch (currentView) {
      case "dashboard":
        return <WorkerDashboard />;
      case "tasks":
        return <TaskChecklist />;
      case "documents":
        return <DocumentManager />;
      case "assistant":
        return <AIAssistant />;
      default:
        return <WorkerDashboard />;
    }
  };

  return (
    <LanguageProvider>
      <SEO 
        title="Worker Dashboard - WorkBridgeDe"
        description="Your personal guide through German administrative procedures. Track your progress, manage documents, and get AI-powered assistance."
      />
      {renderWorkerView()}
    </LanguageProvider>
  );
}