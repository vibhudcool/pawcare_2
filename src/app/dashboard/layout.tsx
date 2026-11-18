import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { isAdminEmail } from "@/lib/admin";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session?.user) redirect("/login");

  const { user } = session;

  return (
    <DashboardShell
      isAdmin={isAdminEmail(user.email)}
      user={{
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
        emailVerified: Boolean(user.emailVerified),
      }}
    >
      {children}
    </DashboardShell>
  );
}
