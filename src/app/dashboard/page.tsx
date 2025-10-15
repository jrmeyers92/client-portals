import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@clerk/nextjs/server";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Fetch clients from Supabase

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Clients</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Create Client Card */}
        <Link href="/clients/new">
          <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer h-full flex items-center justify-center min-h-[200px]">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Plus className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-lg font-semibold text-gray-700">
                Create Client
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default page;
