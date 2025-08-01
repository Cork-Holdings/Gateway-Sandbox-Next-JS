"use client"
import React, { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/custom/app-sidebar";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from 'next-themes';

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme(); // <-- moved outside condition
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Only block rendering, NOT hook execution
  if (!session) {
    return null; // safe return for SSR fallback
  }

  return (
    <main className="flex h-screen w-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <div className="p-4">
            <SidebarTrigger />
            <div className="flex-1 pt-[70px]">
              {mounted && (
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-200"
                  onClick={toggleTheme}
                >
                  {theme === "dark" ? 
                    <FaSun className="h-4 w-4 text-yellow-500" /> : 
                    <FaMoon className="h-4 w-4 text-slate-700" />
                  }
                </Button>
              )}
              <div className="relative">{children}</div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    </main>
  );
}
