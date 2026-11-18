"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Plus, PawPrint, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deletePet } from "@/app/actions/pets";
import type { PetDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GenderBadge } from "@/components/shared/status-badge";
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
import { PetFormDialog } from "./pet-form-dialog";

function PetCard({
  pet,
  onEdit,
  onDelete,
}: {
  pet: PetDTO;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lift">
      <div className="relative flex h-44 items-center justify-center bg-secondary">
        {pet.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pet.image}
            alt={pet.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-display text-6xl font-extrabold text-primary/30">
            {pet.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="absolute right-3 top-3">
          <Badge variant="secondary">{pet.type}</Badge>
        </div>
      </div>
      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-lg font-bold leading-tight text-foreground">
              {pet.name}
            </h3>
            <p className="text-xs text-muted-foreground">{pet.breed}</p>
          </div>
          <GenderBadge gender={pet.gender} />
        </div>
        <p className="text-xs text-muted-foreground">
          Age: {pet.age} · Weight: {pet.weight}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/dashboard/pets/${pet.id}`}>View</Link>
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Edit ${pet.name}`}>
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            aria-label={`Delete ${pet.name}`}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function PetsClient({ pets }: { pets: PetDTO[] }) {
  const router = useRouter();
  const [addOpen, setAddOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<PetDTO | null>(null);
  const [deleting, setDeleting] = React.useState<PetDTO | null>(null);
  const [pending, startTransition] = React.useTransition();

  function handleDelete() {
    if (!deleting) return;
    const pet = deleting;
    startTransition(async () => {
      const result = await deletePet(pet.id);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`${pet.name} was removed.`);
      setDeleting(null);
      router.refresh();
    });
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="My Pets"
        description="Add your furry friends and keep their details up to date."
      >
        <Button onClick={() => setAddOpen(true)}>
          <Plus />
          Add Pet
        </Button>
      </PageHeader>

      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint}
          title="No pets yet"
          description="Add your first pet to start booking grooming sessions and tracking vaccinations."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus />
              Add your first pet
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              onEdit={() => setEditing(pet)}
              onDelete={() => setDeleting(pet)}
            />
          ))}
        </div>
      )}

      <PetFormDialog open={addOpen} onOpenChange={setAddOpen} />
      <PetFormDialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        pet={editing}
      />

      <Dialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove {deleting?.name}?</DialogTitle>
            <DialogDescription>
              This will permanently delete {deleting?.name}&apos;s profile. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              <Trash2 />
              {pending ? "Deleting…" : "Delete pet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
