"use client"

import { User, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/utils"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ThemeToggleProvider } from "@/components/common/ThemeToggleProvider"

interface SidebarProps {
  activeItem: "profile" | "notifications"
  fullName: string
  profileImage?: string
  onViewChange?: (view: 'profile' | 'notifications') => void
}

export default function ProfileSidebar({ 
  activeItem, 
  fullName, 
  profileImage,
  onViewChange
}: SidebarProps) {
  const { logout, user } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const handleNavigation = (view: 'profile' | 'notifications') => {
    if (onViewChange) {
      onViewChange(view)
    } else {
      router.push(`/${view}`)
    }
  }

  // Define sidebar menu items
  const getSidebarMenuItems = () => [
    { 
      href: "#", 
      icon: User, 
      label: "Profile", 
      isActive: activeItem === "profile",
      onClick: () => handleNavigation('profile')
    },
    { 
      href: "#", 
      icon: Bell, 
      label: "Notifications", 
      isActive: activeItem === "notifications",
      onClick: () => handleNavigation('notifications')
    },
    { 
      href: "#", 
      icon: LogOut, 
      label: "Log out", 
      isActive: false, 
      onClick: handleLogout 
    },
  ]

  const sidebarMenuItems = getSidebarMenuItems()
  
  return (
    <Sidebar className="w-64 border-r">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Avatar Menu Item */}
              <SidebarMenuItem>
                <div className="flex flex-col items-center space-y-3 px-2 py-4 rounded-md hover:bg-secondary/50">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profileImage} alt={fullName} />
                      <AvatarFallback className="bg-primary">
                        <User size={40} className="text-white" />
                      </AvatarFallback>
                    </Avatar>
                    {user?.verified && (
                      <img
                        src="/verification.png"
                        alt="Verified"
                        className="absolute top-1 right-1 w-5 h-5"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-lg">{fullName}</span>
                  </div>
                  <ThemeToggleProvider className="mt-2" />
                </div>
              </SidebarMenuItem>
              
              {/* Section Title */}
              <SidebarMenuItem>
                <div className="px-2 py-2">
                  <h3 className="text-primary font-medium text-sm">Explore panel</h3>
                </div>
              </SidebarMenuItem>
              
              {/* Main menu items */}
              {sidebarMenuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    isActive={item.isActive}
                    className={item.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                    onClick={item.onClick}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
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