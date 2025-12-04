"use client";

import { EditButton } from "@/app/(cms)/_components/EditButton/EditButton";
import { AttributeDialogContent } from "@/app/(cms)/admin/attributes/_components/AttributeDialog";
import { Attribute } from "@/types/types";
import { DeleteButton } from "@/app/(cms)/_components/DeleteButton/DeleteButton";

interface AttributeTableActionsProps {
  attribute: Attribute;
}
export default function AttributeTableActions({
  attribute,
}: AttributeTableActionsProps) {
  const handleDelete = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/attributes/{id}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete attribute");
    }
  };

  return (
    <>
      <EditButton size={"icon"}>
        {({ close }) => (
          <AttributeDialogContent
            mode={"edit"}
            onSuccess={close}
            attribute={attribute}
          />
        )}
      </EditButton>
      <DeleteButton onDelete={() => handleDelete()} />
    </>
  );
}
