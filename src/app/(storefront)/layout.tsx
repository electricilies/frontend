import Header from "@/app/(storefront)/_components/Header/Header";
import Footer from "@/app/(storefront)/_components/Footer/Footer";

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-white">
      <div className="flex-grow">
        <Header />
        <div className={"flex flex-col items-center"}>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
