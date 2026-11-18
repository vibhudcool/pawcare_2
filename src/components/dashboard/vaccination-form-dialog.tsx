"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  vaccinationFormSchema,
  type VaccinationInput,
} from "@/lib/validations/vaccination";
import {
  createVaccination,
  updateVaccination,
} from "@/app/actions/vaccinations";
import type { VaccinationDTO } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VaccinationFormDialog({
  open,
  onOpenChange,
  vaccination,
  pets,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vaccination?: VaccinationDTO | null;
  pets: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const isEdit = Boolean(vaccination);

  const form = useForm<VaccinationInput>({
    resolver: zodResolver(vaccinationFormSchema),
    defaultValues: {
      petId: "",
      vaccineName: "",
      vaccinationDate: "",
      nextDueDate: "",
      notes: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        petId: vaccination?.petId ?? "",
        vaccineName: vaccination?.vaccineName ?? "",
        vaccinationDate: vaccination?.vaccinationDate ?? "",
        nextDueDate: vaccination?.nextDueDate ?? "",
        notes: vaccination?.notes ?? "",
      });
    }
  }, [open, vaccination, form]);

  function onSubmit(values: VaccinationInput) {
    startTransition(async () => {
      const result =
        isEdit && vaccination
          ? await updateVaccination(vaccination.id, values)
          : await createVaccination(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(
        isEdit
          ? "Vaccination record updated."
          : "Vaccination record added."
      );
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit vaccination record" : "Add vaccination record"}
          </DialogTitle>
          <DialogDescription>
            Keep track of vaccines and get reminded before the next due date.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Pet</Label>
            <Select
              value={form.watch("petId")}
              onValueChange={(value) => form.setValue("petId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a pet" />
              </SelectTrigger>
              <SelectContent>
                {pets.map((pet) => (
                  <SelectItem key={pet.id} value={pet.id}>
                    {pet.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.petId && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.petId.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vaccine-name">Vaccine name</Label>
            <Input
              id="vaccine-name"
              placeholder="e.g. Rabies, DHPP, FVRCP"
              {...form.register("vaccineName")}
            />
            {form.formState.errors.vaccineName && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.vaccineName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="vaccination-date">Vaccination date</Label>
              <Input
                id="vaccination-date"
                type="date"
                {...form.register("vaccinationDate")}
              />
              {form.formState.errors.vaccinationDate && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.vaccinationDate.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="next-due-date">Next due date</Label>
              <Input
                id="next-due-date"
                type="date"
                {...form.register("nextDueDate")}
              />
              {form.formState.errors.nextDueDate && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.nextDueDate.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="vaccine-notes">Notes (optional)</Label>
            <Textarea
              id="vaccine-notes"
              placeholder="Veterinarian, clinic, batch number…"
              {...form.register("notes")}
            />
            {form.formState.errors.notes && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.notes.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
