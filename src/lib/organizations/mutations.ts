"use server";

import { SupabaseClient } from "@supabase/supabase-js";

export type CreateOrganizationInput = {
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  owner_clerk_id: string;
  owner_email: string;
  owner_name: string | null;
  email_from_name: string;
};

export async function createOrganization(
  supabase: SupabaseClient,
  data: CreateOrganizationInput
) {
  // Calculate trial end date (14 days from now)
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const dbData = {
    ...data,
    subscription_tier: "trial" as const,
    subscription_status: "trialing" as const,
    trial_ends_at: trialEndsAt.toISOString(),
    storage_used_bytes: 0,
    storage_limit_bytes: 10737418240, // 10GB for trial
    onboarding_completed: true,
    onboarding_step: 1,
  };

  const { data: newOrg, error } = await supabase
    .from("portals_organizations")
    .insert(dbData)
    .select()
    .single();

  if (error) throw error;
  return newOrg;
}

export async function updateOrganization(
  supabase: SupabaseClient,
  organizationId: string,
  updates: Partial<CreateOrganizationInput>
) {
  const { data, error } = await supabase
    .from("portals_organizations")
    .update(updates)
    .eq("id", organizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrganization(
  supabase: SupabaseClient,
  organizationId: string
) {
  const { error } = await supabase
    .from("portals_organizations")
    .delete()
    .eq("id", organizationId);

  if (error) throw error;
}
