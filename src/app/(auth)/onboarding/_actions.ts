"use server";

import {
  organizationOnboardingFormSchema,
  OrganizationOnboardingValues,
} from "@/schemas/organizationSchema";
import { Roles } from "@/types/clerk";
import {
  OrganizationOnboardingResponse,
  RoleSelectionResponse,
} from "@/types/serverActions";
import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/utils/validation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

// Define return type for the upload function
type UploadResult = {
  success: boolean;
  error: string | null;
  path: string | null;
};

// File validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Helper function to validate file
function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${ALLOWED_FILE_TYPES.join(", ")}`,
    };
  }

  return { valid: true };
}

// Helper function to upload a single file
async function uploadFile(
  supabase: SupabaseClient,
  file: File,
  userId: string,
  folder: string
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
    .from("client-portals")
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
    .from("client-portals")
    .getPublicUrl(filePath);

  return { success: true, error: null, path: urlData.publicUrl };
}

// Helper function to clean up uploaded files
async function cleanupFiles(supabase: SupabaseClient, filePaths: string[]) {
  for (const path of filePaths) {
    try {
      // Extract the file path from the public URL
      const urlParts = path.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const folder = urlParts[urlParts.length - 2];
      const filePath = `${folder}/${fileName}`;

      await supabase.storage.from("client-portals").remove([filePath]);
    } catch (error) {
      console.error("Error cleaning up file:", path, error);
    }
  }
}

export async function completeOrganizationOnboarding(
  organizationData: OrganizationOnboardingValues
): Promise<OrganizationOnboardingResponse> {
  const uploadedFiles: string[] = [];

  try {
    // Validate form data with the form schema
    try {
      organizationOnboardingFormSchema.parse(organizationData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return createErrorResponse(
          errorMessages.VALIDATION_FAILED,
          validationError.errors
        );
      }
      throw validationError;
    }

    const { userId } = await auth();

    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    const supabase = await createAdminClient();

    // Check if organization already exists for this user
    const { data: existingOrg } = await supabase
      .from("portals_organizations")
      .select("id")
      .eq("owner_clerk_id", userId)
      .single();

    if (existingOrg) {
      return {
        success: false,
        error: "Organization already exists for this user",
      };
    }

    // Check if slug is already taken
    const { data: existingSlug } = await supabase
      .from("portals_organizations")
      .select("id")
      .eq("slug", organizationData.slug)
      .single();

    if (existingSlug) {
      return {
        success: false,
        error: "This portal URL is already taken. Please choose another.",
      };
    }

    let logoUrl: string | null = null;

    // Handle logo upload if provided
    if (organizationData.logoImage) {
      const logoUpload = await uploadFile(
        supabase,
        organizationData.logoImage,
        userId,
        "organization-logos"
      );
      if (!logoUpload.success) {
        return {
          success: false,
          error: logoUpload.error || "Logo upload failed",
        };
      }
      if (logoUpload.path) {
        logoUrl = logoUpload.path;
        uploadedFiles.push(logoUrl);
      }
    }

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Prepare database object
    const dbData = {
      name: organizationData.organizationName,
      slug: organizationData.slug,
      logo_url: logoUrl,
      primary_color: organizationData.primaryColor,
      secondary_color: organizationData.secondaryColor,
      owner_clerk_id: userId,
      owner_email: organizationData.ownerEmail,
      owner_name: organizationData.ownerName || null,
      email_from_name:
        organizationData.emailFromName || organizationData.organizationName,
      subscription_tier: "trial",
      subscription_status: "trialing",
      trial_ends_at: trialEndsAt.toISOString(),
      storage_used_bytes: 0,
      storage_limit_bytes: 10737418240, // 10GB for trial
      onboarding_completed: true,
      onboarding_step: 1,
    };

    // Insert organization data into database
    const { data: newOrg, error } = await supabase
      .from("portals_organizations")
      .insert(dbData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      // Clean up uploaded files on database error
      await cleanupFiles(supabase, uploadedFiles);
      return {
        success: false,
        error: "Failed to create organization in database",
      };
    }

    // Update user metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "organizationOwner",
        onboardingComplete: true,
        organizationId: newOrg.id,
      },
    });

    return createSuccessResponse(
      "Organization onboarding completed successfully",
      {
        organizationId: newOrg.id,
        slug: newOrg.slug,
      }
    );
  } catch (error) {
    console.error("Error completing onboarding:", error);
    // Clean up uploaded files on any error
    const supabase = await createClient();
    await cleanupFiles(supabase, uploadedFiles);
    return { success: false, error: "Failed to complete onboarding" };
  }
}

export async function setRole(
  formData: FormData
): Promise<RoleSelectionResponse> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    const role = formData.get("role") as Roles;

    if (!role || (role !== "user" && role !== "organizationOwner")) {
      return { success: false, error: "Invalid role" };
    }

    const client = await clerkClient();

    const updateOnboarding = role === "user" ? true : false;

    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role,
        onboardingComplete: updateOnboarding,
      },
    });

    return createSuccessResponse("Role set successfully", { role });
  } catch (error) {
    console.error("Error setting role:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
