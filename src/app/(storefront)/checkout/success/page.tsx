"use client";
import { Check } from "lucide-react";
import { useEffect } from "react";

export default function CheckoutSuccessPage() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className={"flex w-full flex-col items-center justify-center space-y-10"}
    >
      <Check className={"size-[400px]"} />
      <h2 className={"text-h2"}>Đặt hàng hoàn tất!</h2>
      <p className={"text-[16px]"}>Điều hướng về trang chủ trong chốc lát...</p>
    </div>
  );
}
