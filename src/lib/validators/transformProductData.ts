import { ProductFormValues } from "@/lib/validators/product";

interface ProductPayload {
  name: string;
  description: string;
  categoryId: string;
  images: { key: string; order: number }[];
  attributes: { attributeId: string; valueId: string }[];
  options: { name: string; values: string[] }[];
  variants: {
    sku: string;
    price: number;
    quantity: number;
    images: { key: string; order: number }[];
    options: { name: string; value: string }[];
  }[];
}

export const transformProductData = (
  data: ProductFormValues,
): ProductPayload => {
  return {
    name: data.name,
    description: data.description || "",
    categoryId: data.categoryId,
    images: data.images
      ? data.images.map((img, index) => ({
          key: img.key,
          order: index + 1,
        }))
      : [],
    attributes: data.attributes
      ? data.attributes.map((attr) => ({
          attributeId: attr.attributeId,
          valueId: attr.valueId,
        }))
      : [],
    options: data.options
      ? data.options.map((opt) => ({
          name: opt.name,
          values: opt.values,
        }))
      : [],
    variants: data.variants
      ? data.variants.map((variant) => {
          return {
            sku: variant.sku,
            price: variant.price,
            quantity: variant.quantity,
            images: variant.images
              ? variant.images.map((img, index) => ({
                  key: img.key,
                  order: index + 1, // min = 1
                }))
              : [],
            options: variant.options
              ? variant.options.map((opt) => ({
                  name: opt.optionName,
                  value: opt.optionValue,
                }))
              : [],
          };
        })
      : [],
  };
};
