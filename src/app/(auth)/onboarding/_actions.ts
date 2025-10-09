"use server";

import { getCategorySlug } from "@/data/businessCategory";
import {
  businessOnboardingFormSchema,
  BusinessOnboardingValues,
} from "@/schemas/businessSchema";
import { Roles } from "@/types/globals";
import {
  BusinessOnboardingResponse,
  RoleSelectionResponse,
} from "@/types/serverActions";
import { createClient } from "@/utils/supabase/create-client/server";
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
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_GALLERY_IMAGES = 10;

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
    .from("stl-directory")
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
    .from("stl-directory")
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

      await supabase.storage.from("stl-directory").remove([filePath]);
    } catch (error) {
      console.error("Error cleaning up file:", path, error);
    }
  }
}

export async function completeBusinessOnboarding(
  businessData: BusinessOnboardingValues
): Promise<BusinessOnboardingResponse> {
  const uploadedFiles: string[] = [];

  try {
    // Validate form data with the form schema
    try {
      businessOnboardingFormSchema.parse(businessData);
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

    // Additional validation
    if (
      businessData.galleryImages &&
      businessData.galleryImages.length > MAX_GALLERY_IMAGES
    ) {
      return {
        success: false,
        error: `Maximum ${MAX_GALLERY_IMAGES} gallery images allowed`,
      };
    }

    const supabase = await createClient();

    // Check if business already exists for this user
    const { data: existingBusiness } = await supabase
      .from("stl_directory_businesses")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (existingBusiness) {
      return { success: false, error: "Business already exists for this user" };
    }

    let logoUrl: string | null = null;
    let bannerImageUrl: string | null = null;
    const galleryImageUrls: string[] = [];

    // Handle logo upload if provided
    if (businessData.logoImage) {
      const logoUpload = await uploadFile(
        supabase,
        businessData.logoImage,
        userId,
        "business-profiles"
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

    // Handle banner image upload if provided
    if (businessData.bannerImage) {
      const bannerUpload = await uploadFile(
        supabase,
        businessData.bannerImage,
        userId,
        "business-banners"
      );
      if (!bannerUpload.success) {
        // Clean up any previously uploaded files
        await cleanupFiles(supabase, uploadedFiles);
        return {
          success: false,
          error: bannerUpload.error || "Banner upload failed",
        };
      }
      if (bannerUpload.path) {
        bannerImageUrl = bannerUpload.path;
        uploadedFiles.push(bannerImageUrl);
      }
    }

    // Handle gallery images upload if provided
    if (businessData.galleryImages && businessData.galleryImages.length > 0) {
      for (const image of businessData.galleryImages) {
        const galleryUpload = await uploadFile(
          supabase,
          image,
          userId,
          "business-galleries"
        );
        if (!galleryUpload.success) {
          // Clean up any previously uploaded files
          await cleanupFiles(supabase, uploadedFiles);
          return {
            success: false,
            error: galleryUpload.error || "Gallery upload failed",
          };
        }
        if (galleryUpload.path) {
          galleryImageUrls.push(galleryUpload.path);
          uploadedFiles.push(galleryUpload.path);
        }
      }
    }

    // Filter out empty social media entries
    const filteredSocialMedia = businessData.socialMedia.filter(
      (item) => item.platform && item.url
    );

    // Prepare database object - use consistent naming
    const dbData = {
      clerk_id: userId,
      business_name: businessData.businessName,
      business_category: businessData.businessCategory,
      business_description: businessData.businessDescription,
      business_email: businessData.businessEmail,
      business_phone: businessData.businessPhone,
      business_website: businessData.businessWebsite || null,
      business_address: businessData.businessAddress,
      business_city: businessData.businessCity,
      business_state: businessData.businessState,
      business_zip: businessData.businessZip,
      social_media: filteredSocialMedia,
      logo_url: logoUrl,
      banner_image_url: bannerImageUrl,
      business_category_slug: getCategorySlug(businessData.businessCategory),
      gallery_images: galleryImageUrls.length > 0 ? galleryImageUrls : null,
      is_active: true,
    };

    // Insert business data into database
    const { error } = await supabase.from("stl_directory_businesses").insert({
      clerk_id: dbData.clerk_id,
      business_name: dbData.business_name,
      business_category: dbData.business_category,
      business_description: dbData.business_description,
      business_email: dbData.business_email,
      business_phone: dbData.business_phone,
      business_website: dbData.business_website,
      business_address: dbData.business_address,
      business_city: dbData.business_city,
      business_state: dbData.business_state,
      business_zip: dbData.business_zip,
      social_media: JSON.stringify(dbData.social_media),
      logo_url: dbData.logo_url,
      banner_image_url: dbData.banner_image_url,
      business_category_slug: dbData.business_category_slug,
      gallery_images: dbData.gallery_images
        ? JSON.stringify(dbData.gallery_images)
        : null,
      is_active: dbData.is_active,
    });

    if (error) {
      console.error("Supabase error:", error);
      // Clean up uploaded files on database error
      await cleanupFiles(supabase, uploadedFiles);
      return { success: false, error: "Failed to create business in database" };
    }

    // Update user metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "businessOwner",
        onboardingComplete: true,
      },
    });

    return createSuccessResponse("Business onboarding completed successfully");
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

    if (!role || (role !== "user" && role !== "businessOwner")) {
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
