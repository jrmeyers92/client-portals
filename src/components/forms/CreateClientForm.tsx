"use client";

import { FormInput, FormSelect, FormTextarea } from "@/components/FormComponents
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  clientFormSchema,
  type ClientFormValues,
  validateLogoFile,
} from "@/schemas/clientSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateClientFormProps {
  organizationId: string;
  userId: string;
}

export function CreateClientForm({
  organizationId,
  userId,
}: CreateClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      organizationId,
      companyName: "",
      email: "",
      phone: "",
      website: "",
      status: "active" as const,
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
      },
      notes: "",
      tags: [],
      customFields: {},
      logoImage: null,
      createdBy: userId,
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!validateLogoFile(file)) {
        toast.error("Invalid file", {
          description:
            "Logo must be an image under 2MB (JPEG, PNG, GIF, WebP, or SVG)",
        });
        return;
      }
      form.setValue("logoImage", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    form.setValue("logoImage", null);
    setLogoPreview(null);
  };

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === "logoImage" && value instanceof File) {
          formData.append("logoImage", value);
        } else if (key === "address" && value) {
          formData.append("address", JSON.stringify(value));
        } else if (key === "tags" && Array.isArray(value)) {
          formData.append("tags", JSON.stringify(value));
        } else if (key === "customFields" && value) {
          formData.append("customFields", JSON.stringify(value));
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      const response = await fetch("/api/clients", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create client");
      }

      toast.success("Success", {
        description: "Client created successfully",
      });

      router.push("/clients");
      router.refresh();
    } catch (error) {
      console.error("Error creating client:", error);
      toast.error("Error", {
        description:
          error instanceof Error ? error.message : "Failed to create client",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              control={form.control}
              name="companyName"
              label="Company Name *"
              placeholder="Acme Inc."
            />

            <FormInput
              control={form.control}
              name="email"
              label="Email *"
              type="email"
              placeholder="contact@acme.com"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="phone"
                label="Phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
              />

              <FormInput
                control={form.control}
                name="website"
                label="Website"
                type="url"
                placeholder="https://acme.com"
              />
            </div>

            <FormSelect
              control={form.control}
              name="status"
              label="Status *"
              placeholder="Select status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </CardContent>
        </Card>

        {/* Logo Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Company Logo</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="logoImage"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Upload Logo</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {logoPreview ? (
                        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={removeLogo}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">
                                Click to upload logo
                              </p>
                              <p className="text-xs text-gray-400">
                                PNG, JPG, GIF, WebP or SVG (MAX. 2MB)
                              </p>
                            </div>
                            <Input
                              type="file"
                              className="hidden"
                              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
                              onChange={handleLogoChange}
                              {...field}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload your client's logo (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              control={form.control}
              name="address.street"
              label="Street"
              placeholder="123 Main St"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="address.city"
                label="City"
                placeholder="New York"
              />

              <FormInput
                control={form.control}
                name="address.state"
                label="State/Province"
                placeholder="NY"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                control={form.control}
                name="address.postalCode"
                label="Postal Code"
                placeholder="10001"
              />

              <FormInput
                control={form.control}
                name="address.country"
                label="Country"
                placeholder="United States"
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextarea
              control={form.control}
              name="notes"
              label="Notes"
              placeholder="Add any additional notes about this client..."
              description="Maximum 2000 characters"
              minHeight="min-h-[100px]"
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Client
          </Button>
        </div>
      </form>
    </Form>
  );
}
