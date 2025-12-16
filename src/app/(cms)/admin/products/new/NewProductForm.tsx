"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductFormValues, productSchema } from "@/lib/validators/product";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/types";
import { ProductAttributeDialog } from "@/app/(cms)/admin/products/new/_components/Attribute/ProductAttributeDialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { ProductOptionDialog } from "@/app/(cms)/admin/products/new/_components/Option/ProductOptionDialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { uploadImageToMinio } from "@/lib/services/upload-image";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ProductVariantDialog } from "@/app/(cms)/admin/products/new/_components/Variant/ProductVariantDialog";
import { transformProductData } from "@/lib/validators/transformProductData";

interface NewProductFormProps {
  categories: Category[];
}

export default function NewProductForm({ categories }: NewProductFormProps) {
  const [isEmptyImages, setIsEmptyImages] = useState<boolean>(false);
  const [isVariantExist, setIsVariantExist] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const session = useSession();

  const form = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      attributes: [],
      options: [],
      variants: [],
      description: "",
      images: [],
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

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  // thông báo toast.info khi variantFields từ 0 thành 1
  const prevVariantCountRef = useRef<number>(variantFields.length);
  useEffect(() => {
    if (prevVariantCountRef.current === 0 && variantFields.length > 0) {
      toast.info(
        "Khi đã có variant, bạn không thể chỉnh sửa hoặc xóa options nữa.",
      );
      setIsVariantExist(true);
    } else if (variantFields.length === 0) {
      setIsVariantExist(false);
    }
    prevVariantCountRef.current = variantFields.length;
  }, [variantFields]);

  const onSubmit = async (data: ProductFormValues) => {
    if (data.images.length === 0) {
      setIsEmptyImages(true);
      return;
    } else {
      setIsEmptyImages(false);
    }
    const payload = transformProductData(data);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken || ""}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const err = await response.json();
      toast.error(err.message || "Đã xảy ra lỗi khi tạo sản phẩm");
      // remove all uploaded images in form
      imageFields.forEach((image, index) => {
        removeImage(index);
      });
      variantFields.forEach((variant, index) => {
        if (variant.images && variant.images.length > 0) {
          removeVariant(index);
        }
      });
      return;
    }

    const createdProduct = await response.json();
    toast.success("Tạo sản phẩm thành công");
    setTimeout(() => {
      window.open(`/products/${createdProduct.id}`, "_blank");
    });
    form.reset();
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const { key, url } = await uploadImageToMinio(
          file,
          session.data?.accessToken || "",
        );
        return {
          url,
          key,
          order: 0,
        };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      appendImage(uploadedImages);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên server:", error);
    } finally {
      setIsUploading(false);
      // reset input - allow uploading same file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <form
      id={"new-product-form"}
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-10"
    >
      <div className={"flex w-full gap-30"}>
        <div className={"flex w-3/5 flex-col gap-10"}>
          {/* name */}
          <Controller
            name={"name"}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="flex w-full">
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

          {/* attributes*/}
          <div className={"w-full space-y-2"}>
            <div className={"flex items-center space-x-2"}>
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
                    <td className="flex px-4 py-3 text-center">
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
                        id={"delete-attribute"}
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
        <div className={"flex w-2/5 flex-col gap-10"}>
          {/* category */}
          <Controller
            name={"categoryId"}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field
                orientation={"responsive"}
                data-invalid={fieldState.invalid}
                className="flex"
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

          {/* options */}
          <div className={"w-full space-y-2"}>
            <div className={"flex items-center space-x-2"}>
              <h4 className={"text-h4"}>Options</h4>
              {!isVariantExist && (
                <ProductOptionDialog
                  mode={"create"}
                  onSave={(data) => {
                    appendOption(data);
                  }}
                />
              )}
            </div>
            <table
              id={"option-table"}
              className={"w-full border-collapse overflow-hidden shadow-sm"}
            >
              <thead>
                <tr className="text-table-head bg-gray-100 text-left">
                  <th className="border-r border-gray-200 px-4 py-3">Option</th>
                  <th className="border-r border-gray-200 px-4 py-3">Values</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-border-general text-table-body divide-y text-left">
                {optionFields.map((field, index) => (
                  <tr
                    key={field.id}
                    className="transition-colors duration-200 hover:bg-gray-50"
                  >
                    <td className="border-border-general px-4 py-3">
                      {field.name}
                    </td>
                    <td className="border-border-general px-4 py-3">
                      {field.values.join(", ")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {!isVariantExist && (
                        <>
                          <ProductOptionDialog
                            mode={"edit"}
                            defaultValues={{
                              name: field.name,
                              values: field.values,
                            }}
                            onSave={(data) => {
                              updateOption(index, data);
                            }}
                          />
                          <button
                            id={"delete-option"}
                            type={"button"}
                            className={`ml-2 rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600`}
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="size-6" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* description */}
      <Controller
        name={"description"}
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            className="flex w-full flex-col"
            data-invalid={fieldState.invalid}
          >
            <FieldLabel htmlFor="description" className={"text-h4"}>
              Description
            </FieldLabel>
            <Textarea
              {...field}
              id={"description"}
              className={"h-40 resize-none"}
              placeholder="Add description"
              aria-invalid={fieldState.invalid}
            />
          </Field>
        )}
      />

      {/* images */}
      <div className={"images space-y-2"}>
        <div className={"flex items-center space-x-4"}>
          <h4 className={"text-h4"}>Images</h4>
          <button
            id={"upload-image-button"}
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-black transition-colors hover:text-slate-600 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <PlusCircle size={20} />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
          />
        </div>
        <Controller
          name={"images"}
          control={form.control}
          render={({ fieldState }) => (
            <>
              <div className={"flex flex-wrap gap-4"}>
                {imageFields.map((field, index) => (
                  <div key={field.id} className={"relative"}>
                    <Image
                      src={field.url}
                      alt={`Product Image ${index + 1}`}
                      width={150}
                      height={150}
                      className={
                        "h-[150px] w-[150px] rounded-md object-contain"
                      }
                    />
                    <button
                      type={"button"}
                      className={
                        "absolute top-1 right-1 rounded-full bg-white p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
                      }
                      onClick={() => removeImage(index)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        />
        {isEmptyImages && (
          <p className={"text-red-700"}>
            Thêm ít nhất một hình ảnh cho sản phẩm
          </p>
        )}
      </div>

      {/* variants */}
      <div className={"w-full space-y-2"}>
        <div className={"flex items-center space-x-2"}>
          <h4 className={"text-h4"}>Variants</h4>
          <ProductVariantDialog
            mode={"create"}
            onSave={(data) => {
              appendVariant(data);
            }}
            productOptions={optionFields}
            existingVariants={variantFields}
          />
        </div>
        <Controller
          name={"variants"}
          control={form.control}
          render={({ fieldState }) => (
            <>
              <table
                className={"w-4/5 border-collapse overflow-hidden shadow-sm"}
              >
                <thead>
                  <tr className="text-table-head bg-gray-100 text-left">
                    <th className="border-r border-gray-200 px-4 py-3">
                      Option Values
                    </th>
                    <th className="border-r border-gray-200 px-4 py-3">
                      Price
                    </th>
                    <th className="border-r border-gray-200 px-4 py-3">
                      Quantity
                    </th>
                    <th className="border-r border-gray-200 px-4 py-3">SKU</th>
                    <th className="border-r border-gray-200 px-4 py-3">
                      Cover Image
                    </th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-border-general text-table-body divide-y text-left">
                  {variantFields.map((field, index) => (
                    <tr
                      key={field.id}
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      <td className="border-border-general px-4 py-3">
                        {field.options?.map((option) => (
                          <div key={option.optionName}>
                            <span className={"font-bold"}>
                              {option.optionName}
                            </span>
                            : {option.optionValue}
                          </div>
                        ))}
                      </td>
                      <td className="border-border-general px-4 py-3">
                        {field.price}
                      </td>
                      <td className="border-border-general px-4 py-3">
                        {field.quantity}
                      </td>
                      <td className="border-border-general px-4 py-3">
                        {field.sku}
                      </td>
                      <td className="gap-2 px-4 py-3 text-center">
                        <Image
                          src={
                            field.images && field.images.length > 0
                              ? field.images[0].url
                              : "/images/fallbackProductImage.png"
                          }
                          alt={`Variant Image ${index + 1}`}
                          width={100}
                          height={100}
                          className="mb-4 h-[100px] w-[100px] rounded-md object-contain"
                          unoptimized={true}
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <ProductVariantDialog
                          mode={"edit"}
                          defaultValues={{
                            sku: field.sku,
                            price: field.price,
                            quantity: field.quantity,
                            images: field.images,
                            options: field.options,
                          }}
                          productOptions={optionFields}
                          existingVariants={variantFields.filter(
                            (_, i) => i !== index,
                          )}
                          onSave={(data) => {
                            updateVariant(index, data);
                          }}
                        />
                        <button
                          id={"delete-variant"}
                          type={"button"}
                          className={`ml-2 rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600`}
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="size-6" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </>
          )}
        />
        <div className={"text-large mt-4 w-full text-right"}>
          <Button
            variant={"outline"}
            size={"lg"}
            type={"button"}
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button
            className={"ml-4"}
            size={"lg"}
            type={"submit"}
            form={"new-product-form"}
          >
            Create Product
          </Button>
        </div>
      </div>
    </form>
  );
}
