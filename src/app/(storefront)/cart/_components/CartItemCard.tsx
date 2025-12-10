"use client";

import { CartItem } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { OrderItem } from "@/app/context/OrderContext";

interface CartItemCardProps {
  item: CartItem;
  appendOrderItem: (item: OrderItem, quantity: number) => void;
  removeOrderItem: (item: OrderItem) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  removeCartItem: (itemId: string) => void;
}

export function CartItemCard({
  item,
  appendOrderItem,
  removeOrderItem,
  updateItemQuantity,
  removeCartItem,
}: CartItemCardProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const isMounted = useRef(false);

  useEffect(() => {
    // skip first render
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (quantity === item.quantity) return;
    const timerId = setTimeout(() => {
      updateItemQuantity(item.id, quantity);
    }, 1500);
    return () => clearTimeout(timerId);
  }, [quantity, item.id, item.quantity, updateItemQuantity]);

  const transformCartItemToOrderItem = (cartItem: CartItem): OrderItem => {
    return {
      productId: cartItem.product.id,
      productVariantId: cartItem.productVariant.id,
      quantity: cartItem.quantity,
      name: cartItem.product.name,
      price: cartItem.productVariant.price,
      image: cartItem.productVariant.images[0]
        ? cartItem.productVariant.images[0].url
        : "/images/fallbackProductImage.png",
    };
  };

  return (
    <div
      className={
        "relative flex max-w-[800px] min-w-[600px] items-center gap-4 rounded-lg border bg-slate-100 p-4"
      }
    >
      <div className={"flex h-full items-center justify-center px-4"}>
        <Checkbox
          id={"select-item-" + item.id}
          onCheckedChange={(checked) => {
            if (checked) {
              appendOrderItem(transformCartItemToOrderItem(item), quantity);
              setIsChecked(true);
            } else {
              removeOrderItem(transformCartItemToOrderItem(item));
              setIsChecked(false);
            }
          }}
          className={"size-5 border-slate-400"}
        />
      </div>
      <div className={"flex-shrink-0"}>
        <Image
          src={
            item.productVariant.images[0]
              ? item.productVariant.images[0].url
              : "/images/fallbackProductImage.png"
          }
          alt={item.product.name}
          width={150}
          height={150}
          className={"h-[150px] w-[150px] rounded-md object-contain"}
          unoptimized={true}
        />
      </div>
      <div className={"flex h-full flex-1 flex-col justify-between gap-2"}>
        <h3 className={"text-large line-clamp-2 font-medium"}>
          {item.product.name}
        </h3>
        <p className={"text-tertiary text-h4"}>
          {item.productVariant.price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}
        </p>
        <div
          className={"flex h-8 w-fit gap-0 rounded-md border border-slate-400"}
        >
          <button
            className={
              "w-8 rounded-l-md bg-slate-200 px-2 leading-none font-bold"
            }
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
                if (isChecked)
                  appendOrderItem(
                    transformCartItemToOrderItem(item),
                    quantity - 1,
                  );
              }
            }}
          >
            <Minus size={16} />
          </button>
          <span
            className={
              "flex w-8 items-center justify-center border-r border-l border-slate-400 text-center leading-none"
            }
          >
            {quantity}
          </span>
          <button
            className={
              "flex w-8 items-center justify-center rounded-r-md bg-slate-100 p-2 leading-none font-bold"
            }
            onClick={() => {
              setQuantity(quantity + 1);
              if (isChecked)
                appendOrderItem(
                  transformCartItemToOrderItem(item),
                  quantity + 1,
                );
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"ghost"}
        className={"absolute right-2 bottom-3"}
        onClick={async () => {
          removeCartItem(item.id);
          removeOrderItem(transformCartItemToOrderItem(item));
        }}
      >
        <Trash2 className={"size-5"} />
      </Button>
    </div>
  );
}
