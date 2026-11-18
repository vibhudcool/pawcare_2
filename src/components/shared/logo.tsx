import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "default",
}: {
  className?: string;
  size?: "default" | "lg";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
        <PawPrint className="h-5 w-5" />
      </span>
      <span
        className={cn(
          "font-display font-extrabold tracking-tight text-foreground",
          size === "lg" ? "text-3xl" : "text-xl"
        )}
      >
        Paw<span className="text-accent">Care</span>
      </span>
    </span>
  );
}
