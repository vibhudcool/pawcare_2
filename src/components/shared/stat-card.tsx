import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Counter } from "@/components/shared/counter";
import { cn } from "@/lib/utils";

const tones = {
  green: "bg-primary/10 text-primary",
  orange: "bg-accent/10 text-accent",
  blue: "bg-sky-100 text-sky-600",
  red: "bg-destructive/10 text-destructive",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "green",
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  hint?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-lift">
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          tones[tone]
        )}
      >
        <Icon className="h-6 w-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="font-display text-2xl font-extrabold text-foreground">
          {typeof value === "number" ? <Counter value={value} /> : value}
        </p>
        {hint && <p className="truncate text-xs text-muted-foreground">{hint}</p>}
      </div>
    </Card>
  );
}
