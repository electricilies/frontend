import {
  OptionItemValues,
  VariantItemInput,
  VariantItemOutput,
  variantItemSchema,
} from "@/lib/validators/product";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, PlusCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Image from "next/image";
import { uploadImageToMinio } from "@/lib/services/upload-image";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ProductVariantDialogProps {
  mode: "create" | "edit";
  defaultValues?: VariantItemInput;
  onSave: (data: VariantItemOutput) => void;
  productOptions: OptionItemValues[];
  existingVariants: VariantItemInput[];
}

export function ProductVariantDialog({
  mode,
  defaultValues,
  onSave,
  productOptions,
  existingVariants,
}: ProductVariantDialogProps) {
  const session = useSession();
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<VariantItemInput, unknown, VariantItemOutput>({
    resolver: zodResolver(variantItemSchema),
    defaultValues: {
      sku: "",
      price: 0,
      quantity: 0,
      images: [],
      options: [],
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

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

  useEffect(() => {
    if (open) {
      if (mode === "create") {
        const generatedOptions = productOptions.map((option) => ({
          optionName: option.name,
          optionValue: option.values[0] || "",
        }));
        form.reset({
          sku: "",
          price: 0,
          quantity: 0,
          images: [],
          options: generatedOptions,
        });
      } else if (mode === "edit" && defaultValues) {
        form.reset(defaultValues);
      }
    } else {
      form.reset({
        sku: "",
        price: 0,
        quantity: 0,
        images: [],
        options: [],
      });
    }
  }, [open, mode, defaultValues, productOptions, form]);

  const handleSubmit = (data: VariantItemOutput) => {
    const isDuplicateOption = existingVariants.some((variant) => {
      return productOptions.every((_, index) => {
        return (
          variant.options?.[index]?.optionValue ===
          data.options?.[index]?.optionValue
        );
      });
    });
    if (isDuplicateOption) {
      toast.error(
        "Biến thể với các tùy chọn đã chọn đã tồn tại. Vui lòng chọn các tùy chọn khác.",
      );
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
      <DialogContent className={"w-fit min-w-[700px]"}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Variant" : "Edit Variant"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Tạo biến thể cho sản phẩm."
              : "Cập nhật biến thể của sản phẩm."}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            return form.handleSubmit(handleSubmit)(e);
          }}
          className={"space-y-6 py-4"}
          id={"variant-form"}
        >
          <div className={"text-h4"}>Options</div>
          {productOptions.map((option, index) => (
            <div key={index} className={"grid grid-cols-8 gap-16 px-8"}>
              <div className={"col-span-4 flex flex-col gap-4"}>
                <div className={"grid grid-cols-4 items-center gap-4"}>
                  <Label
                    htmlFor={`option-name-${index}`}
                    className={"col-span-1 font-semibold"}
                  >
                    Option
                  </Label>
                  <Input
                    disabled={true}
                    id={`option-name-${index}`}
                    value={option.name}
                    className={
                      "col-span-3 border-1 border-slate-300 bg-slate-200"
                    }
                  />
                </div>
              </div>
              <div className={"col-span-4 flex"}>
                <Controller
                  name={`options.${index}.optionValue`}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      className={"grid grid-cols-4 items-center gap-4"}
                    >
                      <FieldLabel
                        htmlFor={`option-value-${index}`}
                        className={"col-span-1 font-semibold"}
                      >
                        Value
                      </FieldLabel>
                      <div className={"col-span-3"}>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            aria-invalid={fieldState.invalid}
                            id={`option-value-${index}`}
                            className={"w-full"}
                          >
                            <SelectValue placeholder="Select option value" />
                          </SelectTrigger>
                          <SelectContent>
                            {option.values.map((value, valIndex) => (
                              <SelectItem value={value} key={valIndex}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </Field>
                  )}
                />
              </div>
            </div>
          ))}
          {/* images */}
          <div className={"images space-y-2"}>
            <div className={"flex items-center gap-4"}>
              <h4 className={"text-h4"}>Images</h4>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-black transition-colors hover:text-slate-600 disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <PlusCircle size={24} />
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
            <div className={"flex flex-wrap gap-4"}>
              {imageFields.map((field, index) => (
                <div key={field.id} className={"relative"}>
                  <Image
                    src={field.url}
                    alt={`Product Image ${index + 1}`}
                    width={150}
                    height={150}
                    className={"h-[150px] w-[150px] rounded-md object-contain"}
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
          </div>

          {/* SKU, Price, Quantity */}
          <h4 className={"text-h4"}>Others</h4>
          <div className={"grid grid-cols-8 grid-rows-2 gap-8"}>
            <div className={"col-span-4 flex flex-col gap-4"}>
              <Controller
                name="sku"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={"grid grid-cols-4 items-center gap-4"}
                  >
                    <FieldLabel
                      htmlFor="sku"
                      className={"col-span-1 font-semibold"}
                    >
                      SKU
                    </FieldLabel>
                    <div className={"col-span-3"}>
                      <Input
                        id="sku"
                        placeholder="SKU"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        className={"col-span-4"}
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className={"col-span-4 flex flex-col gap-4"}>
              <Controller
                name="price"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={"grid grid-cols-4 items-center gap-4"}
                  >
                    <FieldLabel
                      htmlFor="price"
                      className={"col-span-1 font-semibold"}
                    >
                      Price
                    </FieldLabel>
                    <div className={"col-span-3"}>
                      <Input
                        type="number"
                        id="price"
                        placeholder="Price"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        className={"col-span-4"}
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            </div>
            <div className={"col-span-4 flex flex-col gap-4"}>
              <Controller
                name="quantity"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className={"grid grid-cols-4 items-center gap-4"}
                  >
                    <FieldLabel
                      htmlFor="quantity"
                      className={"col-span-1 font-semibold"}
                    >
                      Quantity
                    </FieldLabel>
                    <div className={"col-span-3"}>
                      <Input
                        type="number"
                        id="quantity"
                        placeholder="Quantity"
                        {...field}
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError
                        className={"col-span-4"}
                        errors={[fieldState.error]}
                      />
                    )}
                  </Field>
                )}
              />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" form="variant-form">
            {mode === "create" ? "Create Variant" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
