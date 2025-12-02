import { Product } from "@/types/types";
import { ProductDetailGallery } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailGallery";
import { ProductDetailHeader } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailHeader";
import { ProductDetailVariant } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailVariant";

interface ProductDetailSectionProps {
  product: Product;
}

export function ProductDetailSection({ product }: ProductDetailSectionProps) {
  return (
    <section className="flex w-full flex-col gap-10 lg:flex-row">
      <ProductDetailGallery
        product={product}
        selectedVariant={product.variants[0]}
      />
      <div className={"flex w-full flex-col gap-10"}>
        <ProductDetailHeader
          name={product.name}
          rating={product.rating}
          purchaseCount={product.totalPurchase}
        />
        <ProductDetailVariant product={product} />
      </div>
    </section>
  );
}
