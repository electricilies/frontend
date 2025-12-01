"use client";
import { List } from "lucide-react";

export function MenuButton() {
  return (
    <List
      size={30}
      className={
        "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
      }
    />
  );
}
