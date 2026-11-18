import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/admin";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin portal" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminUser();

  if (!user) redirect("/dashboard");

  return (
    <AdminShell
      user={{
        name: user.name ?? "Admin",
        email: user.email,
        image: user.image ?? "",
      }}
    >
      {children}
    </AdminShell>
  );
}
