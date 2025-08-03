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
import { LayoutDashboard, FileText, Users, ChevronRight } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" 

export function DashboardSidebar() {
  return (
    <Sidebar className="border-r">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Avatar Menu Item */}
              <SidebarMenuItem>
              <div className="flex items-center space-x-3 px-2 py-2 rounded-md hover:bg-gray-50">
              <Avatar className="w-10 h-10">
              <AvatarImage src="admin.jpg" alt="Admin" />
              <AvatarFallback className="bg-yellow-400 text-white font-semibold">A</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
              <span className="font-semibold text-gray-900 text-sm">Admin</span>
              <span className="text-xs text-gray-500">Administrator</span>
              </div>
              </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive className="bg-red-50 text-red-600 hover:bg-red-100">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  <FileText className="h-4 w-4" />
                  <span>manage blogs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

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
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton className="text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                          <span>All</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton className="text-gray-500 hover:text-gray-700 hover:bg-gray-50">
                          <span>Verification Requests</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
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
