"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Eye,
  Inbox,
  Plus,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cancelAppointment } from "@/app/actions/appointments";
import type { AppointmentDTO } from "@/types";
import { formatDate } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function AppointmentRow({
  appointment,
  onView,
  onCancel,
}: {
  appointment: AppointmentDTO;
  onView: () => void;
  onCancel: () => void;
}) {
  const canCancel =
    appointment.status === "pending" || appointment.status === "confirmed";

  return (
    <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <CalendarDays className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">
            {appointment.petName ?? "Pet"}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {appointment.serviceName}
          </p>
          <Badge variant="outline" className="mt-1">
            {appointment.appointmentType === "veterinary"
              ? "Veterinary"
              : "Grooming"}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-2 pl-14 sm:pl-0">
        <div className="mr-1 text-right">
          <p className="text-sm font-semibold text-foreground">
            {formatDate(appointment.appointmentDate)}
          </p>
          <p className="text-xs text-muted-foreground">{appointment.timeSlot}</p>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onView} aria-label="View details">
            <Eye />
          </Button>
          {canCancel && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              aria-label="Cancel appointment"
              className="text-muted-foreground hover:text-destructive"
            >
              <XCircle />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

export function AppointmentsClient({
  upcoming,
  others,
}: {
  upcoming: AppointmentDTO[];
  others: AppointmentDTO[];
}) {
  const router = useRouter();
  const [viewing, setViewing] = React.useState<AppointmentDTO | null>(null);
  const [cancelling, setCancelling] = React.useState<AppointmentDTO | null>(null);
  const [pending, startTransition] = React.useTransition();

  function handleCancel() {
    if (!cancelling) return;
    const appointment = cancelling;
    startTransition(async () => {
      const result = await cancelAppointment(appointment.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment cancelled.");
      setCancelling(null);
      router.refresh();
    });
  }

  const total = upcoming.length + others.length;

  return (
    <div className="space-y-7">
      <PageHeader
        title="Appointments"
        description="View, track and cancel your bookings."
      >
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <Plus />
            Book Appointment
          </Link>
        </Button>
      </PageHeader>

      {total === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No appointments yet"
          description="Book a grooming session or a vet visit and it will show up here."
          action={
            <Button asChild>
              <Link href="/dashboard/appointments/new">
                <Plus />
                Book your first appointment
              </Link>
            </Button>
          }
        />
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Upcoming ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-5 text-center text-sm text-muted-foreground">
                Nothing scheduled right now.
              </p>
            ) : (
              upcoming.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appointment={a}
                  onView={() => setViewing(a)}
                  onCancel={() => setCancelling(a)}
                />
              ))
            )}
          </section>

          {others.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Past & cancelled ({others.length})
              </h2>
              {others.map((a) => (
                <AppointmentRow
                  key={a.id}
                  appointment={a}
                  onView={() => setViewing(a)}
                  onCancel={() => setCancelling(a)}
                />
              ))}
            </section>
          )}
        </>
      )}

      {/* Details dialog */}
      <Dialog
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment details</DialogTitle>
            <DialogDescription>
              Booked on {viewing ? formatDate(viewing.createdAt.slice(0, 10)) : ""}
            </DialogDescription>
          </DialogHeader>
          {viewing && (
            <dl className="space-y-3 text-sm">
              {[
                ["Pet", viewing.petName ?? "—"],
                ["Service", viewing.serviceName],
                [
                  "Type",
                  viewing.appointmentType === "veterinary"
                    ? "Veterinary"
                    : "Grooming",
                ],
                ["Date", formatDate(viewing.appointmentDate)],
                ["Time slot", viewing.timeSlot],
                ["Status", undefined],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold text-foreground">
                    {label === "Status" ? (
                      <AppointmentStatusBadge status={viewing.status} />
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
              {viewing.notes && (
                <div className="rounded-xl bg-secondary/60 px-4 py-3">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">
                    Notes
                  </p>
                  <p className="whitespace-pre-wrap text-foreground">
                    {viewing.notes}
                  </p>
                </div>
              )}
            </dl>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel confirmation */}
      <Dialog
        open={cancelling !== null}
        onOpenChange={(open) => {
          if (!open) setCancelling(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this appointment?</DialogTitle>
            <DialogDescription>
              {cancelling?.petName} &middot; {cancelling?.serviceName} on{" "}
              {cancelling && formatDate(cancelling.appointmentDate)} at{" "}
              {cancelling?.timeSlot}. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelling(null)}>
              Keep it
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={pending}
            >
              <XCircle />
              {pending ? "Cancelling…" : "Yes, cancel it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
