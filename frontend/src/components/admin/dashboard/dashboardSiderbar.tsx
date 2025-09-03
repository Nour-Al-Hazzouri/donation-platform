"use client"
//comment
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, Users, MapPin } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"

const getSidebarMenuItems = (pathname: string) => [
  { 
    href: "/admin/dashboard", 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    isActive: pathname === "/admin/dashboard"
  },
  {
    href: "/admin/blogs",
    icon: FileText,
    label: "manage blogs",
    isActive: pathname.startsWith("/admin/blogs"),
  },
  {
    href: "/admin/locations",
    icon: MapPin,
    label: "manage location",
    isActive: pathname.startsWith("/admin/locations"),
  },
  {
    href: "/admin/users",
    icon: Users,
    label: "manage users",
    isActive: pathname.startsWith("/admin/users"),
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const sidebarMenuItems = getSidebarMenuItems(pathname)
  const { user } = useAuthStore()

  // Get admin profile data from current user
  const adminProfile = {
    name: user ? `${user.first_name} ${user.last_name}` : "Admin",
    role: user?.isAdmin ? "Administrator" : "User",
    avatar: user?.avatar_url_full || user?.avatar_url || "/placeholder.svg?height=40&width=40&text=Admin",
    avatarFallback: user ? user.first_name.charAt(0).toUpperCase() : "A",
  }

  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Avatar Menu Item */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-secondary/50">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={adminProfile.avatar} alt={adminProfile.name} />
                      <AvatarFallback className="bg-red-500 text-white font-semibold">
                        {adminProfile.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-sm">{adminProfile.name}</span>
                      <span className="text-xs text-muted-foreground">{adminProfile.role}</span>
                    </div>
                  </div>
                </div>
              </SidebarMenuItem>
              {/* Main menu items */}
              {sidebarMenuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className={
                      item.isActive
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        : "text-muted-foreground hover:text-red-500 hover:bg-secondary/50"
                    }
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
