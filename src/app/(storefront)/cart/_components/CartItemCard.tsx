"use client";

import { CartItem } from "@/types/types";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { OrderItem } from "@/app/context";

interface CartItemCardProps {
  item: CartItem;
  appendOrderItem: (item: OrderItem) => void;
  removeOrderItem: (item: OrderItem) => void;
  updateItemQuantity?: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem?: (itemId: string) => Promise<void>;
}

export function CartItemCard({
  item,
  appendOrderItem,
  removeOrderItem,
}: CartItemCardProps) {
  const [quantity, setQuantity] = useState(item.quantity);

  const transformCartItemToOrderItem = (cartItem: CartItem): OrderItem => {
    return {
      productId: cartItem.product.id,
      productVariantId: cartItem.productVariant.id,
      quantity: cartItem.quantity,
      name: cartItem.product.name,
      price: cartItem.productVariant.price,
      image: cartItem.productVariant.images[0]
        ? cartItem.productVariant.images[0].url
        : cartItem.product.images[0]
          ? cartItem.product.images[0].url
          : "/images/fallbackProductImage.png",
      options: cartItem.productVariant.optionValues,
    };
  };

  return (
    <div
      className={
        "relative flex w-[600px] items-center gap-4 rounded-lg border bg-slate-100 p-4"
      }
    >
      <div className={"flex h-full items-center justify-center px-4"}>
        <Checkbox
          id={"select-item-" + item.id}
          onCheckedChange={(checked) => {
            if (checked) {
              appendOrderItem(transformCartItemToOrderItem(item));
            } else {
              removeOrderItem(transformCartItemToOrderItem(item));
            }
          }}
        />
      </div>
      <div className={"flex-shrink-0"}>
        <Image
          src={
            item.productVariant.images[0]
              ? item.productVariant.images[0].url
              : item.product.images[0]
                ? item.product.images[0].url
                : "/images/fallbackProductImage.png"
          }
          alt={item.product.name}
          width={150}
          height={150}
          className={"h-[150px] w-[150px] rounded-md object-contain"}
          unoptimized={true}
        />
      </div>
      <div className={"flex flex-col gap-2"}>
        <h3 className={"text-large line-clamp-1 font-medium"}>
          {item.product.name}
        </h3>
        <div className={"text-table-body"}>
          {item.productVariant.optionValues.map((option) => {
            const optionName =
              item.product.options.find((opt) => opt.id === option.id)?.name ||
              "Option";
            return (
              <span key={option.id}>
                <span className={"font-bold"}>{optionName}: </span>
                {option.value},
              </span>
            );
          })}
        </div>
        <p className={"text-tertiary text-h4 border-1 border-slate-400"}>
          {item.productVariant.price}
        </p>
        <div className={"flex gap-0"}>
          <button
            className={"bg-slate-200 p-2"}
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
          >
            -
          </button>
          <span className={"p-2"}>{quantity}</span>
          <button
            className={"bg-slate-200 p-2"}
            onClick={() => {
              setQuantity(quantity + 1);
            }}
          >
            +
          </button>
        </div>
      </div>
      <Button
        size={"icon"}
        variant={"ghost"}
        className={"absolute right-2 bottom-2"}
        onClick={() => {
          removeOrderItem(transformCartItemToOrderItem(item));
        }}
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );
}
