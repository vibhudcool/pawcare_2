import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { LoginForm } from "@/components/forms/login-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Login" };

export default async function LoginPage() {
  const session = await getSession();
  // Already signed in? Go straight to the dashboard.
  if (session?.user) redirect("/dashboard");

  return <LoginForm />;
}
