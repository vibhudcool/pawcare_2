"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { resendVerificationEmail } from "@/app/actions/auth";

/**
 * Full-page card shown on /verify-email after registration.
 */
export function VerifyEmailCard({ email }: { email?: string }) {
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();

  function handleResend() {
    if (!email) {
      toast.error("Please sign in first, then request a new verification email.");
      return;
    }
    startTransition(async () => {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="mx-auto max-w-md p-2 text-center">
      <CardContent className="space-y-5 p-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold">Check your inbox</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            We sent a verification link to{" "}
            <span className="font-semibold text-foreground">{email || "your email"}</span>.
            Click the link to activate your PawCare account.
          </p>
        </div>
        <div className="space-y-2.5">
          <Button onClick={handleResend} disabled={pending} className="w-full">
            <Send />
            {pending ? "Sending…" : "Resend verification email"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Back to login
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t get it? Check your spam folder, or{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            sign in
          </Link>{" "}
          and we&apos;ll help you out.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Slim banner shown at the top of the dashboard until the email is verified.
 */
export function VerifyEmailBanner({ email }: { email: string }) {
  const [pending, startTransition] = React.useTransition();

  function handleResend() {
    startTransition(async () => {
      const result = await resendVerificationEmail(email);
      if (result.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="text-amber-900">
          <span className="font-bold">Please verify your email address</span>{" "}
          <span className="text-amber-700">to confirm your account ({email}).</span>
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={handleResend}
          disabled={pending}
          className="border-amber-300 bg-card text-amber-800 hover:bg-amber-100"
        >
          <Send />
          {pending ? "Sending…" : "Resend email"}
        </Button>
      </div>
    </div>
  );
}
