import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Define return type for the upload function
export type UploadResult = {
  success: boolean;
  error: string | null;
  path: string | null;
};

// Helper function to validate file
export function validateFile(
  file: File,
  maxFileSize: number = MAX_FILE_SIZE,
  allowedFileTypes: string[] = ALLOWED_FILE_TYPES // Fixed: lowercase 'string'
): { valid: boolean; error?: string } {
  if (file.size > maxFileSize) {
    // Fixed: use parameter instead of constant
    return {
      valid: false,
      error: `File size must be less than ${maxFileSize / (1024 * 1024)}MB`,
    };
  }

  if (!allowedFileTypes.includes(file.type)) {
    // Fixed: use parameter instead of constant
    return {
      valid: false,
      error: `File type must be one of: ${allowedFileTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

// Upload file to Supabase storage
export async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  userId: string,
  folder: string,
  bucketName: string = "client-portals" // Made bucket name configurable
): Promise<UploadResult> {
  // Validate file first
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error!, path: null };
  }

  // Generate a unique filename with original extension
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}-${uuidv4()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  // Upload the file to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("File upload error:", uploadError);
    return { success: false, error: "Failed to upload file", path: null };
  }

  // Get the public URL of the uploaded file
  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);

  return { success: true, error: null, path: urlData.publicUrl };
}

// Helper function to clean up uploaded files
export async function cleanupFiles(
  supabase: SupabaseClient,
  filePaths: string[],
  bucketName: string = "client-portals"
) {
  for (const path of filePaths) {
    try {
      // Extract the file path from the public URL
      const urlParts = path.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      await supabase.storage.from(bucketName).remove([filePath]);
    } catch (error) {
      console.error("Error cleaning up file:", path, error);
    }
  }
}
