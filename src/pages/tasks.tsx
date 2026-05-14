import { TaskChecklist } from "@/components/worker/TaskChecklist";
import { SEO } from "@/components/SEO";

export default function TasksPage() {
  return (
    <>
      <SEO 
        title="Aufgaben - WorkBridgeDe"
        description="Verwalte deine Aufgaben und verfolge deinen Fortschritt in Deutschland."
      />
      <TaskChecklist />
    </>
  );
}