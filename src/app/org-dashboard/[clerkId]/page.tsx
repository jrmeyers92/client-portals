import { buttonVariants } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-up");
  }

  return (
    <section className="container mx-auto my-12">
      <div className="flex gap-4">
        <Link href="/create-customer" className={buttonVariants()}>
          Add a cusomter
        </Link>
        <Link href="/create-project" className={buttonVariants()}>
          Create a Project
        </Link>
      </div>
    </section>
  );
};

export default page;
