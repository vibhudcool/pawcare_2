import { Badge } from "@/components/ui/badge";

const appointmentStatusStyles: Record<string, { variant: "warning" | "default" | "success" | "destructive"; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  confirmed: { variant: "default", label: "Confirmed" },
  completed: { variant: "success", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

export function AppointmentStatusBadge({ status }: { status: string }) {
  const style = appointmentStatusStyles[status] ?? appointmentStatusStyles.pending;
  return <Badge variant={style.variant}>{style.label}</Badge>;
}

export function GenderBadge({ gender }: { gender: "Male" | "Female" }) {
  return <Badge variant="secondary">{gender}</Badge>;
}
