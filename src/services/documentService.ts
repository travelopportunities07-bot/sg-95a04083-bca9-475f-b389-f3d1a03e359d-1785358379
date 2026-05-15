import { supabase } from "@/integrations/supabase/client";

export interface Document {
  id: string;
  user_id: string;
  task_id?: string;
  category: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  status: "pending" | "approved" | "rejected";
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UploadProgress {
  progress: number;
  status: "uploading" | "processing" | "complete" | "error";
  message?: string;
}

/**
 * Upload a document to Supabase Storage
 */
export async function uploadDocument(
  file: File,
  userId: string,
  category: string,
  taskId?: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<{ data: Document | null; error: Error | null }> {
  try {
    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Type de fichier non autorisé. Formats acceptés : PDF, JPG, PNG");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("Fichier trop volumineux. Taille maximale : 10 MB");
    }

    onProgress?.({ progress: 10, status: "uploading", message: "Début de l'upload..." });

    // Generate unique file path
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${userId}/${category}/${fileName}`;

    onProgress?.({ progress: 30, status: "uploading", message: "Upload en cours..." });

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    onProgress?.({ progress: 70, status: "processing", message: "Enregistrement..." });

    // Save document metadata to database
    const { data: docData, error: docError } = await supabase
      .from("documents")
      .insert({
        user_id: userId,
        task_id: taskId,
        category,
        file_name: file.name,
        file_path: uploadData.path,
        file_type: file.type,
        file_size: file.size,
        status: "pending",
      })
      .select()
      .single();

    if (docError) throw docError;

    onProgress?.({ progress: 100, status: "complete", message: "Dokument erfolgreich hochgeladen." });

    return { data: docData, error: null };
  } catch (error: any) {
    onProgress?.({ progress: 0, status: "error", message: error.message });
    return { data: null, error };
  }
}

/**
 * Get document download URL
 */
export async function getDocumentUrl(filePath: string): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage.from("documents").createSignedUrl(filePath, 3600); // 1 hour

    if (error) throw error;

    return { url: data.signedUrl, error: null };
  } catch (error: any) {
    return { url: null, error };
  }
}

/**
 * Download a document
 */
export async function downloadDocument(
  filePath: string,
  fileName: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data, error } = await supabase.storage.from("documents").download(filePath);

    if (error) throw error;

    // Create download link
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(id: string, filePath: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage.from("documents").remove([filePath]);

    if (storageError) throw storageError;

    // Delete from database
    const { error: dbError } = await supabase.from("documents").delete().eq("id", id);

    if (dbError) throw dbError;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Get user documents
 */
export async function getUserDocuments(userId: string): Promise<{ data: Document[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Get documents by category
 */
export async function getDocumentsByCategory(
  userId: string,
  category: string
): Promise<{ data: Document[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", userId)
      .eq("category", category)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Update document status (HR Manager only)
 */
export async function updateDocumentStatus(
  documentId: string,
  status: "approved" | "rejected",
  reviewerId: string,
  rejectionReason?: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { error } = await supabase
      .from("documents")
      .update({
        status,
        reviewed_by: reviewerId,
        reviewed_at: new Date().toISOString(),
        rejection_reason: rejectionReason || null,
      })
      .eq("id", documentId);

    if (error) throw error;

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error };
  }
}

/**
 * Get team documents (HR Manager)
 */
export async function getTeamDocuments(companyId: string): Promise<{ data: Document[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from("documents")
      .select(
        `
        *,
        profiles!documents_user_id_fkey(first_name, last_name, email)
      `
      )
      .eq("profiles.company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data || [], error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Get file icon based on type
 */
export function getFileIcon(fileType: string): string {
  if (fileType.includes("pdf")) return "📄";
  if (fileType.includes("image")) return "🖼️";
  return "📎";
}