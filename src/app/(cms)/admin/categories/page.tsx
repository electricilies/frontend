import CategoryHeaderOptions from "@/app/(cms)/admin/categories/_components/CategoryHeaderOptions";
import { auth } from "@/auth";
import { CategoryResponse } from "@/types/types";
import CategoryTableActions from "@/app/(cms)/admin/categories/_components/CategoryTableActions";
import { CustomPagination } from "@/app/_components/CustomPagination";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const session = await auth();
  const token = session?.accessToken;
  const { page = "1", limit = "10", search } = params;
  const categoryQueryParams = new URLSearchParams({
    page: page.toString(),
    search: search ? search.toString() : "",
    limit: "10",
  });

  if (search) {
    categoryQueryParams.append("search", search.toString());
  }

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/categories?${categoryQueryParams.toString()}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
  if (!data.ok) {
    const err = await data.json();
    throw new Error(err.message || "Failed to fetch categories");
  }
  const categoriesData: CategoryResponse = await data.json();

  return (
    <div className={"flex h-full flex-col gap-8"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-h2"}>Categories List</h2>
        <CategoryHeaderOptions />
      </div>
      {categoriesData ? (
        <>
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-sm">
            <thead>
              <tr className="text-table-head bg-gray-100 text-left">
                <th className="border-r border-gray-200 px-4 py-3">Name</th>
                <th className="border-r border-gray-200 px-4 py-3">
                  Created at
                </th>
                <th className="border-r border-gray-200 px-4 py-3">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-border-general text-table-body divide-y text-left">
              {categoriesData.data.map((cat, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="border-border-general px-4 py-3">
                    {cat.name}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {new Date(cat.createdAt).toLocaleString()}
                  </td>
                  <td className="gap-2 px-4 py-3">
                    {new Date(cat.updatedAt).toLocaleString()}
                  </td>
                  <td className="gap-2 px-4 py-3 text-center">
                    <CategoryTableActions category={cat} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <CustomPagination totalPages={categoriesData.meta.totalPages} />
        </>
      ) : (
        <p className="text-h4 text-gray-500">No categories found.</p>
      )}
    </div>
  );
}
