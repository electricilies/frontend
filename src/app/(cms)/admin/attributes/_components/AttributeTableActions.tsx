"use client";

import { EditButton } from "@/app/(cms)/_components/EditButton/EditButton";
import { AttributeDialogContent } from "@/app/(cms)/admin/attributes/_components/AttributeDialog";
import { Attribute } from "@/types/types";
import { DeleteButton } from "@/app/(cms)/_components/DeleteButton/DeleteButton";
import { useSession } from "next-auth/react";

interface AttributeTableActionsProps {
  attribute: Attribute;
}
export default function AttributeTableActions({
  attribute,
}: AttributeTableActionsProps) {
  const session = useSession();
  const token = session.data?.accessToken;

  const handleDelete = async (attributeId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/attributes/${attributeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete attribute");
    }
  };

  return (
    <>
      <EditButton>
        {({ close }) => (
          <AttributeDialogContent
            mode={"edit"}
            onSuccess={close}
            attribute={attribute}
          />
        )}
      </EditButton>
      <DeleteButton onDelete={() => handleDelete(attribute.id)} />
    </>
  );
}
