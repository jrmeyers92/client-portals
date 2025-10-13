"use server";

import { Roles } from "@/types/clerk";
import { auth, clerkClient } from "@clerk/nextjs/server";

// ========================================
// READ Operations (from session claims)
// ========================================

export async function checkRole(role: Roles): Promise<boolean> {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.onboardingComplete === true;
}

export async function getUserRole(): Promise<Roles | undefined> {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role as Roles | undefined;
}

export async function getOrganizationId(): Promise<string | undefined> {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.organizationId as string | undefined;
}

export async function getUserMetadata() {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata;
}

// ========================================
// WRITE Operations (updating user metadata)
// ========================================

export async function updateUserRole(userId: string, role: Roles) {
  const client = await clerkClient();

  const updateOnboarding = role === "user";

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role,
      onboardingComplete: updateOnboarding,
    },
  });
}

export async function completeOrganizationOwnerOnboarding(
  userId: string,
  organizationId: string
) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      role: "organizationOwner" as Roles,
      onboardingComplete: true,
      organizationId,
    },
  });
}

export async function updateOnboardingStatus(
  userId: string,
  completed: boolean
) {
  const client = await clerkClient();

  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      onboardingComplete: completed,
    },
  });
}

// Helper for getting full user data (less common, hits Clerk API)
export async function getFullUserData(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user;
}
