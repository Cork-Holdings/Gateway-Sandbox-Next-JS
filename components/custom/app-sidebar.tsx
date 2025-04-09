"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ChevronDown, ChevronUp,  FolderCog, LucideLayoutDashboard, Settings, User2, UserPlus2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"


const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LucideLayoutDashboard,  
    },
]



const merchants = [
    {
        title: "Create Merchant",
        url: "/admin/merchants/create",
        icon: UserPlus2,
    },

    {
        title: "Manage Merchants",
        url: "/admin/merchants",
        icon: FolderCog,
    },
    
    {
        title: "System Users",
        url: "/admin/sys-users",
        icon: Settings,
    },

 
]


export function AppSidebar() {

    const router = useRouter()

    const {

    } = useSidebar()
    return (
        <Sidebar>
            <SidebarHeader>
                <p></p>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Users
                                <ChevronDown className="group-data-[state=open]/collapsible:rotate-180 ml-auto transition-transform" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {merchants.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <a href={item.url}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </SidebarGroup>
                </Collapsible>
                
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <User2 /> Admin
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >

                                <DropdownMenuItem
                                    onClick={() => signOut({ callbackUrl: "/auth/signin/admin" })}
                                >
                                    <span>Sign out</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => router.push("/admin/profile")}
                                >
                                    <span>Profile</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}