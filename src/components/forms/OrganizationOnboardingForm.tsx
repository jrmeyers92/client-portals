"use client";

import { completeOrganizationOnboarding } from "@/app/(auth)/onboarding/_actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  OrganizationOnboardingValues,
  generateSlug,
  organizationOnboardingFormSchema,
} from "@/schemas/organizationSchema";
import { resizeImage } from "@/utils/resizeImage";
import { useAuth, useSession } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function OrganizationOnboardingForm() {
  const { session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const [isPending, startTransition] = useTransition();

  // Image preview state
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Loading state for image processing
  const [logoLoading, setLogoLoading] = useState(false);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<OrganizationOnboardingValues>({
    resolver: zodResolver(organizationOnboardingFormSchema),
    defaultValues: {
      clerkId: userId || "",
      organizationName: "",
      slug: "",
      ownerEmail: "",
      ownerName: "",
      primaryColor: "#6366f1",
      secondaryColor: "#8b5cf6",
      emailFromName: "",
      logoImage: null,
    },
  });

  // Auto-generate slug from organization name
  const organizationName = form.watch("organizationName");
  useState(() => {
    if (organizationName && !form.formState.dirtyFields.slug) {
      form.setValue("slug", generateSlug(organizationName));
    }
  });

  // Handle logo image selection with preview and resizing
  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      form.setValue("logoImage", null);
      setLogoPreview(null);
      return;
    }

    setLogoLoading(true);

    try {
      // Resize the image
      const resizedFile = await resizeImage(file, "logo");

      // Create a preview URL from the resized file
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(resizedFile);

      // Update form value with resized file
      form.setValue("logoImage", resizedFile);

      toast.success("Logo processed successfully!");
    } catch (error) {
      console.error("Error resizing logo:", error);
      toast.error("Failed to process logo image. Please try again.");
    } finally {
      setLogoLoading(false);
    }
  };

  // Remove logo
  const removeLogo = () => {
    form.setValue("logoImage", null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function onSubmit(values: OrganizationOnboardingValues) {
    try {
      setIsSubmitting(true);

      // Use startTransition to prevent UI from freezing during submission
      startTransition(async () => {
        // Call the server action to complete onboarding
        const result = await completeOrganizationOnboarding(values);

        if (result?.success) {
          // Show success toast
          toast.success("Organization created!", {
            description: "Your client portal has been successfully set up.",
          });

          // Force a hard navigation to refresh the session
          await session?.reload();
          router.push("/dashboard");
        } else {
          // Show error toast for server errors
          toast.error("Setup failed", {
            description:
              result?.error ||
              "There was a problem creating your organization.",
          });
        }
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error toast for client-side errors
      toast.error("Submission error", {
        description:
          "There was a problem submitting your form. Please try again.",
        action: {
          label: "Retry",
          onClick: () => form.handleSubmit(onSubmit)(),
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Set Up Your Client Portal</h1>
        <p className="text-gray-600">
          Create a branded portal where you can share files and collaborate with
          your clients.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Organization Name */}
          <FormField
            control={form.control}
            name="organizationName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Name</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Design Agency" {...field} />
                </FormControl>
                <FormDescription>
                  This is how your agency will appear to clients.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portal URL</FormLabel>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">https://</span>
                  <FormControl>
                    <Input
                      placeholder="acme-design"
                      {...field}
                      className="flex-1"
                    />
                  </FormControl>
                  <span className="text-sm text-gray-500">
                    .clientportal.app
                  </span>
                </div>
                <FormDescription>
                  Your unique portal URL. Only lowercase letters, numbers, and
                  hyphens.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Logo Upload */}
          <FormField
            control={form.control}
            name="logoImage"
            render={({ field }) => {
              const { name, onBlur, disabled } = field;

              return (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div
                      className="relative w-32 h-32 border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() =>
                        !logoLoading && fileInputRef.current?.click()
                      }
                    >
                      {logoLoading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                          <span className="text-xs text-gray-500">
                            Processing...
                          </span>
                        </div>
                      ) : logoPreview ? (
                        <>
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-contain p-2"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded-full shadow-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeLogo();
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Click to upload
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/jpeg, image/png, image/gif, image/webp"
                          onChange={handleLogoChange}
                          className="hidden"
                          ref={fileInputRef}
                          name={name}
                          onBlur={onBlur}
                          disabled={disabled || logoLoading}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full md:w-auto"
                        disabled={logoLoading}
                      >
                        {logoLoading
                          ? "Processing..."
                          : logoPreview
                          ? "Change Logo"
                          : "Upload Logo"}
                      </Button>
                      <FormDescription className="mt-2">
                        Upload your agency logo. Square images work best (e.g.,
                        400x400px). JPG, PNG, or WebP format.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              );
            }}
          />

          {/* Brand Colors */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Brand Colors</h3>
              <p className="text-sm text-gray-600 mb-4">
                Customize the portal to match your brand identity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className="w-16 h-10 cursor-pointer"
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="#6366f1"
                          className="flex-1 font-mono"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Used for headers, buttons, and key elements
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Color</FormLabel>
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Input
                          type="color"
                          {...field}
                          className="w-16 h-10 cursor-pointer"
                        />
                      </FormControl>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder="#8b5cf6"
                          className="flex-1 font-mono"
                        />
                      </FormControl>
                    </div>
                    <FormDescription>
                      Used for accents and hover states
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Email Settings */}
          <FormField
            control={form.control}
            name="emailFromName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Sender Name (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Acme Design Team" {...field} />
                </FormControl>
                <FormDescription>
                  How your name appears in emails sent to clients. Defaults to
                  your organization name if left blank.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting || isPending || logoLoading}
            >
              {isSubmitting || isPending
                ? "Creating Your Portal..."
                : "Create Portal"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        <div className="flex items-center gap-3">
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo preview"
              className="w-12 h-12 object-contain"
            />
          )}
          <div>
            <p className="font-medium">
              {form.watch("organizationName") || "Your Organization"}
            </p>
            <p className="text-sm text-gray-500">
              {form.watch("slug")
                ? `${form.watch("slug")}.clientportal.app`
                : "your-slug.clientportal.app"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div
            className="w-12 h-12 rounded"
            style={{ backgroundColor: form.watch("primaryColor") }}
          />
          <div
            className="w-12 h-12 rounded"
            style={{ backgroundColor: form.watch("secondaryColor") }}
          />
        </div>
      </div>
    </div>
  );
}
