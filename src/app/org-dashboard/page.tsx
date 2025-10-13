import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const page = () => {
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
