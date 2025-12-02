import { Product } from "@/types/types";
import { ProductDetailGallery } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailGallery";
import { ProductDetailHeader } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailHeader";
import { ProductDetailVariant } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailVariant";
import { Suspense } from "react";
import { Loader } from "lucide-react";

interface ProductDetailSectionProps {
  product: Product;
}

export function ProductDetailSection({ product }: ProductDetailSectionProps) {
  const handleAddToCart = async (
    productId: string,
    productVariantId: string,
    quantity: number = 1,
  ) => {
    let cartExists = false;

    const cartResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/carts/me`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (cartResponse.ok) {
      cartExists = true;
    }
    if (!cartExists) {
      const createCartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/carts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          /*
          body: JSON.stringify({
            "userId":
          }),
           */
        },
      );
      if (!createCartResponse.ok) {
        console.error("Error creating cart");
        return;
      }
    }
  };
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
        <Suspense fallback={<Loader />}>
          <ProductDetailVariant product={product} />
        </Suspense>
      </div>
    </section>
  );
}
