"use client";

import { CreateButton } from "@/app/(cms)/_components/CreateButton/CreateButton";
import { CategoryDialogContent } from "@/app/(cms)/admin/categories/_components/CategoryDialog";
import { SearchInput } from "@/app/(cms)/_components/SearchInput/SearchInput";

export default function CategoryHeaderOptions() {
  return (
    <div className={"flex"}>
      <CreateButton
        className={"rounded-full border-1 border-slate-200 bg-white"}
      >
        {({ close }) => (
          <CategoryDialogContent onSuccess={close} mode={"create"} />
        )}
      </CreateButton>
      <SearchInput
        className={"ml-4 w-[300px] rounded-full"}
        placeholder={"Type a category to search..."}
      />
    </div>
  );
}
