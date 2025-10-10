"use client";

import { setRole } from "@/app/(auth)/onboarding/_actions";
import { useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const RoleSelectionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useSession();
  const router = useRouter();

  const handleSubmit = async (role: "user" | "organizationOwner") => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("role", role);

    const userRole = await setRole(formData);
    await session?.reload();

    if (userRole.success) {
      if (userRole.data?.role == "organizationOwner") {
        router.push("/onboarding/organization"); // Added leading slash
      } else if (userRole.data?.role == "user") {
        router.push("/");
      }
    } else {
      toast.error("Role Selection failed", {
        description: userRole.error,
      });
    }

    setIsSubmitting(false);

    return;
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => handleSubmit("user")}
        disabled={isSubmitting}
        className="py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        I'm a customer wanting to access my documents
      </button>

      <button
        onClick={() => handleSubmit("organizationOwner")}
        disabled={isSubmitting}
        className="py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
      >
        I'm a organization owner wanting to sign up
      </button>
    </div>
  );
};

export default RoleSelectionForm;
