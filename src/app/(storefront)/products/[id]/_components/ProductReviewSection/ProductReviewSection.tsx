import { Star } from "lucide-react";
import { ProductReviewInput } from "@/app/(storefront)/products/[id]/_components/ProductReviewSection/ProductReviewInput";
import ProductReviewCard from "@/app/(storefront)/products/[id]/_components/ProductReviewSection/ProductReviewCard";

interface ProductReviewSectionProps {
  rating: number;
  reviewCount?: number;
}

export function ProductReviewSection({
  rating,
  reviewCount,
}: ProductReviewSectionProps) {
  return (
    <div className="flex w-full flex-col gap-6">
      <h2 className="text-h2">Đánh giá</h2>
      <section className="flex w-full items-center justify-between gap-6 gap-8 rounded-xl bg-slate-100 p-6">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className={"text-h1"}>{rating.toFixed(1)}</h1>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={24}
                stroke={undefined}
                fill={index < Math.round(rating) ? "#facc15" : "#cbd5e1"}
              />
            ))}
          </div>
          <span className="text-body-medium text-black">
            {reviewCount ? `${reviewCount} đánh giá` : "Chưa có đánh giá"}
          </span>
        </div>
        <ProductReviewInput />
      </section>
      <div className={"mt-10 flex w-full flex-col gap-8 px-8"}>
        {Array.from({ length: 5 }, (_, index) => (
          <ProductReviewCard
            key={index}
            rating={Math.floor(Math.random() * 5) + 1}
          />
        ))}
      </div>
    </div>
  );
}
