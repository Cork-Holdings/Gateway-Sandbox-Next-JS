"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ChevronUp, Command, Settings2, User2, ShieldCheck, Home } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
// import { usePathname } from "nextnavigation" // Added to dynamically highlight colors based on current route

const items = [
    {
        title: "Overview",
        url: "/merchant/dashboard",
        icon: Home,
    },
    {
        title: "APIs",
        url: "/merchant/apis",
        icon: Command,
    },
    {
        title: "Credentials",
        url: "/merchant/credentials",
        icon: Settings2,
    },
    {
        title: "Profile",
        url: "/merchant/profile",
        icon: User2,
    },
]

export function MerchantSidebar() {
    const pathname = usePathname()

    const { data: session } = useSession()

    return (
        // 1. Used secondary color #3B3C8C for the deep background fill and updated text color for readability
        <Sidebar className="border-r border-[#3B3C8C]/20 bg-[#3B3C8C] text-slate-100">

            {/* Header branding slot */}
            <SidebarHeader className="border-b border-white/10 p-4">
                {/* <div className="flex items-center gap-2 px-2 py-1.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00AEEF] text-white shadow-md">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    {state !== "collapsed" && (
                        <div className="flex flex-col gap-0.5 leading-none">
                            <span className="font-bold tracking-tight text-white">Merchant Portal</span>
                        </div>
                    )}
                </div> */}
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <img
                        loading="eager"
                        src="/images/GEEPAY-LOGO(main-white).png" alt="Logo" className="w-full" />
                </div>
            </SidebarHeader>

            <SidebarContent className="p-3">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1.5">
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            // 2. Added dynamic styling. If item is active, it takes the Primary color #00AEEF
                                            className={`w-full transition-all duration-200 group-hover:bg-white/5 font-medium px-4 py-5 rounded-xl flex items-center gap-3
                                                ${isActive
                                                    ? "bg-[#00AEEF] text-white shadow-lg shadow-[#00AEEF]/20 font-semibold"
                                                    : "text-slate-200 hover:bg-white/10 hover:text-white"
                                                }`}
                                        >
                                            <a href={item.url} className="flex items-center w-full gap-3">
                                                {/* Primary Color accent on icons when not highlighted */}
                                                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-[#00AEEF]"}`} />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer Workspace Slot */}
            <SidebarFooter className="p-4 border-t border-white/10">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full justify-between py-5 px-3 rounded-xl hover:bg-white/10 text-slate-100 transition-colors">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-6 w-6 rounded-full bg-[#00AEEF]/20 flex items-center justify-center border border-[#00AEEF]/40">
                                            <User2 className="h-3.5 w-3.5 text-[#00AEEF]" />
                                        </div>
                                        <span className="text-sm font-medium">{session?.email}</span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="center"
                                className="w-[200px] mb-2 bg-[#3B3C8C] text-white border border-white/10 shadow-xl rounded-xl p-1"
                            >
                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/auth/signin/merchant" })}
                                    className="cursor-pointer font-medium p-2.5 rounded-lg text-rose-200 hover:bg-rose-500/20 hover:text-rose-100 transition-colors focus:bg-rose-500/20"
                                >
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}