import { DocumentManager } from "@/components/worker/DocumentManager";
import { SEO } from "@/components/SEO";

export default function DocumentsPage() {
  return (
    <>
      <SEO 
        title="Dokumente - WorkBridgeDe"
        description="Verwalte deine wichtigen Dokumente für Deutschland."
      />
      <DocumentManager />
    </>
  );
}