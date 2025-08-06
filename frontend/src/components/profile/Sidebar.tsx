"use client"

import { User, Bell, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

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

  const menuItems = [
    { 
      icon: User, 
      label: "Profile", 
      active: activeItem === "profile",
      onClick: () => handleNavigation('profile')
    },
    { 
      icon: Bell, 
      label: "Notifications", 
      active: activeItem === "notifications",
      onClick: () => handleNavigation('notifications')
    },
    { 
      icon: LogOut, 
      label: "Log out", 
      active: false, 
      onClick: handleLogout 
    },
  ]

  return (
    <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-4 -ml-4 lg:-ml-48 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
      <div className="text-center mb-6">
        <div className="relative inline-block mb-3">
          <Avatar className="w-20 h-20 lg:w-24 lg:h-24 bg-black rounded-full">
            <AvatarImage src={profileImage} />
            <AvatarFallback className="bg-black">
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
        <h2 className="text-lg lg:text-xl font-semibold text-[#000000]">{fullName}</h2>
      </div>

      <div className="space-y-1">
        <h3 className="text-[#f90404] font-medium text-sm lg:text-base mb-3">Explore panel</h3>
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
              item.active ? "bg-[#f90404] text-white" : "text-[#000000] hover:bg-gray-100"
            )}
            onClick={item.onClick}
          >
            <div
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center",
                item.active ? "bg-white bg-opacity-20" : "bg-[#f90404]"
              )}
            >
              <item.icon size={14} className="text-white" />
            </div>
            <span className="text-sm lg:text-base">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}