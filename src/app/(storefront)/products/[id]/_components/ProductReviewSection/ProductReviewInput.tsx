"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export function ProductReviewInput() {
  const [reviewText, setReviewText] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const MAX_REVIEW_LENGTH = 500;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <h3 className={"text-h3"}>Viết đánh giá của bạn</h3>
      <div className="flex items-center gap-2">
        {Array.from({ length: 5 }, (_, index) => {
          const ratingValue = index + 1;
          return (
            <Star
              key={index}
              size={24}
              stroke={undefined}
              fill={
                ratingValue <= (hoveredRating || selectedRating)
                  ? "#facc15"
                  : "#cbd5e1"
              }
              onMouseEnter={() => setHoveredRating(ratingValue)}
              onMouseLeave={() => setHoveredRating(selectedRating)}
              onClick={() => setSelectedRating(ratingValue)}
              className="cursor-pointer"
            />
          );
        })}
      </div>
      <div className={"relative flex flex-col"}>
        <Textarea
          value={reviewText}
          onChange={handleInputChange}
          placeholder="Viết nội dung đánh giá tại đây..."
          maxLength={500}
          className="h-fit min-h-[150px] w-full pb-8 break-all"
        />
        <div className="absolute right-3 bottom-2 mt-1 text-sm text-slate-500">
          {reviewText.length}/{MAX_REVIEW_LENGTH}
        </div>
      </div>
      <Button
        disabled={reviewText.trim() === "" || selectedRating === 0}
        className="self-end"
      >
        Gửi đánh giá
      </Button>
    </div>
  );
}
