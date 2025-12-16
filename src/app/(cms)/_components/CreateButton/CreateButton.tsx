"use client";

import { useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CreateButtonProps {
  children: (args: { close: () => void }) => React.ReactNode;
  className?: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CreateButton({
  children,
  className,
  variant = "ghost",
  size = "icon",
}: CreateButtonProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          id="create-button"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      {children({ close })}
    </Dialog>
  );
}
