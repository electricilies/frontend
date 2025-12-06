import Image from "next/image";
import CategorySidebar from "@/app/(storefront)/_components/CategorySidebar/CategorySidebar";
import { CategoryResponse, ProductResponse } from "@/types/types";
import ProductCard from "@/app/(storefront)/_components/ProductCard/ProductCard";
import BestSeller from "@/app/(storefront)/_components/BestSeller/BestSeller";
import CategoriesProductSection from "@/app/(storefront)/_components/CategoriesProductSection/CategoriesProductSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const categoriesData = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  if (!categoriesData.ok) {
    throw new Error("Failed to fetch categories");
  }
  const categories: CategoryResponse = await categoriesData.json();

  return (
    <div className="flex w-3/4 min-w-[1200px] flex-col justify-between gap-12 py-10 text-black">
      <div className="flex h-[calc(100vh/3*2)] w-full justify-center gap-5">
        <CategorySidebar categories={categories.data} />
        <div
          className={
            "flex grow items-center justify-center rounded-lg border-1 border-slate-400 bg-slate-100 px-10"
          }
        >
          <div className={"flex shrink-0 flex-col items-center gap-8"}>
            <div className={"flex flex-col gap-3"}>
              <div className={"text-h1 font-bold"}>40% OFF</div>
              <div className={"text-h2"}>watch</div>
            </div>
            <div
              className={
                "bg-tertiary text-h2 w-full rounded-lg p-5 text-center text-white"
              }
            >
              Mua ngay
            </div>
          </div>
          <div
            className={
              "relative flex h-full max-h-[600px] w-full max-w-[600px]"
            }
          >
            <Image
              src="/images/watchHero.png"
              alt={"watchHero"}
              fill={true}
              unoptimized={true}
              className={""}
            />
          </div>
        </div>
      </div>
      <BestSeller />
      <CategoriesProductSection categories={categories.data} />
    </div>
  );
}
