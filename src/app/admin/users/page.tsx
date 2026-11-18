import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { requireAdminUser } from "@/lib/admin";
import { getDatabase } from "@/lib/db";
import { formatDateShort } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export const metadata = { title: "Users · Admin" };

export default async function AdminUsersPage() {
  const admin = await requireAdminUser();
  if (!admin) redirect("/dashboard");

  const db = await getDatabase();

  const [users, pets, appointments] = await Promise.all([
    db
      .collection("user")
      .find({}, {
        projection: { name: 1, email: 1, emailVerified: 1, createdAt: 1 },
      })
      .sort({ createdAt: -1 })
      .toArray(),
    Pet.find(),
    Appointment.find(),
  ]);

  const petsByUser = new Map<string, number>();
  for (const pet of pets) {
    const key = String(pet.ownerId);
    petsByUser.set(key, (petsByUser.get(key) ?? 0) + 1);
  }

  const appointmentsByUser = new Map<string, number>();
  for (const appointment of appointments) {
    const key = String(appointment.ownerId);
    appointmentsByUser.set(key, (appointmentsByUser.get(key) ?? 0) + 1);
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Users"
        description="Every person who has registered on PawCare."
      />

      <Card>
        <CardHeader>
          <CardTitle>Registered accounts</CardTitle>
          <CardDescription>{users.length} account(s) found.</CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
              No users yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Pets</TableHead>
                  <TableHead className="text-center">Appointments</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const userId = String(user._id);
                  return (
                    <TableRow key={userId}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                            {(user.name ?? "?").charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {user.name}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.emailVerified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {petsByUser.get(userId) ?? 0}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {appointmentsByUser.get(userId) ?? 0}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateShort(new Date(user.createdAt).toISOString().slice(0, 10))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
