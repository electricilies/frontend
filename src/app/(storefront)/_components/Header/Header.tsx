import { List, Search, Users, Newspaper, ShoppingCart } from "lucide-react";
import { MenuButton } from "@/app/(storefront)/_components/Header/_components/MenuButton";
import SearchBar from "@/app/(storefront)/_components/Header/_components/SearchBar";
import { DocumentButton } from "@/app/(storefront)/_components/Header/_components/DocumentButton";
import { CartButton } from "@/app/(storefront)/_components/Header/_components/CartButton";
import { UserButton } from "@/app/(storefront)/_components/Header/_components/UserButton";
import Avatar from "@/app/(storefront)/_components/Header/_components/Avatar";

export default async function Header() {
  return (
    <header
      className={
        "flex w-full items-center justify-center gap-5 border-1 border-slate-400 bg-slate-200 py-2 text-black"
      }
    >
      <div className={"text-subtle"}>Placeholder for logo</div>
      <MenuButton />
      <SearchBar />
      <div className={"flex items-center justify-center gap-5 py-1"}>
        <UserButton />
        <DocumentButton />
        <CartButton />
        <Avatar />
      </div>
    </header>
  );
}
