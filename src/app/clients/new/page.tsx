import { CreateClientForm } from "@/components/forms/CreateClientForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Get the organization ID for this user
  const organizationId = "your-org-id"; // Fetch from your database

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Client</h1>
        <p className="text-gray-600 mt-2">
          Add a new client to your organization
        </p>
      </div>

      <CreateClientForm organizationId={organizationId} userId={userId} />
    </div>
  );
};

export default page;
