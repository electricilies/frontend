"use client";

import { EditButton } from "@/app/(cms)/_components/EditButton/EditButton";
import { CategoryDialogContent } from "@/app/(cms)/admin/categories/_components/CategoryDialog";
import { Category } from "@/types/types";

interface CategoryTableActionsProps {
  category: Category;
}
export default function CategoryTableActions({
  category,
}: CategoryTableActionsProps) {
  return (
    <>
      <EditButton>
        {({ close }) => (
          <CategoryDialogContent
            mode={"edit"}
            onSuccess={close}
            category={category}
          />
        )}
      </EditButton>
    </>
  );
}
