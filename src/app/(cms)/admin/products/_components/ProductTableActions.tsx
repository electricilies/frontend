"use client";

import { Category, CategoryResponse, Product } from "@/types/types";
import { EditProductGeneralDialog } from "@/app/(cms)/admin/products/EditProductDialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DeleteButton } from "@/app/(cms)/_components/DeleteButton/DeleteButton";
import { useRouter } from "next/navigation";

interface ProductTableActionsProps {
  product: Product;
  categories: Category[];
}

export default function ProductTableActions({
  categories,
  product,
}: ProductTableActionsProps) {
  const session = useSession();
  const token = session.data?.accessToken;
  const router = useRouter();

  const handleDelete = async (productId: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message || "Failed to delete product");
      throw new Error(errorData.message || "Failed to delete product");
    }

    toast.success("Đã xoá sản phẩm thành công");
    router.refresh();
  };

  return (
    <div className={"flex"}>
      <EditProductGeneralDialog
        product={{
          id: product.id,
          name: product.name,
          description: product.description || "",
          category: {
            id: product.category.id,
            name: product.category.name,
          },
        }}
        categories={categories}
      />
      <DeleteButton onDelete={() => handleDelete(product.id)} />
    </div>
  );
}
