import { redirect } from "next/navigation";
import { VerifyEmailCard } from "@/components/auth/verify-email-card";

export const metadata = { title: "Verify your email" };

/**
 * The verification link in the email points here (Better Auth builds
 * `${baseURL}/verify-email?token=...`). When a token is present we hand
 * the request over to the Better Auth endpoint, which verifies the token
 * and redirects to the callback URL (dashboard by default).
 */
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
    token?: string;
    callbackURL?: string;
  }>;
}) {
  const { email, token, callbackURL } = await searchParams;

  if (token) {
    const target =
      callbackURL && callbackURL.startsWith("/") ? callbackURL : "/dashboard";
    redirect(
      `/api/auth/verify-email?token=${encodeURIComponent(token)}&callbackURL=${encodeURIComponent(target)}`
    );
  }

  return <VerifyEmailCard email={email} />;
}
