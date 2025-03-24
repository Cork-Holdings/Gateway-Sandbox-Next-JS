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
import { CalendarCheck, ChevronDown, ChevronUp, Component, Eye, FileCheck, FolderCode, FolderCog, FolderCog2, Grid2X2Plus, LucideLayoutDashboard, MessageCircle, PenIcon, Shapes, SquarePen, TvMinimalPlay, User, User2, UserPlus2, Users, Users2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"
import { signOut } from "next-auth/react"


const items = [

    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LucideLayoutDashboard,
    },
  


]


const projects = [
    {
        title: "Create Project",
        url: "/admin/projects/create",
        icon: Grid2X2Plus,
    },

    {
        title: "Manage Projects",
        url: "/admin/projects",
        icon: FolderCode,
    },
]

const admin = [
    {
        title: "Add User",
        url: "/admin/user/create",
        icon: UserPlus2,
    },

    {
        title: "Manage Users",
        url: "/admin/users",
        icon: FolderCog2,
    },
]


const merchants = [
    {
        title: "Onboard Merchant",
        url: "/admin/merchants/create/step-1",
        icon: UserPlus2,
    },

    {
        title: "Manage Merchants",
        url: "/admin/merchants",
        icon: FolderCog,
    },
    
    {
        title: "Current Applications",
        url: "/admin/merchants/applications",
        icon: FileCheck,
    },
]


export function AppSidebar() {

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
                                Projects
                                <ChevronDown className="group-data-[state=open]/collapsible:rotate-180 ml-auto transition-transform" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {projects.map((item) => (
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
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                Merchants
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
                <Collapsible defaultOpen className="group/collapsible">
                    <SidebarGroup>
                        <SidebarGroupLabel asChild>
                            <CollapsibleTrigger>
                                User Management
                                <ChevronDown className="group-data-[state=open]/collapsible:rotate-180 ml-auto transition-transform" />
                            </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {admin.map((item) => (
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
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}