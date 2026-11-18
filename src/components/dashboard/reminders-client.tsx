"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Syringe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteVaccination } from "@/app/actions/vaccinations";
import type { VaccinationDTO } from "@/types";
import { dueInfo, formatDate } from "@/lib/format";
import { todayString } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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
import { VaccinationFormDialog } from "./vaccination-form-dialog";

function VaccinationCard({
  vaccination,
  overdue,
  onEdit,
  onDelete,
}: {
  vaccination: VaccinationDTO;
  overdue: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const due = dueInfo(vaccination.nextDueDate, todayString());

  return (
    <Card
      className={cn(
        "p-4",
        overdue && "border-destructive/30 bg-destructive/[0.03]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              overdue
                ? "bg-destructive/10 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            <Syringe className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">
              {vaccination.vaccineName}
            </p>
            <p className="text-xs text-muted-foreground">
              {vaccination.petName ?? "Pet"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Given {formatDate(vaccination.vaccinationDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Edit record">
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label="Delete record"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Next due {formatDate(vaccination.nextDueDate)}
        </p>
        <Badge
          variant={
            due.tone === "overdue"
              ? "destructive"
              : due.tone === "soon"
                ? "warning"
                : "secondary"
          }
        >
          {due.label}
        </Badge>
      </div>
      {vaccination.notes && (
        <p className="mt-2 line-clamp-2 rounded-lg bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
          {vaccination.notes}
        </p>
      )}
    </Card>
  );
}

export function RemindersClient({
  overdue,
  upcoming,
  pets,
}: {
  overdue: VaccinationDTO[];
  upcoming: VaccinationDTO[];
  pets: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<VaccinationDTO | null>(null);
  const [deleting, setDeleting] = React.useState<VaccinationDTO | null>(null);
  const [pending, startTransition] = React.useTransition();

  function handleDelete() {
    if (!deleting) return;
    const record = deleting;
    startTransition(async () => {
      const result = await deleteVaccination(record.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Vaccination record deleted.");
      setDeleting(null);
      router.refresh();
    });
  }

  const total = overdue.length + upcoming.length;

  return (
    <div className="space-y-7">
      <PageHeader
        title="Vaccination Reminders"
        description="Stay on top of your pet's vaccination schedule."
      >
        <Button onClick={() => setAddOpen(true)}>
          <Plus />
          Add Record
        </Button>
      </PageHeader>

      {total === 0 ? (
        <EmptyState
          icon={Syringe}
          title="No vaccination records"
          description="Add your pet's vaccination records and we'll remind you before the next dose is due."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus />
              Add your first record
            </Button>
          }
        />
      ) : (
        <>
          {overdue.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-destructive">
                Overdue ({overdue.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {overdue.map((v) => (
                  <VaccinationCard
                    key={v.id}
                    vaccination={v}
                    overdue
                    onEdit={() => setEditing(v)}
                    onDelete={() => setDeleting(v)}
                  />
                ))}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Upcoming ({upcoming.length})
            </h2>
            {upcoming.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-5 text-center text-sm text-muted-foreground">
                Nothing due soon — you're all caught up!
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map((v) => (
                  <VaccinationCard
                    key={v.id}
                    vaccination={v}
                    overdue={false}
                    onEdit={() => setEditing(v)}
                    onDelete={() => setDeleting(v)}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <VaccinationFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        pets={pets}
      />
      <VaccinationFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        vaccination={editing}
        pets={pets}
      />

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this record?</DialogTitle>
            <DialogDescription>
              {deleting?.vaccineName} for {deleting?.petName} will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              <Trash2 />
              {pending ? "Deleting…" : "Delete record"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
