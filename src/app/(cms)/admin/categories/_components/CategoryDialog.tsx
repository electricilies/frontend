"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Category } from "@/types/types";
import { getErrorMessage } from "@/app/lib/utils";
import { useSession } from "next-auth/react";

interface CategoryDialogContentProps {
  mode: "create" | "edit";
  category?: Category;
  onSuccess: () => void;
}

export function CategoryDialogContent({
  mode,
  category,
  onSuccess,
}: CategoryDialogContentProps) {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");

  useEffect(() => {
    if (mode === "edit" && category) {
      setName(category.name);
    } else {
      setName("");
    }
  }, [mode, category]);

  const handleSave = async () => {
    if (!name.trim()) return toast.error("Vui lòng nhập tên danh mục");

    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const currentCategoryId = category?.id;

      if (mode === "create") {
        const resCategory = await fetch(`${baseUrl}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken || ""}`,
          },
          body: JSON.stringify({ name }),
        });

        if (!resCategory.ok) {
          const err = await resCategory.json();
          throw new Error(err.message || "Lỗi khi tạo danh mục");
        }
      } else {
        if (!currentCategoryId) throw new Error("Missing ID");

        const resAttr = await fetch(
          `${baseUrl}/categories/${currentCategoryId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.data?.accessToken || ""}`,
            },
            body: JSON.stringify({ name }),
          },
        );

        if (!resAttr.ok) {
          const err = await resAttr.json();
          throw new Error(err.message || "Lỗi khi cập nhật danh mục");
        }
      }
      toast.success(
        `${mode === "create" ? "Tạo danh mục thành công" : "Cập nhật danh mục thành công"}`,
      );
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error("Có lỗi xảy ra:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Create Category" : "Edit Category"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Tạo danh mục sản phẩm."
            : "Chỉnh sửa danh mục sản phẩm."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right font-semibold">
            Tên
          </Label>
          <Input
            id="name"
            value={name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên danh mục..."
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isLoading}>
            Hủy
          </Button>
        </DialogClose>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : "Lưu"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
