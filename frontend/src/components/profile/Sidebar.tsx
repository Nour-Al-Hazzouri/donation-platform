'use client'

import { useState, useEffect } from "react"
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
import { useTheme } from "next-themes"

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
  // Check if screen is mobile for styling purposes only
  const [isMobile, setIsMobile] = useState(false)
  const { theme } = useTheme()
  const { logout, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

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

  const getSidebarMenuItems = () => [
    { 
      icon: User, 
      label: "Profile", 
      isActive: activeItem === "profile",
      onClick: () => handleNavigation('profile')
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      isActive: activeItem === "notifications",
      onClick: () => handleNavigation('notifications')
    },
    { 
      icon: LogOut, 
      label: "Log out", 
      isActive: false, 
      onClick: handleLogout 
    },
  ]

  const sidebarMenuItems = getSidebarMenuItems()
  
  return (
    <Sidebar className="w-64 border-r hidden md:block bg-background h-screen fixed">
      <SidebarContent className="pt-12">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* User Info */}
              <SidebarMenuItem>
                <div className="flex flex-col items-center space-y-3 px-2 py-4 rounded-md hover:bg-secondary/50">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profileImage} alt={fullName} />
                      <AvatarFallback className="bg-primary">
                        <User size={40} className="text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    {user?.verified && (
                      <img
                        src={theme === 'dark' ? "/verification-dark.png" : "/verification.png"}
                        alt="Verified"
                        className="absolute top-1 right-1 w-5 h-5"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-lg">{fullName}</span>
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Section Title */}
              <SidebarMenuItem>
                <div className="px-2 py-2">
                  <h3 className="text-primary font-medium text-sm">Explore panel</h3>
                </div>
              </SidebarMenuItem>
              
              {/* Menu Items */}
              {sidebarMenuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    className={cn(
                      item.isActive 
                        ? "bg-red-500 text-white hover:bg-red-600" // Active = Red
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                      "transition-colors duration-200"
                    )}
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
