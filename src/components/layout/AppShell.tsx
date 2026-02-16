import { Sidebar } from "@/components/layout/Sidebar";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { CommandPalette } from "@/components/layout/CommandPalette";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-textPrimary">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="w-full pb-20 lg:pb-0">{children}</main>
      </div>
      <MobileTabBar />
      <CommandPalette />
    </div>
  );
}
