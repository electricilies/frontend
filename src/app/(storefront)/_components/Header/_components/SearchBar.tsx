"use client";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className={"flex w-1/2 items-center gap-2 rounded-full bg-white"}>
      <Search size={16} opacity={50} className={"ml-3"} />
      <input
        className={"h-full w-full rounded-r-full py-3 focus:outline-none"}
        type="text"
        placeholder="Nhập tên sản phẩm"
      />
    </div>
  );
}
