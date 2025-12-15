import Header from "@/app/(storefront)/_components/Header/Header";
import Footer from "@/app/(storefront)/_components/Footer/Footer";
import { OrderProvider } from "@/app/context/OrderContext";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Storefront",
    default: "Storefront",
  },
};

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <OrderProvider>
      <div className="mx-auto flex min-h-screen w-full flex-col bg-white">
        <div className="flex-grow">
          <Toaster position="bottom-right" richColors theme={"light"} />
          <Header />
          <div className={"flex flex-col items-center"}>{children}</div>
        </div>
        <Footer />
      </div>
    </OrderProvider>
  );
}
