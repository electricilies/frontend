import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";

export default function CheckoutButton() {
  const {
    formState: { isValid, isSubmitting },
  } = useFormContext();

  return (
    <Button
      type="submit"
      form="checkout-form"
      disabled={!isValid || isSubmitting}
      className={`w-full ${isValid && !isSubmitting && "bg-red-500 text-white hover:bg-red-700"} h-14 text-[24px]`}
    >
      {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
    </Button>
  );
}
