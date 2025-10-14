"use server";

import {
  completeOrganizationOwnerOnboarding,
  updateUserRole,
} from "@/lib/clerk/metadata";

import {
  checkSlugAvailability,
  getOrganizationByOwner,
} from "@/lib/organizations/queries";

import { createOrganization } from "@/lib/organizations/mutations";
import { createAdminClient } from "@/lib/supabase/clients/admin";
import { createClient } from "@/lib/supabase/clients/server";
import { cleanupFiles, uploadFile } from "@/lib/supabase/storage";
import {
  createErrorResponse,
  createSuccessResponse,
  errorMessages,
} from "@/lib/validation";
import {
  organizationOnboardingFormSchema,
  OrganizationOnboardingValues,
} from "@/schemas/organizationSchema";
import { Roles } from "@/types/clerk";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";

// Define return types at the top
type OrganizationOnboardingResponse =
  | { success: false; error: string; details?: unknown }
  | {
      success: true;
      message: string;
      data?: { organizationId: string; slug: string };
    };

type RoleSelectionResponse =
  | { success: false; error: string; details?: unknown }
  | { success: true; message: string; data?: { role: string } };

export async function completeOrganizationOnboarding(
  organizationData: OrganizationOnboardingValues
): Promise<OrganizationOnboardingResponse> {
  const uploadedFiles: string[] = [];

  try {
    // 1. Validate form data
    try {
      organizationOnboardingFormSchema.parse(organizationData);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return createErrorResponse(
          errorMessages.VALIDATION_FAILED,
          validationError.issues
        );
      }
      throw validationError;
    }

    // 2. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    const supabase = await createAdminClient();

    // 3. Check if organization already exists
    const existingOrg = await getOrganizationByOwner(supabase, userId);
    if (existingOrg) {
      return createErrorResponse("Organization already exists for this user");
    }

    // 4. Check slug availability
    const isSlugAvailable = await checkSlugAvailability(
      supabase,
      organizationData.slug
    );
    if (!isSlugAvailable) {
      return createErrorResponse(
        "This portal URL is already taken. Please choose another."
      );
    }

    // 5. Handle logo upload if provided
    let logoUrl: string | null = null;
    if (organizationData.logoImage) {
      const logoUpload = await uploadFile(
        supabase,
        organizationData.logoImage,
        userId,
        "organization-logos"
      );
      if (!logoUpload.success) {
        return createErrorResponse(logoUpload.error || "Logo upload failed");
      }
      if (logoUpload.path) {
        logoUrl = logoUpload.path;
        uploadedFiles.push(logoUrl);
      }
    }

    // 6. Create organization
    let newOrg;
    try {
      newOrg = await createOrganization(supabase, {
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
      });
    } catch (error) {
      console.error("Create organization error:", error);
      await cleanupFiles(supabase, uploadedFiles);
      return createErrorResponse("Failed to create organization in database");
    }

    // 7. Update Clerk user metadata
    try {
      await completeOrganizationOwnerOnboarding(userId, newOrg.id);
    } catch (error) {
      console.error("Failed to update user metadata:", error);
      // Organization was created but metadata update failed
      // You might want to handle this differently
    }

    return createSuccessResponse(
      "Organization onboarding completed successfully",
      {
        organizationId: newOrg.id,
        slug: newOrg.slug,
      }
    );
  } catch (error) {
    console.error("Error completing onboarding:", error);
    const supabase = await createClient();
    await cleanupFiles(supabase, uploadedFiles);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}

export async function setRole(
  formData: FormData
): Promise<RoleSelectionResponse> {
  try {
    // 1. Check authentication
    const { userId } = await auth();
    if (!userId) {
      return createErrorResponse(errorMessages.AUTHENTICATION_REQUIRED);
    }

    // 2. Validate role
    const role = formData.get("role") as Roles;
    if (!role || (role !== "user" && role !== "organizationOwner")) {
      return createErrorResponse("Invalid role");
    }

    // 3. Update user metadata
    await updateUserRole(userId, role);

    return createSuccessResponse("Role set successfully", { role });
  } catch (error) {
    console.error("Error setting role:", error);
    return createErrorResponse(errorMessages.SERVER_ERROR);
  }
}
