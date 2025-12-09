"use client";
import { SidebarClose, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useUI } from "@/app/(cms)/_context/UIContext";
import Avatar from "@/app/(storefront)/_components/Header/_components/Avatar";

export default function CMSHeader() {
  const { setNavCollapsed } = useUI();

  return (
    <header className="flex h-[100px] w-full items-center justify-between bg-slate-200 px-6 py-4 shadow-xs">
      <div
        onClick={() => setNavCollapsed((prev) => !prev)}
        className="cursor-pointer"
      >
        <SidebarClose size={30} />
      </div>
      <div className="flex items-center justify-center gap-8">
        <Avatar mode={"cms"} />
        <LogOut
          onClick={() => signOut({ redirectTo: "/" })}
          size={30}
          className="cursor-pointer"
        />
      </div>
    </header>
  );
}
