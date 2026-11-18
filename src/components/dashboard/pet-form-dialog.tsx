"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { petSchema, type PetInput } from "@/lib/validations/pet";
import { createPet, updatePet } from "@/app/actions/pets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { PetDTO } from "@/types";

const PET_TYPES = ["Dog", "Cat", "Other"] as const;
const GENDERS = ["Male", "Female"] as const;

export function PetFormDialog({
  open,
  onOpenChange,
  pet,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pet?: PetDTO | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const isEdit = Boolean(pet);

  const form = useForm<PetInput>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: "",
      type: "Dog",
      breed: "",
      age: "",
      gender: "Male",
      weight: "",
      image: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: pet?.name ?? "",
        type: pet?.type ?? "Dog",
        breed: pet?.breed ?? "",
        age: pet?.age ?? "",
        gender: pet?.gender ?? "Male",
        weight: pet?.weight ?? "",
        image: pet?.image ?? "",
      });
    }
  }, [open, pet, form]);

  function onSubmit(values: PetInput) {
    startTransition(async () => {
      const result =
        isEdit && pet ? await updatePet(pet.id, values) : await createPet(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(
        isEdit ? "Pet details updated." : `${values.name} was added to your pets!`
      );
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit pet" : "Add a new pet"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? `Update ${pet?.name}'s details below.`
              : "Tell us a little about your furry friend."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pet-name">Pet name</Label>
            <Input
              id="pet-name"
              placeholder="e.g. Rocky"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Pet type</Label>
            <Select
              value={form.watch("type")}
              onValueChange={(value) =>
                form.setValue("type", value as PetInput["type"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PET_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Gender</Label>
            <Select
              value={form.watch("gender")}
              onValueChange={(value) =>
                form.setValue("gender", value as PetInput["gender"])
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pet-breed">Breed</Label>
            <Input
              id="pet-breed"
              placeholder="e.g. Golden Retriever"
              {...form.register("breed")}
            />
            {form.formState.errors.breed && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.breed.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pet-age">Age</Label>
              <Input
                id="pet-age"
                placeholder="e.g. 2 years"
                {...form.register("age")}
              />
              {form.formState.errors.age && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.age.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pet-weight">Weight</Label>
              <Input
                id="pet-weight"
                placeholder="e.g. 12 kg"
                {...form.register("weight")}
              />
              {form.formState.errors.weight && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.weight.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="pet-image">Profile image URL (optional)</Label>
            <Input
              id="pet-image"
              type="url"
              placeholder="https://example.com/rocky.jpg"
              {...form.register("image")}
            />
            {form.formState.errors.image && (
              <p className="text-xs font-medium text-destructive">
                {form.formState.errors.image.message}
              </p>
            )}
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Saving…" : isEdit ? "Save changes" : "Add pet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
