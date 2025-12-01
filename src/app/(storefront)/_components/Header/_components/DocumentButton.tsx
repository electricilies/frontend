"use client";
import { Newspaper } from "lucide-react";

export function DocumentButton() {
  return (
    <Newspaper
      size={30}
      className={
        "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
      }
    />
  );
}
