import { Cart } from "@/types/types";
import { auth } from "@/auth";
import CartClient from "@/app/(storefront)/cart/_components/CartClient";

export default async function CartPage() {
  const session = await auth();
  const token = session?.accessToken;
  const userId = session?.user?.id;

  let cartData: Cart;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/carts/me`, {
    headers: {
      authorization: `Bearer ${token}`,
      contentType: "application/json",
    },
    cache: "no-store",
  });

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
  return <CartClient cartData={cartData} />;
}
