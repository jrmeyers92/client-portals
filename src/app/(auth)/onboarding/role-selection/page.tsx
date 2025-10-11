import RoleSelectionForm from "@/components/forms/RoleSelectionForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await auth();
  // If user is not authenticated, redirect to sign-in
  if (!user) redirect("/sign-in");

  const role = user.sessionClaims?.metadata.role;
  if (role == "user" && user.sessionClaims?.metadata.onboardingComplete) {
    redirect("/");
  } else if (role == "organizationOwner") {
    redirect("/onboarding/business");
  } else if (role == "admin") {
    redirect("/admin");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">
        Welcome to St. Louis Directory!
      </h1>
      <p className="mb-4">Please select how you want to use our platform:</p>
      <RoleSelectionForm />
    </div>
  );
};

export default page;
