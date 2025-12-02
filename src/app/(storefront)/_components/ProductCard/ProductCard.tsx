import { Product } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import fallbackProductImage from "../../../../../public/images/fallbackProductImage.png";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.images[0]?.url
    ? product.images[0].url
    : product.variants[0]?.images[0]?.url
      ? product.variants[0].images[0].url
      : fallbackProductImage;

  return (
    <Link
      href={`/products/${product.id}`}
      className={
        "flex w-[200px] cursor-pointer flex-col items-center rounded-[30px] border border-slate-300 p-4 transition-shadow duration-200 hover:shadow-lg"
      }
    >
      <Image
        src={imageSrc}
        alt={product.name}
        width={150}
        height={150}
        className="mb-4 h-[150px] w-auto rounded-md object-cover"
      />
      <div className={"text-large line-clamp-3"}>{product.name}</div>
      <div className={"text-h4 text-tertiary mt-2 text-start font-bold"}>
        {product.price.toFixed(2)}đ
      </div>
    </Link>
  );
}
