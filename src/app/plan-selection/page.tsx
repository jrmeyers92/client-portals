import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PricingTable } from "@clerk/nextjs";
import Link from "next/link";
export default function PricingPage() {
  return (
    <div className="container mx-auto my-12">
      <Link
        className={cn(buttonVariants({ size: "lg" }), "my-4 ")}
        href="/org-dashboard"
      >
        Continue to Dashboard
      </Link>
      <PricingTable newSubscriptionRedirectUrl="/dashboard" />
    </div>
  );
}
