import { Category, Product, ProductResponse } from "@/types/types";
import ProductSlide from "@/app/(storefront)/_components/ProductSlide/ProductSlide";

interface CategoryProductSlideProps {
  category: Category;
}

export default async function CategoryProductSlide({
  category,
}: CategoryProductSlideProps) {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products?category_ids=%22${category.id}%22&limit=20&sort_rating=desc`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  if (!data.ok) {
    throw new Error("Failed to fetch category products");
  }
  const products: ProductResponse = await data.json();

  return (
    <div className={"w-full"}>
      <h2 className={"text-h2"}>{category.name}</h2>
      {products.data.length > 0 ? (
        <ProductSlide products={products.data} />
      ) : (
        <div className="text-h4 flex w-full justify-center text-slate-500 italic">
          Chưa có hàng
        </div>
      )}
    </div>
  );
}
