import { Topbar } from "@/components/Topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { FileText, Upload, Download, Eye, CheckCircle, XCircle, Clock, AlertCircle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { DocumentUpload } from "@/components/DocumentUpload";
import { DocumentViewer } from "@/components/DocumentViewer";
import { getUserDocuments, downloadDocument } from "@/services/documentService";
import type { Document as DocType } from "@/services/documentService";

export default function DocumentsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("general");
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

  const handleUploadClick = (category: string = "general") => {
    setUploadCategory(category);
    setShowUploadDialog(true);
  };

  const getStatusBadge = (status: DocType["status"]) => {
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
    }
  };

  const approvedDocs = documents.filter(d => d.status === "approved").length;
  const pendingDocs = documents.filter(d => d.status === "pending").length;
  const rejectedDocs = documents.filter(d => d.status === "rejected").length;

  return (
    <>
      <Topbar 
        title="Dokumente" 
        subtitle="Verwalte deine wichtigen Dokumente"
        actions={
          <Button 
            onClick={() => handleUploadClick()}
            className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-9 px-4 text-sm font-semibold"
          >
            <Upload className="w-4 h-4 mr-2" />
            Hochladen
          </Button>
        }
      />
      
      <div className="p-7">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
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
              Aktion erforderlich ({rejectedDocs})
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
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.file_name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    <span className="text-[11px] text-[#566878]">
                      Hochgeladen am {new Date(doc.created_at).toLocaleDateString('de-DE')}
                    </span>
                    <span className="text-[11px] text-[#566878]">· {(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleView(doc)}
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDownload(doc)}
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Download size={16} />
                  </Button>
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
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.file_name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    <span className="text-[11px] text-[#566878]">
                      Hochgeladen am {new Date(doc.created_at).toLocaleDateString('de-DE')}
                    </span>
                    <span className="text-[11px] text-[#566878]">· {(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleView(doc)}
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDownload(doc)}
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
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.file_name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    <span className="text-[11px] text-[#566878]">
                      Hochgeladen am {new Date(doc.created_at).toLocaleDateString('de-DE')}
                    </span>
                    <span className="text-[11px] text-[#566878]">· {(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                {getStatusBadge(doc.status)}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleView(doc)}
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleDownload(doc)}
                    className="h-8 w-8 p-0 text-[#566878] hover:text-[#8fa3b3] hover:bg-[#1c242b]"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="action" className="space-y-2">
            {documents.filter(d => d.status === "rejected").map((doc) => (
              <Card 
                key={doc.id}
                className="bg-[#161c21] border-white/[0.06] border-l-[3px] border-l-[#ef4444] p-4 flex items-center gap-3.5 hover:border-white/[0.10] hover:bg-[#1c242b] transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1a0a0a] to-[#2a1010] flex items-center justify-center flex-shrink-0">
                  <FileText className="text-[#ef4444]" size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-[#f0f4f8] mb-0.5">{doc.file_name}</h3>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className="bg-[rgba(16,185,129,0.15)] text-[#10b981] border-[rgba(16,185,129,0.3)] text-[10px] px-2 py-0.5">
                      {doc.category}
                    </Badge>
                    <span className="text-[11px] text-[#566878]">
                      Hochgeladen am {new Date(doc.created_at).toLocaleDateString('de-DE')}
                    </span>
                    <span className="text-[11px] text-[#566878]">· {(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  {doc.rejection_reason && (
                    <p className="text-[11px] text-[#ef4444] mt-1">Grund: {doc.rejection_reason}</p>
                  )}
                </div>
                {getStatusBadge(doc.status)}
                <Button 
                  size="sm"
                  onClick={() => handleUploadClick(doc.category)}
                  className="bg-[#10b981] hover:bg-[#34d399] text-[#0a0d0f] h-8 px-4 text-xs font-semibold"
                >
                  <Upload className="w-3 h-3 mr-1" />
                  Neu hochladen
                </Button>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-md scale-in">
          <DialogHeader>
            <DialogTitle>Dokument hochladen</DialogTitle>
            <DialogDescription>
              Laden Sie ein neues Dokument hoch. Akzeptierte Formate: PDF, JPG, PNG
            </DialogDescription>
          </DialogHeader>
          
          {user?.id && (
            <DocumentUpload
              userId={user.id}
              category={uploadCategory}
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
            />
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer */}
      {viewingDocument && (
        <DocumentViewer
          filePath={viewingDocument.file_path}
          fileName={viewingDocument.file_name}
          fileType={viewingDocument.file_type}
          isOpen={!!viewingDocument}
          onClose={() => setViewingDocument(null)}
        />
      )}
    </>
  );
}