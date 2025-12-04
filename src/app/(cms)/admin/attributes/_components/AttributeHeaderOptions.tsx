"use client";

import { CreateButton } from "@/app/(cms)/_components/CreateButton/CreateButton";
import { AttributeDialogContent } from "@/app/(cms)/admin/attributes/_components/AttributeDialog";
import { SearchInput } from "@/app/(cms)/_components/SearchInput/SearchInput";

export default function AttributeHeaderOptions() {
  return (
    <div className={"flex"}>
      <CreateButton
        className={"rounded-full border-1 border-slate-200 bg-white"}
      >
        {({ close }) => (
          <AttributeDialogContent onSuccess={close} mode={"create"} />
        )}
      </CreateButton>
      <SearchInput
        className={"ml-4 w-[300px] rounded-full"}
        placeholder={"Search attributes..."}
      />
    </div>
  );
}
