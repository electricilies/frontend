"use client";

import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/app/(storefront)/checkout/_components/PhoneInput";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Controller, useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function CheckoutForm() {
  const { control } = useFormContext();

  return (
    <div
      className={
        "flex max-w-[800px] min-w-[650px] flex-grow flex-col gap-4 rounded-lg border border-slate-400 bg-slate-100 p-6"
      }
    >
      <Controller
        name="fullName"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={"fullName"}>Họ và tên</FieldLabel>
            <Input
              {...field}
              placeholder="Nhập họ và tên"
              aria-invalid={fieldState.invalid}
              className={"bg-white"}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={"phone"}>Số điện thoại</FieldLabel>
            <PhoneInput
              defaultCountry={"VN"}
              aria-invalid={fieldState.invalid}
              className={"bg-white"}
              {...field}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"address"}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={"address"}>Địa chỉ giao hàng</FieldLabel>
            <Textarea
              {...field}
              placeholder="Nhập địa chỉ giao hàng"
              aria-invalid={fieldState.invalid}
              className={"bg-white"}
            />
            {fieldState.invalid && (
              <FieldError>{fieldState.error?.message}</FieldError>
            )}
          </Field>
        )}
      />
      <Controller
        name={"paymentMethod"}
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={"paymentMethod"}>
              Phương thức thanh toán
            </FieldLabel>
            <RadioGroup
              {...field}
              className={"flex flex-col gap-1"}
              defaultValue={"cod"}
              onValueChange={field.onChange}
            >
              <div className={"flex items-center space-x-2"}>
                <RadioGroupItem
                  className={"bg-white"}
                  value={"cod"}
                  id={"cod"}
                />
                <Label className={"text-body"} htmlFor={"cod"}>
                  Thanh toán khi nhận hàng (COD)
                </Label>
              </div>
              <div className={"flex items-center space-x-2"}>
                <RadioGroupItem
                  className={"bg-white"}
                  value={"vnpay"}
                  id={"vnpay"}
                />
                <Label className={"text-body"} htmlFor={"vnpay"}>
                  VNPay
                </Label>
              </div>
              <div className={"flex items-center space-x-2"}>
                <RadioGroupItem
                  className={"bg-white"}
                  value={"momo"}
                  id={"momo"}
                />
                <Label className={"text-body"} htmlFor={"momo"}>
                  MoMo
                </Label>
              </div>
              <div className={"flex items-center space-x-2"}>
                <RadioGroupItem
                  className={"bg-white"}
                  value={"zalopay"}
                  id={"zalopay"}
                />
                <Label className={"text-body"} htmlFor={"zalopay"}>
                  ZaloPay
                </Label>
              </div>
            </RadioGroup>
          </Field>
        )}
      />
    </div>
  );
}
