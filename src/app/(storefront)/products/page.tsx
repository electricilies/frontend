import { Category, CategoryResponse, ProductResponse } from "@/types/types";
import { CustomBreadcrumb } from "@/app/_components/CustomBreadcrumb";
import ProductCard from "@/app/(storefront)/_components/ProductCard/ProductCard";
import { CustomPagination } from "@/app/_components/CustomPagination";
import { useSession } from "next-auth/react";
import SortButton from "@/app/(storefront)/products/_components/SortButton";
import FilterButton from "@/app/(storefront)/products/_components/FilterButton";

export const dynamic = "force-dynamic";

interface ProductListingPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductListingPage({
  searchParams,
}: ProductListingPageProps) {
  const params = await searchParams;
  const {
    page = "1",
    limit = "20",
    sort_price,
    sort_rating,
    category_ids,
    product_ids,
    min_price,
    max_price,
    rating,
    search,
  } = params;

  const exampleCategoryIds = [
    "00000000-0000-7000-0000-000000028670",
    "00000000-0000-7000-0000-000000026568",
  ];

  let categories: Category[] = [];
  const normalizeParam = (param: string | string[] | undefined) => {
    if (!param) return "";
    return Array.isArray(param) ? param.join(",") : param;
  };

  if (category_ids) {
    const categoryIdsStr = normalizeParam(category_ids);
    const categoryParamsArray = categoryIdsStr.split(",");
    const categoryUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/categories`;
    try {
      const categoryData = await fetch(categoryUrl, { cache: "no-store" });
      if (categoryData.ok) {
        const categoryResponse: CategoryResponse = await categoryData.json();
        categories = categoryResponse.data.filter((category) =>
          categoryParamsArray.includes(category.id),
        );
      } else {
        console.error("Failed to fetch categories:", categoryData.statusText);
      }
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  }

  const breadcrumbItems = [{ label: "Sản phẩm", href: "/products" }];

  const productQueryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (sort_price) productQueryParams.append("sort_price", sort_price as string);
  if (sort_rating)
    productQueryParams.append("sort_rating", sort_rating as string);
  if (category_ids) {
    productQueryParams.append("category_ids", normalizeParam(category_ids));
  }
  // else { productQueryParams.append('category_ids', exampleCategoryIds.join(',')); }

  if (product_ids)
    productQueryParams.append("product_ids", normalizeParam(product_ids));
  if (min_price) productQueryParams.append("min_price", min_price as string);
  if (max_price) productQueryParams.append("max_price", max_price as string);
  if (rating) productQueryParams.append("rating", rating as string);
  if (search) productQueryParams.append("search", search as string);

  let products: ProductResponse = {
    data: [],
    meta: {
      totalItems: 0,
      pageItems: 0,
      itemsPerPage: 0,
      totalPages: 0,
      currentPage: 0,
    },
  };
  const productFetchUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products?${productQueryParams.toString()}`;
  try {
    const productData = await fetch(productFetchUrl, { cache: "no-store" });
    if (productData.ok) {
      products = await productData.json();
    } else {
      console.error("Failed to fetch products:", productData.statusText);
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
  }

  return (
    <div
      className={
        "mx-auto flex w-full max-w-7xl flex-col justify-center gap-10 p-4"
      }
    >
      <CustomBreadcrumb items={breadcrumbItems} />
      <h2 className="text-h2">
        {categories.length > 0
          ? categories.map((cat) => cat.name).join(", ")
          : "Tất cả sản phẩm"}
      </h2>
      <div className={"flex w-full justify-between"}>
        <SortButton />
        <FilterButton />
      </div>
      <div
        className={
          "grid w-full grid-cols-2 items-center justify-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        }
      >
        {products.data.length > 0 ? (
          products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className={"text-h4 text-center text-slate-500"}>
            Không có sản phẩm nào
          </div>
        )}
      </div>
      <CustomPagination totalPages={products.meta.totalPages} />
    </div>
  );
}
