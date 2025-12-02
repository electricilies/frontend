import { ProductDetailBreadcrumb } from "@/app/(storefront)/products/[id]/_components/ProductDetailBreadcrumb/ProductDetailBreadcrumb";
import { Product, ProductResponse } from "@/types/types";
import { ProductDetailSection } from "@/app/(storefront)/products/[id]/_components/ProductDetailSection/ProductDetailSection";
import { ProductDescriptionSection } from "@/app/(storefront)/products/[id]/_components/ProductDescriptionSection/ProductDescriptionSection";

export const dynamic = "force-dynamic";

interface ProductDetailPageProps {
  params: { id: string };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products?product_ids=${id}`,
  );
  if (!data.ok) {
    const msg = await data.json();
    console.error("Error fetching product data:", msg.message);
    throw new Error("Failed to fetch product data");
  }
  const productData: ProductResponse = await data.json();
  const product: Product = productData.data[0];

  return (
    <main
      className={
        "mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-10 p-4"
      }
    >
      <ProductDetailBreadcrumb product={product} />
      <ProductDetailSection product={product} />
      <ProductDescriptionSection
        description={product.description}
        attributes={product.attributes}
      />
    </main>
  );
}
