import { auth } from "@/auth";
import { CategoryResponse, Product } from "@/types/types";
import NewProductForm from "@/app/(cms)/admin/products/new/NewProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await auth();
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/categories`, {
    headers: {
      authorization: `Bearer ${session?.accessToken}`,
      contentType: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch categories");
  }

  const categoriesData: CategoryResponse = await res.json();
  const categories = categoriesData.data;

  return (
    <div className={"h-full w-full space-y-10"}>
      <h1 className={"text-h2"}>Add Product</h1>
      <NewProductForm categories={categories} />
    </div>
  );
}
