import AttributeHeaderOptions from "@/app/(cms)/admin/attributes/_components/AttributeHeaderOptions";
import { toast } from "sonner";
import { getErrorMessage } from "@/app/lib/utils";
import { auth } from "@/auth";
import { AttributeResponse } from "@/types/types";
import { EditButton } from "@/app/(cms)/_components/EditButton/EditButton";
import AttributeTableActions from "@/app/(cms)/admin/attributes/_components/AttributeTableActions";

export default async function AttributesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const session = await auth();
  const token = session?.accessToken;
  const { page = "1", limit = "10", search } = params;
  const attributeQueryParams = new URLSearchParams({
    page: page.toString(),
    search: search ? search.toString() : "",
    limit: "10",
  });

  if (search) {
    attributeQueryParams.append("search", search.toString());
  }

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/attributes?${attributeQueryParams.toString()}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );
  let attributesData: AttributeResponse | null = null;
  try {
    if (!data.ok) {
      const err = await data.json();
      throw new Error(err.message || "Failed to fetch attributes");
    }
    attributesData = await data.json();
  } catch (error) {
    toast.error(getErrorMessage(error));
  }

  return (
    <div className={"flex h-full flex-col gap-8"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-h2"}>Attributes List</h2>
        <AttributeHeaderOptions />
      </div>
      {attributesData ? (
        <table className="w-full border-collapse overflow-hidden rounded-lg shadow-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-[16px] font-bold text-gray-700">
              <th className="border-r border-gray-200 px-4 py-3">Code</th>
              <th className="border-r border-gray-200 px-4 py-3">Name</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {attributesData.data.map((attr, index) => (
              <tr
                key={index}
                className="transition-colors duration-200 hover:bg-gray-50"
              >
                <td className="border-gray-100 px-4 py-3 text-center">
                  {attr.code}
                </td>
                <td className="border-gray-100 px-4 py-3 text-center">
                  {attr.name}
                </td>
                <td className="gap-3 px-4 py-3 text-center">
                  <AttributeTableActions attribute={attr} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-h4 text-gray-500">No attributes found.</p>
      )}
    </div>
  );
}
