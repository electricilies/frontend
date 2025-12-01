"use client";
import { ShoppingCart } from "lucide-react";

export function CartButton() {
  return (
    <ShoppingCart
      size={30}
      className={
        "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
      }
    />
  );
}
