export type Roles = "admin" | "organizationOwner" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: Roles;
    };
  }
}
