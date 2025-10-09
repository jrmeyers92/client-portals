import { Roles } from "@/types/clerk";
import { auth } from "@clerk/nextjs/server";

export const checkRole = async (role: Roles) => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role === role;
};

export const hasCompletedOnboarding = async () => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.onboardingComplete === true;
};

export const getUserRole = async (): Promise<Roles | undefined> => {
  const { sessionClaims } = await auth();
  return sessionClaims?.metadata.role as Roles | undefined;
};
