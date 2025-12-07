"use client";

import { useForm, Controller } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { Edit, PlusCircle, Loader2 } from "lucide-react";
import { Attribute, AttributeResponse } from "@/types/types";
import { useSession } from "next-auth/react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

interface AttributeDialogProps {
  mode: "create" | "edit";
  defaultValues?: AttributeItemValues;
  onSave: (data: AttributeItemValues) => void;
  existingAttributeIds: string[];
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
  existingAttributeIds,
}: AttributeDialogProps) {
  const session = useSession();
  const [open, setOpen] = useState(false);

  const form = useForm<AttributeItemValues>({
    resolver: zodResolver(attributeItemSchema),
    defaultValues: {
      attributeId: "",
      attributeName: "",
      valueId: "",
      valueName: "",
    },
  });

  const selectedAttributeId = form.watch("attributeId");

  useEffect(() => {
    if (open) {
      if (mode === "edit" && defaultValues) {
        form.reset(defaultValues);
      } else {
        form.reset({
          attributeId: "",
          attributeName: "",
          valueId: "",
          valueName: "",
        });
      }
    }
  }, [open, mode, defaultValues, form]);

  const { data, isLoading } = useSWR(
    session.data?.accessToken
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/attributes`
      : null,
    (url) => fetcher(url, session.data?.accessToken || ""),
  );

  const attributesList: Attribute[] = data?.data || [];

  const onSubmitLocal = (data: AttributeItemValues) => {
    const isDuplicate =
      existingAttributeIds.includes(data.attributeId) &&
      data.attributeId !== defaultValues?.attributeId;

    if (isDuplicate) {
      form.setError("attributeId", {
        type: "manual",
        message: "This attribute has already been selected.",
      });
      return;
    }

    onSave(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" type="button">
          {mode === "create" ? (
            <PlusCircle className="size-5" />
          ) : (
            <Edit className="size-6" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-fit min-w-[400px]">
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              return form.handleSubmit(onSubmitLocal)(e);
            }}
            className="space-y-6 py-4"
            id="attribute-form"
          >
            <Controller
              name="attributeId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <FieldLabel
                    htmlFor="attributeId"
                    className="col-span-1 text-right font-semibold"
                  >
                    Attribute
                  </FieldLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        const selectedAttr = attributesList.find(
                          (attr) => attr.id === val,
                        );
                        if (selectedAttr) {
                          form.setValue("attributeName", selectedAttr.name);
                        }
                        form.setValue("valueId", "");
                        form.setValue("valueName", "");
                      }}
                      value={field.value}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select attribute" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributesList.map((attr) => (
                          <SelectItem
                            key={attr.id}
                            value={attr.id}
                            disabled={
                              existingAttributeIds.includes(attr.id) &&
                              attr.id !== defaultValues?.attributeId
                            }
                          >
                            {attr.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
            <Controller
              name="valueId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <FieldLabel
                    htmlFor="valueId"
                    className="col-span-1 text-right font-semibold"
                  >
                    Value
                  </FieldLabel>
                  <div className="col-span-3">
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        const attr = attributesList.find(
                          (a) => a.id === selectedAttributeId,
                        );
                        const valObj = attr?.values.find((v) => v.id === val);
                        if (valObj) {
                          form.setValue("valueName", valObj.value);
                        }
                      }}
                      value={field.value}
                      disabled={!selectedAttributeId}
                    >
                      <SelectTrigger aria-invalid={fieldState.invalid}>
                        <SelectValue placeholder="Select value" />
                      </SelectTrigger>
                      <SelectContent>
                        {attributesList
                          .find((attr) => attr.id === selectedAttributeId)
                          ?.values.map((val) => (
                            <SelectItem key={val.id} value={val.id}>
                              {val.value}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </div>
                </Field>
              )}
            />
          </form>
        )}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form="attribute-form">
            {mode === "create" ? "Add" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
