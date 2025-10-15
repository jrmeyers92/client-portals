import { getOrganization } from "@/lib/data/getOrganization";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const orgaization = await getOrganization();

  console.log(orgaization);

  return <div>page</div>;
};

export default page;
