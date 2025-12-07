// app/products/new/_components/attribute-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  attributeItemSchema,
  AttributeItemValues,
} from "@/lib/validators/product";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Edit, PlusCircle } from "lucide-react";
import { Attribute, AttributeResponse } from "@/types/types";
import { useSession } from "next-auth/react";

interface AttributeDialogProps {
  mode: "create" | "edit";
  defaultValues?: AttributeItemValues;
  onSave: (data: AttributeItemValues) => void; // Hàm callback để trả dữ liệu về cha
}

const fetcher = (url: string, token: string): Promise<AttributeResponse> =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());

export function ProductAttributeDialog({
  mode,
  defaultValues,
  onSave,
}: AttributeDialogProps) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const form = useForm<AttributeItemValues>({
    resolver: zodResolver(attributeItemSchema),
    defaultValues: defaultValues || {
      attributeId: "",
      attributeName: "",
      valueId: "",
      valueName: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(defaultValues || { attributeId: "", valueId: "" });
    }
  }, [open, defaultValues, form]);

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attributes`,
    (url) => fetcher(url, session.data?.accessToken || ""),
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error loading attributes.</div>;
  }
  console.log("Fetched attributes:", data);
  const attributesList: Attribute[] = data?.data || [];

  const onSubmitLocal = (data: AttributeItemValues) => {
    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          {mode === "create" ? (
            <PlusCircle className="[&_svg]:size-4" size={24} />
          ) : (
            <Edit className="[&_svg]:size-4" size={24} />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Attribute" : "Edit Attribute"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm thuộc tính vào sản phẩm."
              : "Cập nhật thuộc tính sản phẩm."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmitLocal)} className="space-y-6">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="attributeId" className="text-right font-semibold">
                Attribute
              </Label>
              <Select
                onValueChange={(value) => {
                  const selectedAttribute = attributesList.find(
                    (attr) => attr.id === value,
                  );
                  form.setValue("attributeId", value);
                  form.setValue(
                    "attributeName",
                    selectedAttribute ? selectedAttribute.name : "",
                  );
                  form.setValue("valueId", "");
                  form.setValue("valueName", "");
                }}
                value={form.getValues("attributeId") || undefined}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
                <SelectContent
                  className={"max-h-60 max-w-full overflow-y-auto"}
                >
                  {attributesList.map((attribute) => (
                    <SelectItem key={attribute.id} value={attribute.id}>
                      {attribute.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valueId" className="text-right font-semibold">
                Value
              </Label>
              <Select
                onValueChange={(value) => {
                  const selectedAttribute = attributesList.find(
                    (attr) => attr.id === form.getValues("attributeId"),
                  );
                  const selectedValue = selectedAttribute?.values.find(
                    (val) => val.id === value,
                  );
                  form.setValue("valueId", value);
                  form.setValue(
                    "valueName",
                    selectedValue ? selectedValue.value : "",
                  );
                }}
                value={form.getValues("valueId") || undefined}
                disabled={!form.getValues("attributeId")}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a value" />
                </SelectTrigger>
                <SelectContent>
                  {attributesList
                    .find((attr) => attr.id === form.getValues("attributeId"))
                    ?.values.map((val) => (
                      <SelectItem key={val.id} value={val.id}>
                        {val.value}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              !form.getValues("attributeId") || !form.getValues("valueId")
            }
            onClick={() => form.handleSubmit(onSubmitLocal)()}
          >
            {mode === "create" ? "Add" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
