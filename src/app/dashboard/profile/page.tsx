import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ProfileForm } from "@/components/dashboard/profile-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  const user = session.user;

  return (
    <ProfileForm
      user={{
        name: user.name ?? "",
        email: user.email,
        image: user.image ?? "",
        createdAt: new Date(user.createdAt).toISOString(),
      }}
    />
  );
}
