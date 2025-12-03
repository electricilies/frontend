"use client";
import { Category } from "@/types/types";
import Link from "next/link";

interface CategorySidebarProps {
  categories: Category[];
}

export default function CategorySidebar({ categories }: CategorySidebarProps) {
  return (
    <div
      className={
        "flex shrink-0 flex-col gap-4 overflow-y-scroll rounded-lg border-1 border-slate-400 bg-slate-100 p-4"
      }
    >
      {categories.map((category) => {
        return (
          <Link
            key={category.id}
            href={`/products?category_ids=${category.id}`}
            className={
              "cursor-pointer rounded-lg px-4 py-2 transition-colors duration-200 hover:bg-slate-300"
            }
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
