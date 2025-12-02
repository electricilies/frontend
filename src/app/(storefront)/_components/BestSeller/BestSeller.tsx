import { Product, ProductResponse } from "@/types/types";
import ProductSlide from "@/app/(storefront)/_components/ProductSlide/ProductSlide";

export default async function BestSeller() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products?limit=10&sort_rating=desc`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!data.ok) {
    throw new Error("Failed to fetch best seller products");
  }
  const products: ProductResponse = await data.json();
  return (
    <div className={"w-full"}>
      <h2 className={"text-h2"}>Bán chạy nhất</h2>
      <ProductSlide products={products.data} />
    </div>
  );
}
