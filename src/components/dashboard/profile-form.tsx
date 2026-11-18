"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { profileSchema, type ProfileInput } from "@/lib/validations/auth";
import { updateProfile } from "@/app/actions/profile";
import { formatDateShort } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

export function ProfileForm({
  user,
}: {
  user: { name: string; email: string; image: string; createdAt: string };
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, image: user.image },
  });

  const image = form.watch("image");

  function onSubmit(values: ProfileInput) {
    startTransition(async () => {
      const result = await updateProfile(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Profile updated successfully.");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl space-y-7">
      <PageHeader
        title="Profile"
        description="Manage your account details."
      />

      <Card>
        <CardHeader>
          <CardTitle>Account information</CardTitle>
          <CardDescription>
            Your email address is used to sign in to PawCare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image}
                  alt={form.watch("name")}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="font-display text-2xl font-extrabold text-primary/50">
                  {(form.watch("name") || "P").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-display text-lg font-bold text-foreground">
                {form.watch("name") || "Pet parent"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Member since {formatDateShort(user.createdAt.slice(0, 10))}
              </p>
            </div>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="profile-name">Full name</Label>
              <Input
                id="profile-name"
                placeholder="Your name"
                autoComplete="name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-image">Profile photo URL (optional)</Label>
              <Input
                id="profile-image"
                type="url"
                placeholder="https://example.com/your-photo.jpg"
                {...form.register("image")}
              />
              {form.formState.errors.image && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.image.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="profile-email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="profile-email"
                  className="pl-10"
                  value={user.email}
                  disabled
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Verified</Badge>
                <p className="text-xs text-muted-foreground">
                  Your email is verified and can be used to sign in.
                </p>
              </div>
            </div>

            <Button type="submit" size="lg" disabled={pending} className="w-full">
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
