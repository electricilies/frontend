import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className={"flex h-auto w-full flex-col bg-white text-black"}>
      <div
        className={
          "flex w-full items-center justify-between px-[calc(100%/10)] py-10"
        }
      >
        <div className={"text-subtle"}>Placeholder for logo</div>
        <div
          className={
            "font-cormorant flex flex-col items-center justify-center text-4xl opacity-55"
          }
        >
          <span className={"font-bold"}>
            CONTACT <span className={"font-normal"}>US</span>{" "}
          </span>
          <div className={"mt-4 flex items-center justify-between gap-6"}>
            <Facebook
              name={"facebook"}
              size={24}
              className={
                "cursor-pointer transition-opacity duration-300 hover:opacity-70"
              }
            />
            <Twitter
              name={"twitter"}
              size={24}
              className={
                "cursor-pointer transition-opacity duration-300 hover:opacity-70"
              }
            />
            <Instagram
              name={"instagram"}
              size={24}
              className={
                "cursor-pointer transition-opacity duration-300 hover:opacity-70"
              }
            />
            <Linkedin
              name={"linkedin"}
              size={24}
              className={
                "cursor-pointer transition-opacity duration-300 hover:opacity-70"
              }
            />
          </div>
        </div>
      </div>
      <div
        className={
          "text-md text-large w-full bg-slate-500 py-1 text-center text-white opacity-50"
        }
      >
        @ 2025 UIT. SE357 Course Project.
      </div>
    </footer>
  );
}
