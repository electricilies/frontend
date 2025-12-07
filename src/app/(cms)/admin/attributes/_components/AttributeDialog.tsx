"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { PlusCircle, Trash2, Loader2 } from "lucide-react";
import { Attribute } from "@/types/types";
import { getErrorMessage } from "@/app/lib/utils";
import { useSession } from "next-auth/react";

interface FormAttributeValue {
  id?: string;
  value: string;
}

interface AttributeDialogContentProps {
  mode: "create" | "edit";
  attribute?: Attribute;
  onSuccess: () => void;
}

export function AttributeDialogContent({
  mode,
  attribute,
  onSuccess,
}: AttributeDialogContentProps) {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState(""); // Thêm state Code
  const [values, setValues] = useState<FormAttributeValue[]>([{ value: "" }]);

  // save original values to find which values got deleted when sending delete requests
  const [originalValues, setOriginalValues] = useState<FormAttributeValue[]>(
    [],
  );

  useEffect(() => {
    if (mode === "edit" && attribute) {
      setName(attribute.name);
      setCode(attribute.code);

      const mappedValues = attribute.values.map((v) => ({
        id: v.id,
        value: v.value,
      }));
      setValues(mappedValues);
      setOriginalValues(mappedValues);
    } else {
      setName("");
      setCode("");
      setValues([{ value: "" }]);
      setOriginalValues([]);
    }
  }, [mode, attribute]);

  const handleAddValue = () => {
    setValues([...values, { value: "" }]);
  };

  const handleRemoveValue = (indexToRemove: number) => {
    if (values.length === 1) return setValues([{ value: "" }]);
    setValues(values.filter((_, index) => index !== indexToRemove));
  };

  const handleValueChange = (indexToUpdate: number, newValue: string) => {
    const newValues = [...values];
    newValues[indexToUpdate].value = newValue;
    setValues(newValues);
  };

  const handleSave = async () => {
    if (!code.trim()) return toast.error("Vui lòng nhập mã thuộc tính");
    if (!name.trim()) return toast.error("Vui lòng nhập tên thuộc tính");

    const cleanValues = values.filter((v) => v.value.trim() !== "");
    if (cleanValues.length === 0)
      return toast.error("Vui lòng nhập ít nhất 1 giá trị");

    setIsLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    // flow: create or update attribute -> create, update, delete values
    try {
      let currentAttributeId = attribute?.id;

      if (mode === "create") {
        const resAttr = await fetch(`${baseUrl}/attributes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.accessToken || ""}`,
          },
          body: JSON.stringify({ code, name }),
        });

        if (!resAttr.ok) {
          const err = await resAttr.json();
          throw new Error(err.message || "Lỗi khi tạo thuộc tính");
        }

        const dataAttr: Attribute = await resAttr.json();
        currentAttributeId = dataAttr.id;
      } else {
        if (!currentAttributeId) throw new Error("Missing ID");

        const resAttr = await fetch(
          `${baseUrl}/attributes/${currentAttributeId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.data?.accessToken || ""}`,
            },
            body: JSON.stringify({ name }),
          },
        );

        if (!resAttr.ok) throw new Error("Lỗi khi cập nhật attribute");
      }

      if (!currentAttributeId)
        throw new Error("Không lấy được Attribute ID để xử lý values");

      const valuePromises: Promise<Response>[] = [];

      // find deleted values (only in edit mode)
      if (mode === "edit") {
        // set of current existing IDs
        const currentIds = new Set(values.map((v) => v.id).filter(Boolean));
        const deletedItems = originalValues.filter(
          (v) => v.id && !currentIds.has(v.id),
        );

        deletedItems.forEach((delItem) => {
          valuePromises.push(
            fetch(
              `${baseUrl}/attributes/${currentAttributeId}/values/${delItem.id}`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.data?.accessToken || ""}`,
                },
              },
            ),
          );
        });
      }

      values.forEach((val) => {
        const valContent = val.value.trim();
        if (!valContent) return;

        if (val.id) {
          const original = originalValues.find((ov) => ov.id === val.id);
          if (original && original.value !== valContent) {
            valuePromises.push(
              fetch(
                `${baseUrl}/attributes/${currentAttributeId}/values/${val.id}`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.data?.accessToken || ""}`,
                  },
                  body: JSON.stringify({ value: valContent }),
                },
              ),
            );
          }
        } else {
          valuePromises.push(
            fetch(`${baseUrl}/attributes/${currentAttributeId}/values`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.data?.accessToken || ""}`,
              },
              body: JSON.stringify({ value: valContent }),
            }),
          );
        }
      });

      await Promise.all(valuePromises);

      toast.success("Thành công!");
      router.refresh();
      onSuccess();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {mode === "create" ? "Tạo thuộc tính" : "Sửa thuộc tính"}
        </DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Thêm thuộc tính mới cho sản phẩm."
            : "Cập nhật thông tin thuộc tính."}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="code" className="text-right font-semibold">
            Mã (Code)
          </Label>
          <Input
            id="code"
            value={code}
            disabled={mode === "edit" || isLoading}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ví dụ: color, size"
            className="col-span-3"
          />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right font-semibold">
            Tên
          </Label>
          <Input
            id="name"
            value={name}
            disabled={isLoading}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Màu sắc"
            className="col-span-3"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Giá trị (Values)</h4>
            <button type="button" onClick={handleAddValue} disabled={isLoading}>
              <PlusCircle size={20} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {values.map((item, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-slate-500">Giá trị</Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Input
                    value={item.value}
                    disabled={isLoading}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder="Nhập giá trị..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveValue(index)}
                    disabled={values.length === 1 || isLoading}
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" disabled={isLoading}>
            Hủy
          </Button>
        </DialogClose>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : "Lưu"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
