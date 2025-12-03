import { Star } from "lucide-react";

interface ProductReviewCardProps {
  rating: number;
}

export default function ProductReviewCard({ rating }: ProductReviewCardProps) {
  return (
    <div
      className={
        "flex w-full flex-col justify-center gap-4 rounded-lg bg-slate-100 p-4"
      }
    >
      <div className={"flex items-center gap-5"}>
        <div
          className={"h-[40px] w-[40px] rounded-full bg-cover bg-center"}
          style={{ backgroundImage: `url('/images/placeholderAvatar.png')` }}
        />
        <span className={"text-h4"}>User</span>
        <div className={"flex gap-2"}>
          {Array.from({ length: 5 }, (_, index) => (
            <Star
              key={index}
              size={20}
              stroke={undefined}
              fill={index < rating ? "#facc15" : "#cbd5e1"}
            />
          ))}
        </div>
        <span className={"text-p-ui-medium"}>({rating.toFixed(1)})</span>
      </div>
      <p className={"text-body break-words"}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </p>
    </div>
  );
}
