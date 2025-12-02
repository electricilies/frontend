import { Star } from "lucide-react";

interface ProductDetailHeaderProps {
  name: string;
  rating: number;
  purchaseCount: number;
}

export function ProductDetailHeader({
  name,
  rating,
  purchaseCount,
}: ProductDetailHeaderProps) {
  const roundedRating = Math.round(rating * 10) / 10;

  return (
    <div className={"flex flex-col gap-4"}>
      <h1 className={"text-h2"}>{name}</h1>
      <div className={"flex items-center gap-2 text-black"}>
        <div className={"flex items-center gap-1"}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={24}
              fill={index < Math.floor(roundedRating) ? "#facc15" : "#cbd5e1"}
              stroke={undefined}
            />
          ))}
          <span className={"text-large"}>({roundedRating.toFixed(1)})</span>
        </div>
        <span className={"text-slate-400"}>|</span>
        <span className={"text-p-ui-medium"}>999 đánh giá</span>
        <span className={"text-slate-400"}>|</span>
        <span className={"text-p-ui-medium"}>{purchaseCount} đã bán</span>
      </div>
    </div>
  );
}
