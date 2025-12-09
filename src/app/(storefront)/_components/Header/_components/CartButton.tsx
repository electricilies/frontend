"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function CartButton() {
  return (
    <Link href={"/cart"}>
      <ShoppingCart
        size={30}
        className={
          "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
        }
      />
    </Link>
  );
}
