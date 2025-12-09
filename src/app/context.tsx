"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { OptionValue } from "@/types/types";

export interface OrderItem {
  productId: string;
  productVariantId: string;
  quantity: number;

  name?: string;
  price?: number;
  image?: string;
  options: OptionValue[];
}

interface OrderContextType {
  orderItems: OrderItem[];
  setOrderItems: (
    items: OrderItem[],
    lastUpdatedFrom: "product_page" | "cart_page" | null,
  ) => void;
  clearOrderItems: () => void;
  subtotal: number;
  lastUpdatedFrom: "product_page" | "cart_page" | null;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orderItems, setOrderItemsState] = useState<OrderItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(true);
  const [lastUpdatedFrom, setLastUpdatedFrom] = useState<
    "product_page" | "cart_page" | null
  >(null);

  useEffect(() => {
    const savedItems = sessionStorage.getItem("checkout_items");
    if (savedItems) {
      try {
        setOrderItemsState(JSON.parse(savedItems));
      } catch (e) {
        console.error("Failed to parse checkout items", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const setOrderItems = (
    items: OrderItem[],
    lastUpdatedFrom: "product_page" | "cart_page" | null,
  ) => {
    setOrderItemsState(items);
    setLastUpdatedFrom(lastUpdatedFrom);
    sessionStorage.setItem("order_items", JSON.stringify(items));
    sessionStorage.setItem("order_last_updated_from", lastUpdatedFrom || "");
  };

  const clearOrderItems = () => {
    setOrderItemsState([]);
    sessionStorage.removeItem("order_items");
  };

  const subtotal = orderItems.reduce((total, item) => {
    return total + (item.price || 0) * item.quantity;
  }, 0);

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        setOrderItems,
        clearOrderItems,
        subtotal,
        lastUpdatedFrom,
      }}
    >
      {isLoaded && children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("must be used within an OrderProvider");
  }
  return context;
}
