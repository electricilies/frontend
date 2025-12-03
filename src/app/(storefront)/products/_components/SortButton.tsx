"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function SortButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getCurrentSortValue = () => {
    const sortPrice = searchParams.get("sort_price");
    const sortRating = searchParams.get("sort_rating");
    if (sortPrice === "asc") return "price_asc";
    if (sortPrice === "desc") return "price_desc";
    if (sortRating === "asc") return "rating_asc";
    if (sortRating === "desc") return "rating_desc";
    return "default";
  };

  const currentSortValue = getCurrentSortValue();

  const handleChange = (selectedOption: string) => {
    const currentParams = new URLSearchParams(searchParams);
    switch (selectedOption) {
      case "price_asc":
        currentParams.set("sort_price", "asc");
        currentParams.delete("sort_rating");
        break;
      case "price_desc":
        currentParams.set("sort_price", "desc");
        currentParams.delete("sort_rating");
        break;
      case "rating_asc":
        currentParams.set("sort_rating", "asc");
        currentParams.delete("sort_price");
        break;
      case "rating_desc":
        currentParams.set("sort_rating", "desc");
        currentParams.delete("sort_price");
        break;
      default:
        currentParams.delete("sort_price");
        currentParams.delete("sort_rating");
        break;
    }
    currentParams.delete("page");
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  return (
    <Select value={currentSortValue} onValueChange={handleChange}>
      <SelectTrigger className={"w-48"}>
        <SelectValue placeholder="Sắp xếp theo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={"default"}>Mặc định</SelectItem>
        <SelectItem value={"price_asc"}>Giá: Thấp đến cao</SelectItem>
        <SelectItem value={"price_desc"}>Giá: Cao đến thấp</SelectItem>
        <SelectItem value={"rating_asc"}>Đánh giá: Thấp đến cao</SelectItem>
        <SelectItem value={"rating_desc"}>Đánh giá: Cao đến thấp</SelectItem>
      </SelectContent>
    </Select>
  );
}
