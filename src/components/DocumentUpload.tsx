import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, X, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { uploadDocument, UploadProgress } from "@/services/documentService";

interface DocumentUploadProps {
  userId: string;
  category: string;
  taskId?: string;
  onUploadComplete?: (documentId: string) => void;
  onUploadError?: (error: string) => void;
}

export function DocumentUpload({ userId, category, taskId, onUploadComplete, onUploadError }: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        onUploadError?.("Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        onUploadError?.("Fichier trop volumineux. Taille maximale : 10 MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress({ progress: 0, status: "uploading" });

    const { data, error } = await uploadDocument(selectedFile, userId, category, taskId, (prog) => {
      setProgress(prog);
    });

    setUploading(false);

    if (error) {
      onUploadError?.(error.message);
      setProgress(null);
      setSelectedFile(null);
    } else if (data) {
      onUploadComplete?.(data.id);
      setTimeout(() => {
        setProgress(null);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 2000);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      {/* File Input */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
          id={`file-upload-${category}`}
        />
        <label htmlFor={`file-upload-${category}`}>
          <Button
            type="button"
            variant="outline"
            disabled={uploading}
            className="cursor-pointer bg-[#1c242b] border-[rgba(16,185,129,0.3)] text-[#34d399] hover:bg-[#0f2d22] hover:text-[#10b981]"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Hochladen
          </Button>
        </label>

        {selectedFile && !uploading && (
          <>
            <span className="text-sm text-[#8fa3b3]">{selectedFile.name}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-[#ef4444] hover:text-[#dc2626] hover:bg-[#ef4444]/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Selected File Card */}
      {selectedFile && !progress && (
        <Card className="p-4 bg-[#1c242b] border-[rgba(16,185,129,0.3)]">
          <div className="flex items-start gap-3">
            <FileText className="w-8 h-8 text-[#34d399] flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f0f4f8] truncate">{selectedFile.name}</p>
              <p className="text-xs text-[#8fa3b3]">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type.split("/")[1].toUpperCase()}
              </p>
            </div>
            <Button onClick={handleUpload} disabled={uploading} className="bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#34d399] hover:to-[#10b981] text-white">
              <Upload className="w-4 h-4 mr-2" />
              Hochladen
            </Button>
          </div>
        </Card>
      )}

      {/* Upload Progress */}
      {progress && (
        <Card className="p-4 bg-[#1c242b] border-[rgba(16,185,129,0.3)]">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {progress.status === "complete" ? (
                  <CheckCircle className="w-5 h-5 text-[#22c55e]" />
                ) : progress.status === "error" ? (
                  <AlertCircle className="w-5 h-5 text-[#ef4444]" />
                ) : (
                  <Upload className="w-5 h-5 text-[#34d399] animate-pulse" />
                )}
                <span className="text-sm font-medium text-[#f0f4f8]">
                  {progress.status === "complete"
                    ? "Dokument erfolgreich hochgeladen."
                    : progress.status === "error"
                      ? "Fehler beim Hochladen"
                      : "Wird hochgeladen..."}
                </span>
              </div>
              <span className="text-sm text-[#8fa3b3]">{progress.progress}%</span>
            </div>

            <Progress value={progress.progress} className="h-2" />

            {progress.message && (
              <p className="text-xs text-[#8fa3b3]">{progress.message}</p>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}