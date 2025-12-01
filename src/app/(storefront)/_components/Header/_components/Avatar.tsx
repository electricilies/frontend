"use client";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Avatar() {
  const session = useSession();
  return (
    <>
      {session.data?.user ? (
        <div
          className={"h-[40px] w-[40px] rounded-full bg-cover bg-center"}
          style={{ backgroundImage: `url('placeholderAvatar.png')` }}
        />
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
