import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AttributeResponse } from "@/types/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fetcher = (
  url: string,
  token: string,
): Promise<AttributeResponse> =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
