import { z } from "zod";

export default interface ClientUser {
  id: string;
  client_id: string; // Foreign key to Client
  organization_id: string; // For RLS policies - the agency that owns this

  // User details
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  job_title?: string;

  // Portal access
  role: "admin" | "member" | "viewer"; // Permissions within their client's portal
  portal_access_enabled: boolean;
  portal_last_accessed_at?: string;

  // Invitation flow
  invite_sent_at?: string;
  invite_accepted_at?: string;
  invite_token?: string;

  // Auth integration (Clerk or similar)
  auth_user_id?: string; // External auth provider ID

  // Notification preferences
  email_notifications_enabled: boolean;
  notification_preferences?: {
    project_updates: boolean;
    new_files: boolean;
    comments: boolean;
    mentions: boolean;
  };

  // Tracking
  created_by: string; // Agency user who created this portal user
  updated_by?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Client-side file validation for avatar
export const validateAvatarFile = (file: File | null | undefined) => {
  if (!file) return true;
  // Check file size (1MB limit for avatars)
  if (file.size > 1 * 1024 * 1024) return false;
  // Check file type
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  return validTypes.includes(file.type);
};

// Form input schema
export const clientUserFormSchema = z.object({
  clientId: z.string().uuid("Invalid client ID"),
  organizationId: z.string().uuid("Invalid organization ID"),
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Must be a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Must be a valid phone number")
    .optional()
    .nullable(),
  jobTitle: z.string().max(100).optional(),
  role: z.enum(["admin", "member", "viewer"]).default("member"),
  portalAccessEnabled: z.boolean().default(true),

  // Notification preferences
  emailNotificationsEnabled: z.boolean().default(true),
  notificationPreferences: z
    .object({
      projectUpdates: z.boolean().default(true),
      newFiles: z.boolean().default(true),
      comments: z.boolean().default(true),
      mentions: z.boolean().default(true),
    })
    .optional(),

  avatarImage: z.instanceof(File).optional().nullable(),
  createdBy: z.string(), // Agency user ID
});

// Database schema
export const clientUserDBSchema = z.object({
  clientId: z.string().uuid("Invalid client ID"),
  organizationId: z.string().uuid("Invalid organization ID"),
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Must be a valid email address"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/, "Must be a valid phone number")
    .optional()
    .nullable(),
  jobTitle: z.string().max(100).optional(),
  avatarUrl: z.string().url("Must be a valid URL").optional().nullable(),
  role: z.enum(["admin", "member", "viewer"]).default("member"),
  portalAccessEnabled: z.boolean().default(true),
  portalLastAccessedAt: z.string().datetime().optional().nullable(),
  inviteSentAt: z.string().datetime().optional().nullable(),
  inviteAcceptedAt: z.string().datetime().optional().nullable(),
  inviteToken: z.string().optional().nullable(),
  authUserId: z.string().optional().nullable(),
  emailNotificationsEnabled: z.boolean().default(true),
  notificationPreferences: z
    .object({
      projectUpdates: z.boolean().default(true),
      newFiles: z.boolean().default(true),
      comments: z.boolean().default(true),
      mentions: z.boolean().default(true),
    })
    .optional(),
  createdBy: z.string(),
  updatedBy: z.string().optional(),
  lastLoginAt: z.string().datetime().optional().nullable(),
});

// Type exports
export type ClientUserFormValues = z.infer<typeof clientUserFormSchema>;
export type ClientUserDBValues = z.infer<typeof clientUserDBSchema>;

// Role descriptions for UI
export const CLIENT_USER_ROLES = {
  admin: {
    label: "Admin",
    description: "Can manage projects, invite users, and access all content",
    color: "purple",
  },
  member: {
    label: "Member",
    description: "Can view and comment on projects they're assigned to",
    color: "blue",
  },
  viewer: {
    label: "Viewer",
    description: "Can only view projects, cannot comment or upload",
    color: "gray",
  },
} as const;

// Utility function to generate initials from name
export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Utility to check if invite is expired
export const isInviteExpired = (inviteSentAt?: string): boolean => {
  if (!inviteSentAt) return false;
  const sentDate = new Date(inviteSentAt);
  const expiryDate = new Date(sentDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
  return new Date() > expiryDate;
};

// Utility to check if user can access portal
export const canAccessPortal = (user: ClientUser): boolean => {
  return (
    user.portal_access_enabled &&
    !!user.invite_accepted_at &&
    !!user.auth_user_id
  );
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};
