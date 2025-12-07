import { auth } from "@/auth";
import { Product, ProductResponse } from "@/types/types";
import { CustomPagination } from "@/app/_components/CustomPagination";
import Image from "next/image";
import ProductHeaderOptions from "@/app/(cms)/admin/products/_components/ProductHeaderOptions";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  const token = session?.accessToken;
  const params = await searchParams;
  const {
    page = "1",
    sort_price,
    sort_rating,
    min_price,
    max_price,
    rating,
    search,
  } = params;

  const productQueryParams = new URLSearchParams({
    page: page.toString(),
    limit: "10",
  });

  if (sort_price) productQueryParams.append("sort_price", sort_price as string);
  if (sort_rating)
    productQueryParams.append("sort_rating", sort_rating as string);
  if (min_price) productQueryParams.append("min_price", min_price as string);
  if (max_price) productQueryParams.append("max_price", max_price as string);
  if (rating) productQueryParams.append("rating", rating as string);
  if (search) productQueryParams.append("search", search as string);

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/products?${productQueryParams.toString()}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
        contentType: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!data.ok) {
    const err = await data.json();
    throw new Error(err.message || "Failed to fetch products");
  }

  const productsData: ProductResponse = await data.json();

  const getImageSrc = (product: Product) => {
    return product.images[0]?.url
      ? product.images[0].url
      : product.variants[0]?.images[0]?.url
        ? product.variants[0].images[0].url
        : "/images/fallbackProductImage.png";
  };

  return (
    <div className={"flex h-full flex-col gap-8"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-h2"}>Products List</h2>
        <ProductHeaderOptions />
      </div>
      {productsData ? (
        <>
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-sm">
            <thead>
              <tr className="text-table-head bg-gray-100 text-left">
                <th className="border-r border-gray-200 px-4 py-3">Name</th>
                <th className="border-r border-gray-200 px-4 py-3">Price</th>
                <th className="border-r border-gray-200 px-4 py-3">
                  Purchased
                </th>
                <th className="border-r border-gray-200 px-4 py-3">Rating</th>
                <th className="border-r border-gray-200 px-4 py-3">
                  Last Updated
                </th>
                <th className="border-r border-gray-200 px-4 py-3">
                  Cover Image
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-border-general text-table-body divide-y text-left">
              {productsData.data.map((product, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="border-border-general px-4 py-3">
                    {product.name}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {product.price}
                  </td>
                  <td className="gap-2 px-4 py-3 text-center">
                    {product.totalPurchase}
                  </td>
                  <td className="gap-2 px-4 py-3 text-center">
                    {product.rating}
                  </td>
                  <td className="gap-2 px-4 py-3">
                    {new Date(product.updatedAt).toLocaleString()}
                  </td>
                  <td className="gap-2 px-4 py-3 text-center">
                    <Image
                      src={getImageSrc(product)}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="mb-4 h-[100px] w-auto rounded-md object-contain"
                      unoptimized={true}
                    />
                  </td>
                  <td className="gap-2 px-4 py-3 text-center">a</td>
                </tr>
              ))}
            </tbody>
          </table>
          <CustomPagination totalPages={productsData.meta.totalPages} />
        </>
      ) : (
        <p className="text-h4 text-gray-500">No categories found.</p>
      )}
    </div>
  );
}
