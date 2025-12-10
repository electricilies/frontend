import { auth } from "@/auth";
import { OrderResponse } from "@/types/types";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  const token = session?.accessToken;

  const data = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  let ordersData: OrderResponse | null = null;
  try {
    if (!data.ok) {
      const err = await data.json();
      throw new Error(err.message || "Failed to fetch orders");
    }
    ordersData = await data.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  return (
    <div className={"flex h-full flex-col gap-8"}>
      <div className={"flex justify-between"}>
        <h2 className={"text-h2"}>Orders List</h2>
      </div>
      {ordersData ? (
        <>
          <table className="w-full border-collapse overflow-hidden rounded-lg shadow-sm">
            <thead>
              <tr className="text-table-head bg-gray-100 text-left">
                <th className="border-r border-gray-200 px-4 py-3">Name</th>
                <th className="border-r border-gray-200 px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Payment</th>
                <th className="px-4 py-3 text-center">Total</th>
                <th className="px-4 py-3 text-center">Date Created</th>
              </tr>
            </thead>

            <tbody className="divide-border-general text-table-body divide-y text-left">
              {ordersData.data.map((order, index) => (
                <tr
                  key={index}
                  className="transition-colors duration-200 hover:bg-gray-50"
                >
                  <td className="border-border-general px-4 py-3">
                    {order.recipent_name}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {order.status}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {order.provider}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {order.items
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      )
                      .toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                  </td>
                  <td className="border-border-general px-4 py-3">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p className="text-h4 text-gray-500">No attributes found.</p>
      )}
    </div>
  );
}
