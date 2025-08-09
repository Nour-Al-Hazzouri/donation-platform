"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Users, ChevronRight, MapPin } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" 

// Mock data for admin profile
const ADMIN_PROFILE = {
  name: "Admin",
  role: "Administrator",
  avatar: "admin.jpg",
  avatarFallback: "A"
}

// Mock data for sidebar menu items
const SIDEBAR_MENU_ITEMS = [
  { 
    href: "/admin", 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    isActive: true 
  },
  { 
    href: "/admin/blogs", 
    icon: FileText, 
    label: "manage blogs", 
    isActive: false 
  },
  { 
    href: "/admin/locations", 
    icon: MapPin, 
    label: "manage location", 
    isActive: false 
  }
]

// Mock data for user management submenu
const USER_MANAGEMENT_SUBMENU = [
  { href: "/admin/users", label: "All" },
  { href: "/admin/users?tab=verification", label: "Verification Requests" }
]

export function DashboardSidebar() {
  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Avatar Menu Item */}
              <SidebarMenuItem>
                <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-gray-50">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={ADMIN_PROFILE.avatar} alt={ADMIN_PROFILE.name} />
                    <AvatarFallback className="bg-yellow-400 text-white font-semibold">{ADMIN_PROFILE.avatarFallback}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-sm">{ADMIN_PROFILE.name}</span>
                    <span className="text-xs text-gray-500">{ADMIN_PROFILE.role}</span>
                  </div>
                </div>
              </SidebarMenuItem>
              {/* Main menu items */}
              {SIDEBAR_MENU_ITEMS.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    className={item.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"}
                    asChild
                  >
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                      <Users className="h-4 w-4" />
                      <span>manage Users</span>
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {USER_MANAGEMENT_SUBMENU.map((item, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuSubButton 
                            className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            asChild
                          >
                            <a href={item.href}>{item.label}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
