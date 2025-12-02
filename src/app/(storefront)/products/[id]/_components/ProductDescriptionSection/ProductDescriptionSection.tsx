import { Attribute } from "@/types/types";
import { ProductDescriptionText } from "@/app/(storefront)/products/[id]/_components/ProductDescriptionSection/ProductDescriptionText";

interface ProductDescriptionSectionProps {
  description: string;
  attributes: Attribute[];
}

export function ProductDescriptionSection({
  description,
  attributes,
}: ProductDescriptionSectionProps) {
  return (
    <section className={"flex w-full gap-8"}>
      <ProductDescriptionText description={description} />
      <div className={"flex w-2/5 flex-col gap-4"}>
        <h2 className={"text-h4 font-bold"}>Thông số kỹ thuật</h2>
        <div
          className={
            "flex flex-col overflow-hidden rounded-lg border border-slate-200"
          }
        >
          {attributes.map((attribute, index) => (
            <div key={attribute.id} className={`grid grid-cols-2`}>
              <span className={"text-p-ui-medium bg-slate-100 p-4"}>
                {attribute.name}
              </span>
              <span className={"text-p-ui-medium bg-white p-4 break-words"}>
                {attribute.value?.value || "N/A"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
