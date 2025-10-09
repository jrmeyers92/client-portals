import BusinessOnboardingForm from "@/components/forms/BusinessOnboardingForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BusinessOnboardingPage() {
  const user = await auth();

  if (!user) {
    redirect("/sign-in");
  }
  const role = user.sessionClaims?.metadata.role;
  const onboardingComplete = user.sessionClaims?.metadata.onboardingComplete;

  // Check if user has the correct role
  if (role !== "businessOwner") {
    redirect("/onboarding/role-selection");
  }

  // Check if user has already completed onboarding
  if (onboardingComplete === true) {
    redirect("/business-dashboard");
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Register Your Business</h1>
      <p className="mb-4">
        Provide details about your business to get started.
      </p>
      <BusinessOnboardingForm />
    </div>
  );
}
