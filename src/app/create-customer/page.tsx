import CreateCustomerForm from "@/components/forms/CreateCustomerForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  return (
    <div>
      <CreateCustomerForm />
    </div>
  );
};

export default page;
