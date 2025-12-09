import { auth } from "@/auth";
import { Cart } from "@/types/types";
import { CustomBreadcrumb } from "@/app/_components/CustomBreadcrumb";
import { OrderItem } from "@/app/context";
import { CartItemCard } from "@/app/(storefront)/cart/_components/CartItemCard";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await auth();
  const token = session?.accessToken;
  const userId = session?.user?.id;
  const currentOrderItems: OrderItem[] = [];

  const appendOrderItem = async (item: OrderItem) => {
    "use server";
    if (
      !currentOrderItems.find(
        (oi) =>
          oi.productId === item.productId &&
          oi.productVariantId === item.productVariantId,
      )
    ) {
      currentOrderItems.push(item);
    }
  };

  const removeOrderItem = async (item: OrderItem) => {
    "use server";
    const index = currentOrderItems.findIndex(
      (oi) =>
        oi.productId === item.productId &&
        oi.productVariantId === item.productVariantId,
    );
    if (index !== -1) {
      currentOrderItems.splice(index, 1);
    }
  };

  console.log(session);
  let cartData: Cart;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/carts/me`, {
    headers: {
      authorization: `Bearer ${token}`,
      contentType: "application/json",
    },
    cache: "no-store",
  });
  console.log(res);

  if (res.status === 404) {
    // create new cart for user
    const createRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/carts`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!createRes.ok) {
      const err = await createRes.json();
      throw new Error(err.message || "Failed to create cart");
    }

    cartData = await createRes.json();
  } else {
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to fetch cart");
    }

    cartData = await res.json();
  }

  const cartId = cartData.id;
  const updateItemQuantity = async (itemId: string, quantity: number) => {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/carts/${cartId}/item/${itemId}`,
      {
        method: "PATCH",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      },
    );
  };

  const removeCartItem = async (itemId: string) => {
    "use server";
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/carts/${cartId}/item/${itemId}`,
      {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
  };

  return (
    <div className={"mx-auto w-full max-w-7xl space-y-10 p-4"}>
      <CustomBreadcrumb items={[{ label: "Giỏ hàng", href: "/cart" }]} />
      <h2 className={"text-h2"}> Giỏ hàng </h2>
      <div className={"flex justify-between gap-6"}>
        <div className={"flex flex-grow flex-col gap-4"}>
          {cartData.items.length === 0 ? (
            <p>Giỏ hàng của bạn đang trống.</p>
          ) : (
            cartData.items.map((item) => (
              <CartItemCard
                item={item}
                appendOrderItem={appendOrderItem}
                removeOrderItem={removeOrderItem}
                updateItemQuantity={updateItemQuantity}
                removeCartItem={removeCartItem}
                key={item.id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
