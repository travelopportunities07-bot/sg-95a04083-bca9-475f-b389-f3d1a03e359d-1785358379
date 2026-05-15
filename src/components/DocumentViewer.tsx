import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ZoomIn, ZoomOut, Maximize, X, Loader2 } from "lucide-react";
import { getDocumentUrl, downloadDocument } from "@/services/documentService";

interface DocumentViewerProps {
  filePath: string;
  fileName: string;
  fileType: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DocumentViewer({ filePath, fileName, fileType, isOpen, onClose }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (isOpen && filePath) {
      loadDocument();
    }
  }, [isOpen, filePath]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);

    const { url: documentUrl, error: urlError } = await getDocumentUrl(filePath);

    if (urlError) {
      setError(urlError.message);
      setLoading(false);
      return;
    }

    setUrl(documentUrl);
    setLoading(false);
  };

  const handleDownload = async () => {
    const { error } = await downloadDocument(filePath, fileName);
    if (error) {
      setError(error.message);
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const isPdf = fileType.includes("pdf");
  const isImage = fileType.includes("image");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] bg-[#0f1419] border-[rgba(16,185,129,0.3)] p-0">
        <DialogHeader className="px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[#f0f4f8]">{fileName}</DialogTitle>
            <div className="flex items-center gap-2">
              {isImage && (
                <>
                  <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} className="text-[#8fa3b3] hover:text-[#f0f4f8]">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-[#8fa3b3] min-w-[50px] text-center">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} className="text-[#8fa3b3] hover:text-[#f0f4f8]">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-[#8fa3b3] hover:text-[#f0f4f8]">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </>
              )}
              <Button onClick={handleDownload} size="sm" className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white">
                <Download className="w-4 h-4 mr-2" />
                Herunterladen
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-[#8fa3b3] hover:text-[#f0f4f8]">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 text-[#34d399] animate-spin" />
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-[#ef4444] mb-2">Fehler beim Laden des Dokuments</p>
                <p className="text-sm text-[#8fa3b3]">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && url && (
            <>
              {isPdf && (
                <iframe
                  src={url}
                  className="w-full h-full min-h-[70vh] rounded-lg"
                  title={fileName}
                />
              )}

              {isImage && (
                <div className="flex items-center justify-center">
                  <img
                    src={url}
                    alt={fileName}
                    className="max-w-full h-auto rounded-lg"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}