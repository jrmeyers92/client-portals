import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  return <div>page</div>;
};

export default page;
