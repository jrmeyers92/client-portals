import { z } from "zod";

export default interface Business {
  id: string;
  business_name: string;
  business_category: string;
  business_description?: string;
  business_email?: string;
  business_phone?: string;
  business_website?: string;
  business_address?: string;
  business_city?: string;
  business_state?: string;
  business_zip?: string;
  logo_url?: string;
  banner_image_url?: string;
  gallery_images?: string;
  average_rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_verified?: boolean;
  view_count?: number;
}

// Schema for social media links
const socialMediaSchema = z.object({
  platform: z.string().min(1, "Platform is required"),
  url: z.string().url("Must be a valid URL"),
});

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
export const businessOnboardingFormSchema = z.object({
  clerkId: z.string(),
  businessName: z.string().min(2, "Business name is required"),
  businessCategory: z.string().min(1, "Please select a category"),
  businessAddress: z.string().min(3, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessZip: z.string().min(5, "ZIP code is required"),
  businessPhone: z.string().min(10, "Valid phone number is required"),
  businessEmail: z.string().email("Must be a valid email address"),
  businessWebsite: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  businessDescription: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  socialMedia: z
    .array(socialMediaSchema)
    .min(1, "At least one social media link is required"),
  // For file inputs, we keep the File type for client-side validation
  logoImage: z.instanceof(File).optional().nullable(),
  bannerImage: z.instanceof(File).optional().nullable(),
  galleryImages: z.array(z.instanceof(File)).optional().nullable(),
});

// Database schema (what gets stored after file upload)
export const businessOnboardingDBSchema = z.object({
  clerkId: z.string(),
  businessName: z.string().min(2, "Business name is required"),
  businessCategory: z.string().min(1, "Please select a category"),
  businessAddress: z.string().min(3, "Address is required"),
  businessCity: z.string().min(2, "City is required"),
  businessState: z.string().min(2, "State is required"),
  businessZip: z.string().min(5, "ZIP code is required"),
  businessPhone: z.string().min(10, "Valid phone number is required"),
  businessEmail: z.string().email("Must be a valid email address"),
  businessWebsite: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  businessDescription: z
    .string()
    .min(20, "Description must be at least 20 characters"),
  socialMedia: z
    .array(socialMediaSchema)
    .min(1, "At least one social media link is required"),
  // For database storage, we use URLs instead of File objects
  logoImageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  bannerImageUrl: z.string().url("Must be a valid URL").optional().nullable(),
  galleryImageUrls: z
    .array(z.string().url("Must be a valid URL"))
    .max(10, "Maximum 10 gallery images allowed")
    .optional()
    .nullable(),
});

// Type for the form input values (keeping original name for backward compatibility)
export type BusinessOnboardingValues = z.infer<
  typeof businessOnboardingFormSchema
>;

// Additional types for clarity
export type BusinessOnboardingInputValues = z.infer<
  typeof businessOnboardingFormSchema
>;

// Type for the database values
export type BusinessOnboardingDBValues = z.infer<
  typeof businessOnboardingDBSchema
>;
