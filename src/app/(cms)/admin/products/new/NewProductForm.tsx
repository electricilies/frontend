"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormValues, productSchema } from "@/lib/validators/product";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/types";
import { ProductAttributeDialog } from "@/app/(cms)/admin/products/new/_components/ProductAttributeDialog";

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
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-6"
    >
      <div className={"flex w-full gap-4"}>
        <div className={"flex w-3/5 flex-col gap-12"}>
          <div className="flex w-full gap-6">
            <Label htmlFor="name" className={"text-h4 w-fit"}>
              Name <span className={"text-red-600"}>*</span>
            </Label>
            <Input
              id="name"
              placeholder="Add Name"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div className={"w-full space-y-8"}>
            <div className={"flex items-center space-x-4"}>
              <h4 className={"text-h4"}>Attributes</h4>
              <ProductAttributeDialog
                mode={"create"}
                onSave={(data) => {
                  appendAttr(data);
                }}
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
                      {/* button placeholders */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col gap-2"></div>
    </form>
  );
}
