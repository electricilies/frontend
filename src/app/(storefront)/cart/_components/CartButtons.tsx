import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrderItem, useOrder } from "@/app/context/OrderContext";

interface CartButtonsProps {
  OrderItems: OrderItem[];
}

export default function CartButtons({ OrderItems }: CartButtonsProps) {
  const { setOrderItems } = useOrder();
  return (
    <div className={"flex w-full justify-between gap-[10px]"}>
      <Button
        onClick={() => setOrderItems(OrderItems, "cart_page")}
        className={
          "h-[50px] w-[195px] bg-black text-[18px] font-semibold text-white"
        }
      >
        <Link
          className={"flex h-full w-full items-center justify-center"}
          href={"/checkout"}
        >
          Thanh toán
        </Link>
      </Button>
      <Button
        className={
          "text-large h-[50px] w-[195px] border border-slate-400 bg-slate-200 leading-none hover:bg-slate-300"
        }
      >
        <Link className={"h-full w-full"} href={"/products"}>
          Tiếp tục mua hàng
        </Link>
      </Button>
    </div>
  );
}
