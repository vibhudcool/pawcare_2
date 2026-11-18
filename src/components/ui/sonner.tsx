"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-center"
      gap={10}
      {...props}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-border bg-card shadow-soft font-sans text-foreground",
          title: "font-semibold",
          description: "text-muted-foreground",
          actionButton: "rounded-full",
          cancelButton: "rounded-full",
        },
      }}
    />
  );
}
