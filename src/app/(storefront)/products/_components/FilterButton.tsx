"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { useState } from "react";

const FilterDialog = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState<number | null>(() =>
    searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : null,
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(() =>
    searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : null,
  );
  const [rating, setRating] = useState<number | null>(() =>
    searchParams.get("rating") ? Number(searchParams.get("rating")) : null,
  );

  const handleNumberChange = (
    val: string,
    setter: (v: number | null) => void,
  ) => {
    if (val === "") {
      setter(null); //
    } else {
      setter(Number(val));
    }
  };

  const isRatingInvalid = rating !== null && (rating < 1 || rating > 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRatingInvalid) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    if (minPrice !== null) currentParams.set("min_price", minPrice.toString());
    else currentParams.delete("min_price");
    if (maxPrice !== null) currentParams.set("max_price", maxPrice.toString());
    else currentParams.delete("max_price");
    if (rating !== null) currentParams.set("rating", rating.toString());
    else currentParams.delete("rating");
    currentParams.delete("page");
    router.push(`${pathname}?${currentParams.toString()}`);
    onClose();
  };

  return (
    <>
      <div className={"fixed inset-0 z-40 bg-black/50"} onClick={onClose}></div>
      <div
        className={
          "fixed top-1/2 left-1/2 z-50 m-auto flex h-fit w-fit min-w-[300px] -translate-x-1/2 -translate-y-1/2 transform flex-col items-center rounded-lg bg-white p-6 shadow-lg"
        }
      >
        <h3 className={"text-h3 font-bold"}>Bộ lọc</h3>
        <form
          className={"mt-6 flex w-full flex-col gap-6"}
          onSubmit={handleSubmit}
        >
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="minPrice">Giá trị tối thiểu</Label>
            <Input
              type="number"
              id="minPrice"
              placeholder="0"
              value={minPrice ?? ""}
              onChange={(e) => handleNumberChange(e.target.value, setMinPrice)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="maxPrice">Giá trị tối đa</Label>
            <Input
              type="number"
              id="maxPrice"
              placeholder="VNĐ"
              value={maxPrice ?? ""}
              onChange={(e) => handleNumberChange(e.target.value, setMaxPrice)}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-3">
            <Label htmlFor="rating">Đánh giá tối thiểu</Label>
            <Input
              type="number"
              id="rating"
              placeholder="1 - 5"
              min={1}
              max={5}
              value={rating ?? ""}
              onChange={(e) => handleNumberChange(e.target.value, setRating)}
            />
            {isRatingInvalid && (
              <p className="text-sm text-red-500">Đánh giá phải từ 1 đến 5</p>
            )}
          </div>

          <div className={"flex w-full justify-center gap-4"}>
            <Button
              type="submit"
              variant={"default"}
              disabled={isRatingInvalid}
            >
              Áp dụng
            </Button>
            <Button type="button" variant={"outline"} onClick={onClose}>
              Đóng
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default function FilterButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // filter params: min_price, max_price, rating (min rating)
  const hasActiveFilters = () => {
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const rating = searchParams.get("rating");
    return !!(minPrice || maxPrice || rating);
  };

  return (
    <div className={""}>
      {isOpen && <FilterDialog onClose={() => setIsOpen(false)} />}
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Filter />
      </Button>
    </div>
  );
}
