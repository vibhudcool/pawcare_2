"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  bookingFormSchema,
  type BookingFormInput,
} from "@/lib/validations/appointment";
import { createAppointment } from "@/app/actions/appointments";
import {
  GROOMING_PACKAGES,
  TIME_SLOTS,
  VETERINARY_SERVICE,
} from "@/lib/constants";
import { todayString } from "@/lib/serialize";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";

export function BookingForm({
  pets,
  initialPackage,
}: {
  pets: { id: string; name: string; type: string }[];
  initialPackage?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();

  const form = useForm<BookingFormInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      petId: "",
      packageId: initialPackage ?? "",
      appointmentDate: "",
      timeSlot: "",
      notes: "",
    },
  });

  const selectedPackageId = form.watch("packageId");
  const today = todayString();

  function onSubmit(values: BookingFormInput) {
    startTransition(async () => {
      const pkg = GROOMING_PACKAGES.find((p) => p.id === values.packageId);

      const result = await createAppointment({
        petId: values.petId,
        serviceName: pkg ? pkg.name : VETERINARY_SERVICE.name,
        appointmentType: pkg ? "grooming" : "veterinary",
        appointmentDate: values.appointmentDate,
        timeSlot: values.timeSlot,
        notes: values.notes,
      });

      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success("Appointment booked! It is now pending confirmation.");
      router.push("/dashboard/appointments");
      router.refresh();
    });
  }

  const serviceOptions = [
    ...GROOMING_PACKAGES.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      price: pkg.price,
      duration: pkg.duration,
      icon: pkg.icon,
    })),
    {
      id: VETERINARY_SERVICE.id,
      name: VETERINARY_SERVICE.name,
      price: VETERINARY_SERVICE.price,
      duration: VETERINARY_SERVICE.duration,
      icon: VETERINARY_SERVICE.icon,
    },
  ];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Book Appointment"
        description="Choose your pet, pick a service and reserve a time slot."
      />

      <Card className="mx-auto max-w-3xl">
        <CardHeader>
          <CardTitle>Appointment details</CardTitle>
          <CardDescription>
            All fields are required except the notes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Pet */}
            <div className="space-y-1.5">
              <Label>Select your pet</Label>
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
                      {pet.name} ({pet.type})
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

            {/* Service */}
            <div className="space-y-2">
              <Label>Choose a service</Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {serviceOptions.map((option) => {
                  const selected = selectedPackageId === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        form.setValue("packageId", option.id, {
                          shouldValidate: true,
                        })
                      }
                      className={cn(
                        "relative flex items-start gap-3 rounded-2xl border bg-card p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/25"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <option.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-foreground">
                          {option.name}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          ₹{option.price} · {option.duration}
                        </span>
                      </span>
                      {selected && (
                        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="h-3 w-3" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {form.formState.errors.packageId && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.packageId.message}
                </p>
              )}
            </div>

            {/* Date + time */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="appointment-date">Appointment date</Label>
                <Input
                  id="appointment-date"
                  type="date"
                  min={today}
                  {...form.register("appointmentDate")}
                />
                {form.formState.errors.appointmentDate && (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.appointmentDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Time slot</Label>
                <Select
                  value={form.watch("timeSlot")}
                  onValueChange={(value) => form.setValue("timeSlot", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.timeSlot && (
                  <p className="text-xs font-medium text-destructive">
                    {form.formState.errors.timeSlot.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Anything we should know about your pet — behaviour, allergies, preferred products…"
                {...form.register("notes")}
              />
              {form.formState.errors.notes && (
                <p className="text-xs font-medium text-destructive">
                  {form.formState.errors.notes.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Booking…" : "Confirm booking"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
