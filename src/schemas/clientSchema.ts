import { z } from "zod";

export default interface Client {
  id: string;
  organization_id: string; // The agency that owns this client
  company_name: string;
  email: string; // Primary contact email
  phone?: string;
  website?: string;
  logo_url?: string;
  status: "active" | "inactive" | "archived";

  // Address information
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };

  // Metadata
  notes?: string;
  tags?: string[];
  custom_fields?: Record<
    string,
    string | number | boolean | null | string[] | number[]
  >;

  // Tracking
  created_by: string; // Agency user who created this client
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

// Client-side file validation for logo
export const validateLogoFile = (file: File | null | undefined) => {
  if (!file) return true;
  // Check file size (2MB limit for logos)
  if (file.size > 2 * 1024 * 1024) return false;
  // Check file type
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];
  return validTypes.includes(file.type);
};

// Form input schema
export const clientFormSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  companyName: z.string().min(2, "Company name is required").max(200),
  email: z.string().email("Must be a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Must be a valid phone number")
    .optional()
    .nullable(),
  website: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .nullable()
    .or(z.literal("")),
  status: z.enum(["active", "inactive", "archived"]).default("active"),

  // Address
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional()
    .nullable(),

  notes: z
    .string()
    .max(2000, "Notes must be less than 2000 characters")
    .optional(),
  tags: z.array(z.string().min(1).max(50)).max(20).optional(),
  customFields: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),

  logoImage: z.instanceof(File).optional().nullable(),
  createdBy: z.string(), // Agency user ID
});

// Database schema
export const clientDBSchema = z.object({
  organizationId: z.string().uuid("Invalid organization ID"),
  companyName: z.string().min(2, "Company name is required").max(200),
  email: z.string().email("Must be a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Must be a valid phone number")
    .optional()
    .nullable(),
  website: z.string().url("Must be a valid URL").optional().nullable(),
  logoUrl: z.string().url("Must be a valid URL").optional().nullable(),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      country: z.string().optional(),
    })
    .optional()
    .nullable(),
  notes: z.string().max(2000).optional(),
  tags: z.array(z.string()).optional(),
  customFields: z
    .record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean(), z.null()])
    )
    .optional(),
  createdBy: z.string(),
  updatedBy: z.string().optional(),
});

// Type exports
export type ClientFormValues = z.infer<typeof clientFormSchema>;
export type ClientDBValues = z.infer<typeof clientDBSchema>;

// Utility function to get initials from company name
export const getCompanyInitials = (companyName: string): string => {
  return companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Utility to get client status badge info
export const getClientStatusBadge = (status: Client["status"]) => {
  const badges = {
    active: { label: "Active", color: "green" },
    inactive: { label: "Inactive", color: "yellow" },
    archived: { label: "Archived", color: "gray" },
  };
  return badges[status];
};
