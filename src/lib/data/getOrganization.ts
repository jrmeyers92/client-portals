// lib/data/organization.ts
import { createClient } from "@/lib/supabase/clients/server";
import { Tables } from "@/types/database.types";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

// Get the full Organization type from your database
type Organization = Tables<"portals_organizations">;

// Create a type for just the columns you're selecting
type OrganizationBasic = Pick<
  Organization,
  "id" | "name" | "slug" | "logo_url" | "primary_color" | "secondary_color"
>;

export const getOrganization = cache(
  async (): Promise<OrganizationBasic | null> => {
    const { userId } = await auth();
    if (!userId) return null;

    const supabase = await createClient();

    const { data: organization, error } = await supabase
      .from("portals_organizations")
      .select("id, name, slug, logo_url, primary_color, secondary_color")
      .eq("owner_clerk_id", userId)
      .single();

    if (error) {
      console.error("Error fetching organization:", error);
      return null;
    }

    return organization;
  }
);
