import { Category } from "@/types/types";
import CategoryProductSlide from "@/app/(storefront)/_components/CategoryProductSlide/CategoryProductSlide";

interface CategoriesProductSectionProps {
  categories: Category[];
}

export default function CategoriesProductSection({
  categories,
}: CategoriesProductSectionProps) {
  return (
    <>
      {categories.map((category) => (
        <CategoryProductSlide key={category.id} category={category} />
      ))}
    </>
  );
}
