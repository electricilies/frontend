"use client";

import { SearchInput } from "@/app/(cms)/_components/SearchInput/SearchInput";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductHeaderOptions() {
  return (
    <div className={"flex"}>
      <Button
        variant={"ghost"}
        size={"icon"}
        className={"rounded-full border-1 border-slate-200 bg-white"}
      >
        <Plus href={"/admin/products/new"} className="h-4 w-4" />
      </Button>
      <SearchInput
        className={"ml-4 w-[300px] rounded-full"}
        placeholder={"Type a product name to search..."}
      />
    </div>
  );
}
