import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/App-sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 flex flex-col">
        <SidebarTrigger />
        <div className="flex-1 flex justify-center items-start p-4">
          <div className="w-full max-w-4xl">
            <Outlet />
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
