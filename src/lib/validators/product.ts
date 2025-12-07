import { z } from "zod";

export const imageSchema = z.object({
  url: z.string().url("URL hình ảnh không hợp lệ"),
  key: z.string().min(1, "Key ảnh bắt buộc"),
  order: z.coerce.number().default(0),
});

export const attributeItemSchema = z.object({
  attributeId: z.string().min(1, "Chọn thuộc tính"),
  attributeName: z.string(),
  valueId: z.string().min(1, "Chọn giá trị thuộc tính"),
  valueName: z.string(),
});

export const optionItemSchema = z.object({
  name: z.string().min(1, "Tên tùy chọn không được để trống"),
  values: z
    .array(z.string().min(1, "Giá trị tùy chọn không được để trống"))
    .min(1, "Phải có ít nhất một giá trị tùy chọn"),
});

export const variantItemSchema = z.object({
  sku: z.string().min(1, "SKU không được để trống"),
  // https://github.com/colinhacks/zod/issues/5010 - issue when coerce gets type unknown
  price: z.coerce.number<string>().min(0, "Giá phải lớn hơn hoặc bằng 0"),
  quantity: z.coerce
    .number<string>()
    .min(0, "Số lượng phải lớn hơn hoặc bằng 0"),
  images: z.array(imageSchema).optional().default([]),
  options: z
    .array(
      z.object({
        optionName: z.string(),
        optionValue: z.string(),
      }),
    )
    .optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được để trống"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Chọn danh mục sản phẩm"),
  images: z.array(imageSchema).optional(),
  attributes: z.array(attributeItemSchema).optional().default([]),
  options: z.array(optionItemSchema).optional().default([]),
  variants: z.array(variantItemSchema).default([]),
});

export type ImageValues = z.infer<typeof imageSchema>;
export type AttributeItemValues = z.infer<typeof attributeItemSchema>;
export type OptionItemValues = z.infer<typeof optionItemSchema>;
export type VariantItemValues = z.infer<typeof variantItemSchema>;
export type VariantItemInput = z.input<typeof variantItemSchema>;
export type VariantItemOutput = z.output<typeof variantItemSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
