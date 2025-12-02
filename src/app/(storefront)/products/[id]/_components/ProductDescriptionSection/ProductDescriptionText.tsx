"use client";

import { useState } from "react";

interface ProductDescriptionTextProps {
  description: string;
}

export function ProductDescriptionText({
  description,
}: ProductDescriptionTextProps) {
  const [isFull, setIsFull] = useState<boolean>(false);
  return (
    <div className={"flex w-3/5 flex-col gap-4"}>
      <h2 className={"text-h4 font-bold"}>Mô tả sản phẩm</h2>
      <div className={"rounded-xl bg-slate-100 p-6"}>
        <div
          className={`text-base whitespace-pre-line ${isFull ? "h-fit" : "max-h-80 overflow-hidden"}`}
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div
          onClick={() => setIsFull(!isFull)}
          className={
            "mt-4 cursor-pointer text-center text-blue-500 select-none"
          }
        >
          {isFull ? "Thu gọn" : "Xem thêm"}
        </div>
      </div>
    </div>
  );
}
