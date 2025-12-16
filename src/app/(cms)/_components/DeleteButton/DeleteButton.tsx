"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/app/lib/utils";

interface DeleteButtonProps {
  title?: string;
  description?: string;
  onDelete: () => Promise<void>;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  iconSize?: number;
  className?: string;
}

export function DeleteButton({
  title = "Bạn có chắc chắn muốn xóa?",
  description = "Hành động này không thể hoàn tác và sẽ xóa dữ liệu vĩnh viễn.",
  onDelete,
  variant = "ghost",
  size = "icon",
  className,
  iconSize = 24,
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete();

      toast.success("Đã xóa thành công!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          id={"delete-button"}
          variant={variant}
          size={size}
          className={`text-red-500 hover:bg-red-50 hover:text-red-600 ${className}`}
        >
          <Trash2 className="[&_svg]:size-4" size={iconSize} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel id={"alert-cancel"} disabled={isDeleting}>
            Hủy
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            id={"alert-delete"}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
              </>
            ) : (
              "Xóa ngay"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
