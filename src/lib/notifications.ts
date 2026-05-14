import { toast } from "@/hooks/use-toast";

export const notifications = {
  success: (title: string, description?: string) => {
    toast({
      title,
      description,
      className: "bg-success text-white border-success",
    });
  },

  error: (title: string, description?: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  },

  warning: (title: string, description?: string) => {
    toast({
      title,
      description,
      className: "bg-warning text-white border-warning",
    });
  },

  info: (title: string, description?: string) => {
    toast({
      title,
      description,
      className: "bg-accent text-white border-accent",
    });
  },

  taskCompleted: (taskName: string, xp: number) => {
    toast({
      title: "🎉 Aufgabe erledigt!",
      description: `${taskName} - +${xp} XP gewonnen`,
      className: "bg-success text-white border-success",
    });
  },

  documentValidated: (docName: string) => {
    toast({
      title: "✅ Dokument validiert",
      description: docName,
      className: "bg-success text-white border-success",
    });
  },

  documentRejected: (docName: string, reason?: string) => {
    toast({
      title: "❌ Dokument abgelehnt",
      description: reason || docName,
      variant: "destructive",
    });
  },

  reminderSent: (employeeName: string) => {
    toast({
      title: "📧 Erinnerung gesendet",
      description: `An ${employeeName}`,
      className: "bg-accent text-white border-accent",
    });
  }
};