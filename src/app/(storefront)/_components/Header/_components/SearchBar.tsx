"use client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Product, ProductResponse } from "@/types/types";
import Image from "next/image";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleSearch = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products?search=${searchTerm}`,
      );
      const data: ProductResponse = await res.json();
      console.log(results);
      setResults(data.data);
    };

    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        handleSearch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleOutOfFocus = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  return (
    <div className={"relative w-1/2"}>
      <div className={"flex w-full items-center gap-2 rounded-full bg-white"}>
        <Search size={16} opacity={50} className={"ml-3"} />
        <input
          className={"h-full w-full rounded-r-full py-3 focus:outline-none"}
          type="text"
          placeholder="Nhập tên sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => handleOutOfFocus()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              window.location.href = `/products?search=${searchTerm}`;
            }
          }}
        />
        {isFocused && results.length > 0 && (
          <div
            className={
              "absolute top-full z-10 w-full flex-col rounded-md bg-white shadow-lg"
            }
          >
            {results.map((product) => (
              <a
                href={`/products/${product.id}`}
                onMouseEnter={(e) => e.preventDefault()}
                key={product.id}
                className={"flex cursor-pointer px-4 py-2 hover:bg-gray-100"}
              >
                <Image
                  src={
                    product.images
                      ? product.images[0].url
                      : "/images/fallbackProductImage.png"
                  }
                  alt={product.name}
                  width={40}
                  height={40}
                  className={"mr-4 h-[40px] w-[40px] rounded-md object-contain"}
                />
                <span className={"line-clamp-2"}>{product.name}</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
