import NavigationBar from "@/app/(cms)/_components/NavigationBar";
import CMSHeader from "@/app/(cms)/_components/Header";
import { UIProvider } from "@/app/(cms)/_context/UIContext";
import CMSFooter from "@/app/(cms)/_components/Footer";
import { Toaster } from "@/components/ui/sonner";

export default function CMSLayout({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-100">
        <Toaster position="bottom-right" richColors theme={"light"} />
        <NavigationBar />
        <div className={"flex h-full w-full flex-col justify-between"}>
          <CMSHeader />
          <main className="m-6 mt-4 flex flex-1 flex-col gap-4 overflow-y-auto">
            <div
              className={
                "min-h-full overflow-y-scroll rounded-lg p-6 shadow-md"
              }
            >
              {children}
            </div>
          </main>
          <CMSFooter />
        </div>
      </div>
    </UIProvider>
  );
}
