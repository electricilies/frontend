"use client";

import { CustomBreadcrumb } from "@/app/_components/CustomBreadcrumb";
import { useOrder } from "@/app/context/OrderContext";
import CheckoutForm from "@/app/(storefront)/checkout/_components/CheckoutForm";
import Link from "next/link";
import { OrderSummary } from "@/app/(storefront)/cart/_components/OrderSummary";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CheckoutButton from "@/app/(storefront)/checkout/_components/CheckoutButton";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ tên"),
  phone: z.e164("Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Vui lòng nhập địa chỉ giao hàng"),
  paymentMethod: z.enum(
    ["cod", "vnpay", "momo", "zalopay"],
    "Vui lòng chọn phương thức thanh toán",
  ),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const [isSuccessPayment, setIsSuccessPayment] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const session = useSession();
  const order = useOrder();
  const totalItems = order?.orderItems.length || 0;
  console.log(order);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      paymentMethod: "cod",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: CheckoutFormData) => {
    const timeout = data.paymentMethod === "cod" ? 2000 : 5000;
    setIsProcessingPayment(true);

    const orderPayload = {
      address: data.address,
      items: order.orderItems.map((item) => ({
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        productId: item.productId,
      })),
      recipientName: data.fullName,
      phoneNumber: data.phone,
      provider: data.paymentMethod.toUpperCase(),
      returnUrl: `${window.location.origin}/`,
      userId: session.data?.user?.id,
    };

    setTimeout(async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.data?.accessToken}`,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        setIsProcessingPayment(false);
        toast.error("Đã có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      toast.success("Đơn hàng đã được tạo thành công!");
      setIsSuccessPayment(true);

      setTimeout(() => {
        order.clearOrderItems();
        window.location.href = `${window.location.origin}/`;
      }, 4000);
    }, timeout);
  };

  return (
    <FormProvider {...methods}>
      {totalItems === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <h2 className="mb-4 text-2xl font-semibold">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-lg text-slate-600">
            Vui lòng thêm sản phẩm vào giỏ hàng trước khi tiến hành thanh toán.
          </p>
          <Link
            href={"/cart"}
            className="mt-6 rounded-lg bg-blue-500 px-6 py-3 text-white transition hover:bg-blue-600"
          >
            Quay lại giỏ hàng
          </Link>
        </div>
      ) : (
        <div className={"mx-auto w-full max-w-7xl space-y-10 p-4"}>
          <CustomBreadcrumb
            items={[
              { label: "Giỏ hàng", href: "/cart" },
              { label: "Đặt hàng", href: "/checkout" },
            ]}
          />
          <h2 className={"text-h2"}>Đặt hàng</h2>
          {isProcessingPayment ? (
            isSuccessPayment ? (
              <div
                className={
                  "flex w-full flex-col items-center justify-center space-y-10"
                }
              >
                <Check className={"size-[400px]"} />
                <h2 className={"text-h2"}>Đặt hàng hoàn tất!</h2>
                <p className={"text-[16px]"}>
                  Điều hướng về trang chủ trong chốc lát...
                </p>
              </div>
            ) : (
              <div
                className={
                  "flex w-full flex-col items-center justify-center space-y-10"
                }
              >
                <Loader2 className={"size-[400px] animate-spin"} />
                <h2 className={"text-h2"}>
                  {methods.getValues("paymentMethod") !== "cod"
                    ? "Đang chuyển hướng đến cổng thanh toán..."
                    : "Đang xử lý đơn hàng..."}
                </h2>
                <p className={"text-[16px]"}>
                  {methods.getValues("paymentMethod") !== "cod"
                    ? "Quý khách vui lòng hoàn tất thanh toán"
                    : "Vui lòng chờ trong giây lát."}
                </p>
              </div>
            )
          ) : (
            <div className={"flex flex-col gap-4"}>
              <span className={"text-large"}>Thông tin đặt hàng</span>
              <form
                id={"checkout-form"}
                onSubmit={methods.handleSubmit(onSubmit)}
                className={"flex justify-between gap-6"}
              >
                <CheckoutForm />
                <div className={"flex w-fit flex-shrink-0 flex-col gap-4"}>
                  <OrderSummary OrderItems={order.orderItems} />
                  <CheckoutButton />
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </FormProvider>
  );
}
