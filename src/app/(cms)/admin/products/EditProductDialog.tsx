"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Edit, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Category } from "@/types/types";
import { useRouter } from "next/navigation";

const editGeneralSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  description: z.string().optional(),
});

type EditGeneralFormValues = z.infer<typeof editGeneralSchema>;

interface EditProductGeneralDialogProps {
  product: {
    id: string;
    name: string;
    description?: string;
    category: {
      id: string;
      name: string;
    };
  };
  categories: Category[];
  onSuccess?: () => void;
}

export function EditProductGeneralDialog({
  product,
  categories,
  onSuccess,
}: EditProductGeneralDialogProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const form = useForm<EditGeneralFormValues>({
    resolver: zodResolver(editGeneralSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      categoryId: product.category.id,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: product.name,
        description: product.description || "",
        categoryId: product.category.id,
      });
    }
  }, [open, product, form]);

  const onSubmit = async (data: EditGeneralFormValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${product.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: JSON.stringify({
            name: data.name,
            description: data.description,
            categoryId: data.categoryId,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Cập nhật thông tin thất bại");
        return;
      }

      toast.success("Cập nhật thông tin thành công!");
      setOpen(false);
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Edit className={"size-5"} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product Info</DialogTitle>
          <DialogDescription>
            Cập nhật tên, danh mục và mô tả sản phẩm.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="name"
                  placeholder="Tên sản phẩm..."
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="categoryId"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="category">Category</Label>
                <Select
                  {...field}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    id={"category"}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="description"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  {...field}
                  aria-invalid={fieldState.invalid}
                  id="description"
                  placeholder="Mô tả sản phẩm..."
                  className={"max-h-[400px] overflow-y-scroll break-all"}
                  rows={4}
                />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
