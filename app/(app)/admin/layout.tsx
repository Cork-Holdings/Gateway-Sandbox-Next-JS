"use client"
import React, {  } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";
import { AppSidebar } from "@/components/custom/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode; }) {
    const {data:session} = useSession()
    if(!session){
      return
    }

    
return (
  <main className="flex h-screen">
  <SidebarProvider>
    <AppSidebar  />
    <div className="flex flex-col flex-1">
      <div className="p-4">
        <SidebarTrigger />
        {children}
      </div>
    </div>
  </SidebarProvider>
</main>
  
)
}