export type Roles = "admin" | "businessOwner" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
      role?: Roles;
    };
  }
}
