"use client";
import { useState } from "react";
import Image from "next/image";
import { DynamicIcon, IconName } from "lucide-react/dynamic";
import { motion } from "framer-motion";
import { useUI } from "../_context/UIContext";

interface NavItem {
  label: string;
  icon?: IconName;
  href: string | null;
  type: "main" | "sub" | "parent";
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "layout-list", href: "/admin", type: "main" },
  {
    label: "Attributes",
    icon: "component",
    href: "/admin/attributes",
    type: "main",
  },
  {
    label: "Categories",
    icon: "list",
    href: "/admin/categories",
    type: "main",
  },
  { label: "Products", icon: "package-2", href: null, type: "parent" },
  { label: "Product List", href: "/admin/products", type: "sub" },
  { label: "Add Product", href: "/admin/products/add", type: "sub" },
];

export default function NavigationBar() {
  const { isNavCollapsed } = useUI();
  const [isOpen, setIsOpen] = useState<Map<string, boolean>>(
    new Map(
      navItems
        .filter((item) => item.type === "parent")
        .map((item) => [item.label, false]),
    ),
  );
  const toggleSubMenu = (label: string) => {
    setIsOpen((prev) => new Map(prev).set(label, !prev.get(label)));
  };

  return (
    <motion.nav
      className={`${isNavCollapsed ? "w-0" : "w-64"} flex min-h-screen flex-col bg-slate-200 text-white`}
      initial={{ width: isNavCollapsed ? 0 : 256 }}
      animate={{ width: isNavCollapsed ? 0 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <p
        className={
          "text-subtle h-[100px] w-auto p-[25px] text-center text-black"
        }
      >
        Placeholder for logo
      </p>
      {/*<Image src={'/logo.svg'} alt={'logo'} width={200} height={75} className={'w-auto h-[100px] p-[25px] bg-background-darker'}/>*/}
      <ul className="text-h4 flex-1 overflow-y-auto">
        {navItems.map((item, index) => {
          if (item.type === "main") {
            return (
              <li key={index}>
                <a
                  href={item.href || "#"}
                  className="flex items-center bg-slate-300 p-4 text-black transition-all duration-200 hover:bg-slate-200"
                >
                  {item.icon && (
                    <DynamicIcon name={item.icon} size={25} className="mr-3" />
                  )}
                  {item.label}
                </a>
              </li>
            );
          } else if (item.type === "parent") {
            return (
              <li key={index}>
                <button
                  onClick={() => toggleSubMenu(item.label)}
                  className="flex w-full cursor-pointer items-center justify-between bg-slate-300 p-4 text-left text-black transition-all duration-200 hover:bg-slate-200"
                >
                  <div className="flex items-center">
                    {item.icon && (
                      <DynamicIcon
                        name={item.icon}
                        size={25}
                        className="mr-3"
                      />
                    )}
                    {item.label}
                  </div>
                  {isOpen.get(item.label) ? (
                    <DynamicIcon name={"chevron-down"} size={30} />
                  ) : (
                    <DynamicIcon name={"chevron-up"} size={30} />
                  )}
                </button>
                {isOpen.get(item.label) && (
                  <ul className="bg-gray-100">
                    {navItems
                      .filter(
                        (subItem) =>
                          subItem.type === "sub" &&
                          navItems.indexOf(subItem) > index &&
                          (navItems.indexOf(subItem) <
                            navItems.findIndex(
                              (i) =>
                                i.type === "parent" &&
                                navItems.indexOf(i) > index,
                            ) ||
                            navItems.findIndex(
                              (i) =>
                                i.type === "parent" &&
                                navItems.indexOf(i) > index,
                            ) === -1),
                      )
                      .map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            href={subItem.href || "#"}
                            className="text-subtle-semibold flex items-center p-4 pl-8 text-black transition-all duration-200 hover:bg-gray-100"
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                  </ul>
                )}
              </li>
            );
          }
        })}
      </ul>
    </motion.nav>
  );
}
