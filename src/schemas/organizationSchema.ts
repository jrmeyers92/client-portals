import { z } from "zod";

export default interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  owner_clerk_id: string;
  owner_email: string;
  owner_name?: string;
  stripe_customer_id?: string;
  subscription_tier: "trial" | "starter" | "professional" | "agency";
  subscription_status:
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "paused";
  trial_ends_at?: string;
  custom_domain?: string;
  email_from_name?: string;
  storage_used_bytes: number;
  storage_limit_bytes: number;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: string;
  updated_at: string;
}

// For client-side file validation (not part of the Zod schema)
export const validateImageFile = (file: File | null | undefined) => {
  if (!file) return true;
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) return false;
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
};

// Form input schema (includes File objects for client-side handling)
export const organizationOnboardingFormSchema = z.object({
  clerkId: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  ownerEmail: z.string().email("Must be a valid email address"),
  ownerName: z.string().min(2, "Owner name is required").optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#6366f1"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#8b5cf6"),
  emailFromName: z.string().min(2, "Email from name is required").optional(),
  // For file inputs, we keep the File type for client-side validation
  logoImage: z.instanceof(File).optional().nullable(),
});

// Database schema (what gets stored after file upload)
export const organizationOnboardingDBSchema = z.object({
  clerkId: z.string(),
  organizationName: z.string().min(2, "Organization name is required"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  ownerEmail: z.string().email("Must be a valid email address"),
  ownerName: z.string().min(2, "Owner name is required").optional(),
  primaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#6366f1"),
  secondaryColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color")
    .default("#8b5cf6"),
  emailFromName: z.string().min(2, "Email from name is required").optional(),
  // For database storage, we use URLs instead of File objects
  logoImageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  subscriptionTier: z
    .enum(["trial", "starter", "professional", "agency"])
    .default("trial"),
  subscriptionStatus: z
    .enum(["trialing", "active", "past_due", "canceled", "paused"])
    .default("trialing"),
  trialEndsAt: z.string().datetime().optional().nullable(),
  customDomain: z.string().url("Must be a valid domain").optional().nullable(),
  storageUsedBytes: z.number().default(0),
  storageLimitBytes: z.number().default(10737418240), // 10GB
  onboardingCompleted: z.boolean().default(false),
  onboardingStep: z.number().default(0),
});

// Type for the form input values
// Type for the form input values
export type OrganizationOnboardingValues = z.infer<
  typeof organizationOnboardingFormSchema
>;

// Additional types for clarity
export type OrganizationOnboardingInputValues = z.infer<
  typeof organizationOnboardingFormSchema
>;

// Type for the database values
export type OrganizationOnboardingDBValues = z.infer<
  typeof organizationOnboardingDBSchema
>;

// Utility function to generate slug from organization name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .slice(0, 50); // Limit to 50 characters
};

// Utility function to validate custom domain format
export const isValidCustomDomain = (domain: string): boolean => {
  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
};
