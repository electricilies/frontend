"use client";
import { useState } from "react";
import Image from "next/image";
import { Image as IImage, Product, Variant } from "@/types/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, Variants } from "framer-motion";

interface ProductDetailGalleryProps {
  product: Product;
  selectedVariant?: Variant;
}

const sliderVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: (dir: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.5 },
  }),
  exit: (dir: number) => ({
    x: dir > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

const thumbnailSliderVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: (dir: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.5 },
  }),
  exit: (dir: number) => ({
    x: dir > 0 ? -50 : 50,
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" },
  }),
};

const FALLBACK_IMAGE_URL = "/images/fallbackProductImage.png";

export function ProductDetailGallery({
  product,
  selectedVariant,
}: ProductDetailGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [mainDirection, setMainDirection] = useState<number>(1);
  const [thumbnailDirection, setThumbnailDirection] = useState<number>(1);
  const IMAGES_PER_PAGE = 5;

  // add product images first then variant images to images array
  const images: IImage[] = [...product.images];
  if (selectedVariant) {
    selectedVariant.images.forEach((variantImage) => {
      if (!images.find((img) => img.url === variantImage.url)) {
        images.push(variantImage);
      }
    });
  }

  if (images.length === 0) {
    images.push({
      url: FALLBACK_IMAGE_URL,
      id: "fallback-image",
      createdAt: new Date().toISOString(),
      deletedAt: null,
      order: 0,
    });
  }

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);

  const prevImage = () => {
    setMainDirection(-1);
    const newIndex =
      selectedImage === 0 ? images.length - 1 : selectedImage - 1;
    setSelectedImage(newIndex);
    const newPage = Math.floor(newIndex / IMAGES_PER_PAGE);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      setThumbnailDirection(-1);
    }
  };

  const nextImage = () => {
    setMainDirection(1);
    const newIndex =
      selectedImage === images.length - 1 ? 0 : selectedImage + 1;
    setSelectedImage(newIndex);
    const newPage = Math.floor(newIndex / IMAGES_PER_PAGE);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      setThumbnailDirection(1);
    }
  };

  const prevThumbnailPage = () => {
    setThumbnailDirection(-1);
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const nextThumbnailPage = () => {
    setThumbnailDirection(1);
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  const buttonStyle =
    "cursor-pointer transition-colors duration-300 hover:text-slate-400";
  return (
    <div className="flex w-fit flex-col gap-5">
      <div className={"flex items-center justify-center gap-[40px]"}>
        <ChevronLeft size={40} className={buttonStyle} onClick={prevImage} />
        <div className="relative h-[400px] w-[400px]">
          <AnimatePresence custom={mainDirection} mode={"popLayout"}>
            <motion.div
              key={selectedImage}
              custom={mainDirection}
              variants={sliderVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute top-0 left-0 h-full w-full"
            >
              <Image
                src={images[selectedImage].url}
                alt={`Product Image ${selectedImage + 1}`}
                fill={true}
                className="object-contain"
                unoptimized={true}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <ChevronRight size={40} className={buttonStyle} onClick={nextImage} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <ChevronLeft
          size={30}
          className={buttonStyle}
          onClick={prevThumbnailPage}
        />
        <div className="flex overflow-hidden">
          <AnimatePresence custom={thumbnailDirection} mode={"popLayout"}>
            <motion.div
              key={currentPage}
              custom={thumbnailDirection}
              variants={thumbnailSliderVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex gap-3"
            >
              {images
                .slice(
                  currentPage * IMAGES_PER_PAGE,
                  (currentPage + 1) * IMAGES_PER_PAGE,
                )
                .map((image, index) => {
                  const globalIndex = currentPage * IMAGES_PER_PAGE + index;
                  return (
                    <div
                      key={image.id}
                      className={`relative h-[70px] w-[70px] cursor-pointer border-2 ${globalIndex === selectedImage ? "border-blue-500" : "border-transparent"}`}
                      onClick={() => {
                        setSelectedImage(globalIndex);
                      }}
                    >
                      <Image
                        src={image.url}
                        alt={`Thumbnail ${globalIndex + 1}`}
                        fill={true}
                        className="object-contain"
                        unoptimized={true}
                      />
                    </div>
                  );
                })}
            </motion.div>
          </AnimatePresence>
        </div>
        <ChevronRight
          size={30}
          className={buttonStyle}
          onClick={nextThumbnailPage}
        />
      </div>
    </div>
  );
}
