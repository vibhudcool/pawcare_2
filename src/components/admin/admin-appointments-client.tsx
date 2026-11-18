"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Inbox, XCircle } from "lucide-react";
import { toast } from "sonner";
import { setAppointmentStatus } from "@/app/actions/admin";
import type { AppointmentDTO } from "@/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Row = AppointmentDTO & { ownerEmail: string };

export function AdminAppointmentsClient({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  function update(id: string, status: "confirmed" | "completed" | "cancelled") {
    startTransition(async () => {
      const result = await setAppointmentStatus(id, status);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Appointment ${status}.`);
      router.refresh();
    });
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Appointments"
        description="Confirm, complete or cancel bookings on behalf of pet parents."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No appointments yet"
          description="Bookings made by pet parents will appear here."
        />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pet</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold text-foreground">
                      {row.petName ?? "Pet"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.ownerEmail}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {row.serviceName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.appointmentType === "veterinary"
                          ? "Veterinary"
                          : "Grooming"}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(row.appointmentDate)}
                      <span className="block text-xs">{row.timeSlot}</span>
                    </TableCell>
                    <TableCell>
                      <AppointmentStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {row.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() => update(row.id, "confirmed")}
                          >
                            <Check />
                            Confirm
                          </Button>
                        )}
                        {row.status === "confirmed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() => update(row.id, "completed")}
                          >
                            <Check />
                            Complete
                          </Button>
                        )}
                        {(row.status === "pending" ||
                          row.status === "confirmed") && (
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={pending}
                            onClick={() => update(row.id, "cancelled")}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <XCircle />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
