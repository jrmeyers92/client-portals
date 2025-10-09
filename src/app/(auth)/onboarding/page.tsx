import OnboardingForm from "@/components/forms/OnboardingForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await auth();

  if (!user) {
    redirect("/sign-in");
  }

  const onboardingComplete = user.sessionClaims?.metadata.onboardingComplete;

  if (onboardingComplete === true) {
    redirect("/business-dashboard");
  }

  return (
    <div>
      <OnboardingForm />
    </div>
  );
};

export default page;
