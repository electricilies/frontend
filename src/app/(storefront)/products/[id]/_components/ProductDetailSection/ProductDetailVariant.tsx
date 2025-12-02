"use client";
import { Product, Variant } from "@/types/types";
import { useState, useMemo, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface ProductDetailVariantProps {
  product: Product;
}

export function ProductDetailVariant({ product }: ProductDetailVariantProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});

  // find selected variant based on selected options
  const selectedVariant: Variant | null | undefined = useMemo(() => {
    if (Object.keys(selectedOptions).length !== product.options.length) {
      return null;
    }

    return product.variants.find((variant) => {
      return Object.values(selectedOptions).every((selectedValId) =>
        variant.optionValues.some((v) => v.id === selectedValId),
      );
    });
  }, [product.variants, selectedOptions, product.options.length]);

  /*useEffect(() => {
    const currentParams = new URLSearchParams(
      Array.from(searchParams.entries()),
    );
    if (selectedVariant) {
      if (currentParams.get("variant") !== selectedVariant.id) {
        currentParams.set("variant", selectedVariant.id);
        router.replace(`${pathname}?${currentParams.toString()}`, {
          scroll: false,
        });
      } else {
        if (currentParams.has("variant")) {
          currentParams.delete("variant");
          router.replace(`${pathname}?${currentParams.toString()}`, {
            scroll: false,
          });
        }
      }
    }
    console.log("rerendered");
  }, [pathname, router, searchParams, selectedVariant]);*/

  // check if an option value is selectable
  const isOptionValueSelectable = (optionId: string, valueId: string) => {
    return product.variants.some((variant) => {
      // variant must include option value
      const hasTargetValue = variant.optionValues.some((v) => v.id === valueId);
      if (!hasTargetValue) return false;

      // variant must include all other selected option values
      for (const [key, selectedValId] of Object.entries(selectedOptions)) {
        if (key !== optionId) {
          const hasSelectedValue = variant.optionValues.some(
            (v) => v.id === selectedValId,
          );
          if (!hasSelectedValue) return false;
        }
      }
      return true;
    });
  };

  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => {
      const isSelected = prev[optionId] === valueId;
      if (isSelected) {
        const { [optionId]: _, ...rest } = prev;
        return rest;
      }

      // check if new option is conflicted with selected options
      // logic: prioritize newly selected option, remove any conflicts in old selected option vales
      const newSelection = { ...prev, [optionId]: valueId };
      // clean up conflicts in old selected options
      const cleanedSelection: Record<string, string> = {};

      Object.entries(newSelection).forEach(([key, val]) => {
        if (key === optionId) {
          cleanedSelection[key] = val;
          return;
        }

        // check if old selected option value is valid with newly selected option value by
        // checking if there's any variant that has both option values
        const isValid = product.variants.some(
          (variant) =>
            variant.optionValues.some((v) => v.id === valueId) &&
            variant.optionValues.some((v) => v.id === val),
        );

        if (isValid) {
          cleanedSelection[key] = val;
        }
      });
      return cleanedSelection;
    });
  };

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayStock = selectedVariant
    ? selectedVariant.quantity
    : product.variants.reduce((total, variant) => total + variant.quantity, 0);

  return (
    <div
      className={
        "flex h-full flex-col gap-10 rounded-[30px] bg-slate-100 p-[24px]"
      }
    >
      <div className={"flex flex-col gap-6"}>
        {product.options.map((option) => (
          <div key={option.id} className={"flex flex-col gap-2"}>
            <h3 className={"text-h4"}>{option.name}</h3>
            <div
              className={
                "flex h-fit max-h-[100px] flex-wrap gap-4 overflow-y-auto"
              }
            >
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.id] === value.id;
                const isSelectable = isOptionValueSelectable(
                  option.id,
                  value.id,
                );

                return (
                  <button
                    key={value.id}
                    onClick={() =>
                      isSelectable && handleSelectOption(option.id, value.id)
                    }
                    disabled={!isSelectable && !isSelected}
                    className={`h-fit cursor-pointer rounded-md border px-4 py-2 transition-all ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : isSelectable
                          ? "border-slate-300 bg-white text-black hover:border-black"
                          : "cursor-not-allowed border-slate-200 bg-slate-200 text-slate-400 opacity-50"
                    } `}
                  >
                    {value.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <span
        className={`text-h4 ${displayStock > 0 ? "text-green-500" : "text-red-500"}`}
      >
        {displayStock > 0 ? `Còn hàng: ${displayStock}` : "Hết hàng"}
      </span>
      <span className={"text-h2"}>
        {displayPrice.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </span>
      <div className={"flex w-full gap-8"}>
        <button
          disabled={displayStock === 0 || !selectedVariant}
          className={`text-h4 flex-grow rounded-lg py-4 font-medium text-white transition-colors ${
            displayStock === 0 || !selectedVariant
              ? "cursor-not-allowed bg-slate-400"
              : "cursor-pointer bg-red-500 hover:bg-red-700"
          }`}
        >
          Mua ngay
        </button>
        <button
          disabled={displayStock === 0 || !selectedVariant}
          className={`text-h4 flex-grow rounded-lg py-4 font-medium transition-colors ${
            displayStock === 0 || !selectedVariant
              ? "cursor-not-allowed bg-slate-400 text-white"
              : "cursor-pointer border-1 border-slate-400 bg-slate-200 text-black hover:bg-slate-300"
          }`}
        >
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
