// types/organization.ts
export interface Organization {
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

// You can also export the union types for reuse
export type SubscriptionTier = "trial" | "starter" | "professional" | "agency";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "paused";
