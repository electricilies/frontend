"use client";
import { Product } from "@/types/types";
import { useState } from "react";
import ProductCard from "@/app/(storefront)/_components/ProductCard/ProductCard";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductSlideProps {
  products: Product[];
}

const sliderVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 150 : -150,
    opacity: 0,
  }),
  center: (dir: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.5 },
  }),
  exit: (dir: number) => ({
    x: dir > 0 ? -150 : 150,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

export default function ProductSlide({ products }: ProductSlideProps) {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const BOOKS_PER_PAGE = 5;
  const totalPages = Math.ceil(products.length / BOOKS_PER_PAGE);

  const next = () => {
    setPage((p) => (p + 1) % totalPages);
    setDirection(1);
  };
  const prev = () => {
    setPage((p) => (p - 1 + totalPages) % totalPages);
    setDirection(-1);
  };
  return (
    <div
      className={
        "relative mt-4 flex w-full items-center justify-between gap-4 gap-10 rounded-lg bg-slate-100 px-8 py-5"
      }
    >
      <ChevronLeft
        onClick={prev}
        className={
          "cursor-pointer transition-colors duration-300 hover:text-slate-400"
        }
      />
      <AnimatePresence custom={direction} mode={"popLayout"}>
        <motion.div
          key={page}
          custom={direction}
          variants={sliderVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="flex w-full justify-start gap-6 overflow-hidden"
        >
          {products
            .slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)
            .map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>
      </AnimatePresence>
      <ChevronRight
        onClick={next}
        className={
          "cursor-pointer transition-colors duration-300 hover:text-slate-400"
        }
      />
    </div>
  );
}
