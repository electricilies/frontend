"use client";
import { LogIn } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Avatar({ mode }: { mode: "cms" | "storefront" }) {
  const session = useSession();

  return (
    <>
      {session.data?.user ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={
                  "h-[40px] w-[40px] cursor-pointer rounded-full bg-cover bg-center"
                }
                style={{
                  backgroundImage: `url('/images/placeholderAvatar.png')`,
                }}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className={"w-40"} align={"center"}>
              <DropdownMenuItem>
                <strong>{session.data.user.email}</strong>
              </DropdownMenuItem>
              {(session.data.role === "admin" ||
                session.data.role === "staff") && (
                <DropdownMenuItem>
                  <Link href={mode === "cms" ? "/" : "/admin"}>
                    {mode === "cms" ? "Storefront" : "Admin Panel"}
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <button onClick={() => signOut()}>Sign Out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <LogIn
          size={30}
          className={
            "cursor-pointer text-black transition-all duration-200 hover:text-slate-400"
          }
        />
      )}
    </>
  );
}
