"use client";

import { EditButton } from "@/app/(cms)/_components/EditButton/EditButton";
import { AttributeDialogContent } from "@/app/(cms)/admin/attributes/_components/AttributeDialog";
import { Attribute } from "@/types/types";
import { DeleteButton } from "@/app/(cms)/_components/DeleteButton/DeleteButton";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
      toast.error(errorData.message || "Failed to delete attribute");
      throw new Error(errorData.message || "Failed to delete attribute");
    }
    toast.success("Attribute deleted successfully");
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
