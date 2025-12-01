"use client";
import { Users } from "lucide-react";

export function UserButton() {
  return (
    <Users
      size={30}
      className={
        "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
      }
    />
  );
}
