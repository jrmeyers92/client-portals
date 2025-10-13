"use server";

import { SupabaseClient } from "@supabase/supabase-js";

export async function getOrganizationByOwner(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("portals_organizations")
    .select("id")
    .eq("owner_clerk_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = not found, which is ok
    throw error;
  }

  return data;
}

export async function checkSlugAvailability(
  supabase: SupabaseClient,
  slug: string
): Promise<boolean> {
  const { data } = await supabase
    .from("portals_organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  return !data; // Returns true if slug is available
}

export async function getOrganizationById(
  supabase: SupabaseClient,
  organizationId: string
) {
  const { data, error } = await supabase
    .from("portals_organizations")
    .select("*")
    .eq("id", organizationId)
    .single();

  if (error) throw error;
  return data;
}
