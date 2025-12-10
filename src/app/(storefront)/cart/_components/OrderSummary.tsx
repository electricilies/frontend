import { OrderItem, useOrder } from "@/app/context/OrderContext";
import CartButtons from "@/app/(storefront)/cart/_components/CartButtons";

interface OrderSummaryProps {
  OrderItems: OrderItem[];
}

export function OrderSummary({ OrderItems }: OrderSummaryProps) {
  const subtotal = OrderItems.reduce(
    (total, item) => total + (item.price || 0) * item.quantity,
    0,
  );
  const shippingFee = 0;
  const discount = 0.05 * subtotal;
  const total = subtotal + shippingFee;
  const totalItems = OrderItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const toVND = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className={"flex w-[400px] flex-col gap-4"}>
      <div className="text-lead flex w-full flex-col gap-3 rounded-lg border border-slate-400 bg-slate-100 bg-white p-4 shadow-md">
        <p className={"w-full"}>
          <span className={"float-left"}>Tổng số lượng sản phẩm</span>
          <span className={"float-right"}>{totalItems}</span>
        </p>
        <p className={"w-full"}>
          <span className={"float-left"}>Tổng tiền sản phẩm</span>
          <span className={"float-right"}>{toVND(subtotal)}</span>
        </p>
        <p className={"w-full"}>
          <span className={"float-left"}>Phí vận chuyển</span>
          <span className={"float-right"}>{toVND(shippingFee)}</span>
        </p>
        <p className={"w-full"}>
          <span className={"float-left"}>Giảm giá</span>
          <span className={"float-right"}>- {toVND(discount)}</span>
        </p>
        <hr className="my-2 border-slate-400" />
        <p className={"text-h3 w-full"}>
          <span className={"float-left"}>Thanh toán</span>
          <span className={"float-right"}>{toVND(total - discount)}</span>
        </p>
      </div>
    </div>
  );
}
