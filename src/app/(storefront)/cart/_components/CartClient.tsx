"use client";
import { CustomBreadcrumb } from "@/app/_components/CustomBreadcrumb";
import { CartItemCard } from "@/app/(storefront)/cart/_components/CartItemCard";
import { OrderSummary } from "@/app/(storefront)/cart/_components/OrderSummary";
import { OrderItem } from "@/app/context/OrderContext";
import { Cart } from "@/types/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CartButtons from "@/app/(storefront)/cart/_components/CartButtons";

interface CartClientProps {
  cartData: Cart;
}

export default function CartClient({ cartData }: CartClientProps) {
  const router = useRouter();
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const cartId = cartData.id;
  const session = useSession();
  const token = session.data?.accessToken;

  const removeOrderItem = async (item: OrderItem) => {
    const index = currentOrderItems.findIndex(
      (oi) =>
        oi.productId === item.productId &&
        oi.productVariantId === item.productVariantId,
    );
    if (index !== -1) {
      setCurrentOrderItems(currentOrderItems.filter((_, i) => i !== index));
    }
  };

  const appendOrderItem = async (item: OrderItem, quantity: number) => {
    const index = currentOrderItems.findIndex(
      (oi) =>
        oi.productId === item.productId &&
        oi.productVariantId === item.productVariantId,
    );

    if (index === -1) {
      const updatedOrderItems = [...currentOrderItems, { ...item, quantity }];
      setCurrentOrderItems(updatedOrderItems);
    } else {
      const updatedOrderItems = [...currentOrderItems];
      updatedOrderItems[index].quantity = quantity;
      setCurrentOrderItems(updatedOrderItems);
    }
  };

  const updateItemQuantity = async (itemId: string, quantity: number) => {
    console.log(
      `${process.env.NEXT_PUBLIC_BASE_URL}/carts/${cartId}/item/${itemId}`,
    );
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
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to update cart item quantity");
    }

    toast.success("Đã cập nhật số lượng sản phẩm");
  };

  const removeCartItem = async (itemId: string) => {
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

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to remove cart item");
    }

    router.refresh();
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  return (
    <div className={"mx-auto w-full max-w-7xl space-y-10 p-4"}>
      <CustomBreadcrumb items={[{ label: "Giỏ hàng", href: "/cart" }]} />
      <h2 className={"text-h2"}> Giỏ hàng </h2>
      <div className={"flex justify-between gap-6"}>
        <div className={"flex flex-grow flex-col gap-6"}>
          {cartData.items === null ? (
            <p className={"min-w-[600px]"}>Giỏ hàng của bạn đang trống.</p>
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
        <div className={"w-fit flex-col space-y-4"}>
          <OrderSummary OrderItems={currentOrderItems} />
          <CartButtons OrderItems={currentOrderItems} />
        </div>
      </div>
    </div>
  );
}
