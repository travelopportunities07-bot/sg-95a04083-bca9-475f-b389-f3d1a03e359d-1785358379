import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { FileText, Upload, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentViewer } from "@/components/DocumentViewer";
import { getUserDocuments, downloadDocument } from "@/services/documentService";
import type { Document as DocType } from "@/services/documentService";

interface Document {
  id: string;
  name: string;
  category: string;
  status: "approved" | "pending" | "rejected" | "missing";
  uploadedAt?: string;
  size?: string;
  validUntil?: string;
}

export default function DocumentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [viewingDocument, setViewingDocument] = useState<DocType | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadDocuments();
    }
  }, [user]);

  const loadDocuments = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const { data, error } = await getUserDocuments(user.id);
    
    if (error) {
      toast({
        title: "Fehler",
        description: "Dokumente konnten nicht geladen werden.",
        variant: "destructive"
      });
    } else if (data) {
      setDocuments(data);
    }
    
    setLoading(false);
  };

  const handleUploadComplete = async (documentId: string) => {
    toast({
      title: "Erfolgreich",
      description: "Dokument erfolgreich hochgeladen.",
    });
    setShowUploadDialog(false);
    await loadDocuments();
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Fehler",
      description: error,
      variant: "destructive"
    });
  };

  const handleDownload = async (doc: DocType) => {
    const { error } = await downloadDocument(doc.file_path, doc.file_name);
    if (error) {
      toast({
        title: "Fehler",
        description: "Dokument konnte nicht heruntergeladen werden.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Download gestartet",
        description: `${doc.file_name} wird heruntergeladen...`,
      });
    }
  };

  const handleView = (doc: DocType) => {
    setViewingDocument(doc);
  };

  const handleUpload = (docName: string) => {
    toast({
      title: "Upload gestartet",
      description: `${docName} wird hochgeladen...`,
    });
    // Hier würde die eigentliche Upload-Logik stehen
  };

  const getStatusBadge = (status: Document["status"]) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)]">
            <CheckCircle className="w-3 h-3 mr-1" />
            Genehmigt
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border-[rgba(245,158,11,0.3)]">
            <Clock className="w-3 h-3 mr-1" />
            Wird geprüft
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-[rgba(239,68,68,0.15)] text-[#ef4444] border-[rgba(239,68,68,0.3)]">
            <XCircle className="w-3 h-3 mr-1" />
            Abgelehnt
          </Badge>
        );
      case "missing":
        return (
          <Badge className="bg-[rgba(148,163,184,0.15)] text-[#94a3b8] border-[rgba(148,163,184,0.3)]">
            <AlertCircle className="w-3 h-3 mr-1" />
            Fehlt
          </Badge>
        );
    }
  };

  const approvedDocs = documents.filter(d => d.status === "approved").length;
  const pendingDocs = documents.filter(d => d.status === "pending").length;
  const rejectedDocs = documents.filter(d => d.status === "rejected").length;
  const missingDocs = documents.filter(d => d.status === "missing").length;

  return (
    <>
      <Topbar 
        title="Dokumente" 
        subtitle="Verwalte deine wichtigen Dokumente"
        actions={
          <Button 
            onClick={() => handleUpload("Neues Dokument")}
            className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-9 px-4 text-sm font-semibold"
          >
            <Upload className="w-4 h-4 mr-2" />
            Hochladen
          </Button>
        }
      />
      
      <div className="p-7">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-[#0f2d22] via-[#0a1f17] to-[#071812] border-[rgba(16,185,129,0.3)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                <CheckCircle className="text-[#10b981]" size={18} />
              </div>
            </div>
            <div className="font-display text-[28px] font-bold text-[#10b981] leading-none mb-1">
              {approvedDocs}
            </div>
            <div className="text-xs text-[#8fa3b3]">Genehmigt</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a1200] to-[#201700] border-[rgba(245,158,11,0.3)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.12)] flex items-center justify-center">
                <Clock className="text-[#f59e0b]" size={18} />
              </div>
            </div>
            <div className="font-display text-[28px] font-bold text-[#f59e0b] leading-none mb-1">
              {pendingDocs}
            </div>
            <div className="text-xs text-[#8fa3b3]">Wird geprüft</div>
          </Card>

          <Card className="bg-gradient-to-br from-[#1a0a0a] to-[#2a1010] border-[rgba(239,68,68,0.3)] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(239,68,68,0.12)] flex items-center justify-center">
                <XCircle className="text-[#ef4444]" size={18} />
              </div>
            </div>
            <div className="font-display text-[28px] font-bold text-[#ef4444] leading-none mb-1">
              {rejectedDocs}
            </div>
            <div className="text-xs text-[#8fa3b3]">Abgelehnt</div>
          </Card>

          <Card className="bg-[#161c21] border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-[rgba(148,163,184,0.12)] flex items-center justify-center">
                <AlertCircle className="text-[#94a3b8]" size={18} />
              </div>
            </div>
            <div className="font-display text-[28px] font-bold text-[#f0f4f8] leading-none mb-1">
              {missingDocs}
            </div>
            <div className="text-xs text-[#8fa3b3]">Fehlt</div>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="bg-[#161c21] border-white/[0.06] p-4 mb-6">
          <div className="flex items-center gap-3">
            <Search className="text-[#566878]" size={18} />
            <Input 
              placeholder="Dokumente durchsuchen..." 
              className="flex-1 bg-transparent border-0 text-[#f0f4f8] placeholder:text-[#566878] focus-visible:ring-0"
            />
          </div>
        </Card>

        {/* Documents Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-[#161c21] border border-white/[0.06] p-1 mb-6">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Alle ({documents.length})
            </TabsTrigger>
            <TabsTrigger 
              value="approved"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Genehmigt ({approvedDocs})
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Wird geprüft ({pendingDocs})
            </TabsTrigger>
            <TabsTrigger 
              value="action"
              className="data-[state=active]:bg-[rgba(16,185,129,0.15)] data-[state=active]:text-[#10b981]"
            >
              Aktion erforderlich ({rejectedDocs + missingDocs})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2">
            {documents.map((doc) => (
              <Card 
                key={doc.id}
                className="bg-[#161c21] border-white/[0.06] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a1a10] to-[#0f2418] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#10b981]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    {doc.uploadedAt && (
                      <span className="text-[11px] text-[#566878]">
                        Hochgeladen am {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-[11px] text-[#566878]">· {doc.size}</span>
                    )}
                  </div>
                  {doc.validUntil && (
                    <p className="text-[11px] text-[#566878]">
                      Gültig bis {new Date(doc.validUntil).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  {doc.status !== "missing" && (
                    <>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleView(doc.name)}
                        className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDownload(doc.name)}
                        className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                      >
                        <Download size={16} />
                      </Button>
                    </>
                  )}
                  {(doc.status === "missing" || doc.status === "rejected") && (
                    <Button 
                      size="sm" 
                      onClick={() => handleUpload(doc.name)}
                      className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs font-semibold"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Hochladen
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="approved" className="space-y-2">
            {documents.filter(d => d.status === "approved").map((doc) => (
              <Card 
                key={doc.id}
                className="bg-[#161c21] border-white/[0.06] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0a1a10] to-[#0f2418] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#10b981]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    {doc.uploadedAt && (
                      <span className="text-[11px] text-[#566878]">
                        Hochgeladen am {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-[11px] text-[#566878]">· {doc.size}</span>
                    )}
                  </div>
                  {doc.validUntil && (
                    <p className="text-[11px] text-[#566878]">
                      Gültig bis {new Date(doc.validUntil).toLocaleDateString('de-DE')}
                    </p>
                  )}
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-2">
            {documents.filter(d => d.status === "pending").map((doc) => (
              <Card 
                key={doc.id}
                className="bg-[#161c21] border-white/[0.06] border-l-[3px] border-l-[#f59e0b] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a1200] to-[#201700] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#f59e0b]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    {doc.uploadedAt && (
                      <span className="text-[11px] text-[#566878]">
                        Hochgeladen am {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-[11px] text-[#566878]">· {doc.size}</span>
                    )}
                  </div>
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="action" className="space-y-2">
            {documents.filter(d => d.status === "rejected" || d.status === "missing").map((doc) => (
              <Card 
                key={doc.id}
                className="bg-[#161c21] border-white/[0.06] border-l-[3px] border-l-[#ef4444] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a0a0a] to-[#2a1010] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#ef4444]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    {doc.uploadedAt && (
                      <span className="text-[11px] text-[#566878]">
                        Hochgeladen am {new Date(doc.uploadedAt).toLocaleDateString('de-DE')}
                      </span>
                    )}
                    {doc.size && (
                      <span className="text-[11px] text-[#566878]">· {doc.size}</span>
                    )}
                  </div>
                </div>
                {getStatusBadge(doc.status)}
                <Button 
                  size="sm" 
                  className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs font-semibold"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Hochladen
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}