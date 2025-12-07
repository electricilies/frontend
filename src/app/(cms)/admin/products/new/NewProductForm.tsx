"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormValues, productSchema } from "@/lib/validators/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/types";
import { ProductAttributeDialog } from "@/app/(cms)/admin/products/new/_components/Attribute/ProductAttributeDialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewProductFormProps {
  categories: Category[];
}

export default function NewProductForm({ categories }: NewProductFormProps) {
  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      attributes: [],
      options: [],
      variants: [],
      description: "",
    },
  });

  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
    update: updateAttr,
  } = useFieldArray({
    control: form.control,
    name: "attributes",
  });

  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    update: updateOption,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
    update: updateVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
  };

  return (
    <form
      id={"new-product-form"}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
    >
      <div className={"flex w-full gap-30"}>
        <div className={"flex w-3/5 flex-col gap-12"}>
          <Controller
            name={"name"}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="flex w-full gap-6"
              >
                <FieldLabel htmlFor="name" className={"text-h4 w-fit"}>
                  Name <span className={"text-red-600"}>*</span>
                </FieldLabel>
                <Input
                  {...field}
                  aria-invalid={fieldState.invalid}
                  className={"w-full max-w-[350px]"}
                  placeholder="Add Name"
                  id="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <div className={"w-full space-y-8"}>
            <div className={"flex items-center space-x-4"}>
              <h4 className={"text-h4"}>Attributes</h4>
              <ProductAttributeDialog
                mode={"create"}
                onSave={(data) => {
                  appendAttr(data);
                }}
                existingAttributeIds={attrFields.map(
                  (field) => field.attributeId,
                )}
              />
            </div>
            <table
              className={"w-full border-collapse overflow-hidden shadow-sm"}
            >
              <thead>
                <tr className="text-table-head bg-gray-100 text-left">
                  <th className="border-r border-gray-200 px-4 py-3">
                    Attribute
                  </th>
                  <th className="border-r border-gray-200 px-4 py-3">Value</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border-general text-table-body divide-y text-left">
                {attrFields.map((field, index) => (
                  <tr
                    key={field.id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="border-border-general px-4 py-3">
                      {field.attributeName}
                    </td>
                    <td className="border-border-general px-4 py-3">
                      {field.valueName}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <ProductAttributeDialog
                        mode={"edit"}
                        defaultValues={{
                          attributeId: field.attributeId,
                          attributeName: field.attributeName,
                          valueId: field.valueId,
                          valueName: field.valueName,
                        }}
                        onSave={(data) => {
                          updateAttr(index, data);
                        }}
                        existingAttributeIds={attrFields.map(
                          (field) => field.attributeId,
                        )}
                      />
                      <button
                        type={"button"}
                        className={`ml-2 rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600`}
                        onClick={() => removeAttr(index)}
                      >
                        <Trash2 className="size-6" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={"flex w-2/5 flex-col gap-6"}>
          <Controller
            name={"categoryId"}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation={"responsive"}
                data-invalid={fieldState.invalid}
                className="flex gap-6"
              >
                <FieldLabel htmlFor="categoryId" className={"text-h4 w-fit"}>
                  Category <span className={"text-red-600"}>*</span>
                </FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    aria-invalid={fieldState.invalid}
                    className={"w-full"}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-2"></div>
    </form>
  );
}
