"use client"

import { useState, useEffect, useRef } from "react"
import { User, Bell, LogOut, Camera, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
import { toast } from "sonner"

interface SidebarProps {
  activeItem: "profile" | "notifications"
  fullName: string
  profileImage?: string
  onViewChange?: (view: 'profile' | 'notifications') => void
  onProfileUpdate?: () => void
}

export default function ProfileSidebar({ 
  activeItem, 
  fullName, 
  profileImage,
  onViewChange,
  onProfileUpdate
}: SidebarProps) {
  // Check if screen is mobile for styling purposes only
  const [isMobile, setIsMobile] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(profileImage)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const { logout, user, updateUserProfile } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Update avatar URL when user changes or when profileImage prop changes
  useEffect(() => {
    if (user && !isUploadingAvatar) {
      console.log('Avatar URL update check:', {
        avatar_url_full: user?.avatar_url_full,
        avatar_url: user?.avatar_url,
        profileImage,
        currentAvatarUrl
      })
      
      const newAvatarUrl = user?.avatar_url_full || user?.avatar_url || profileImage
      
      // Update if we have a new URL that's different from current
      if (newAvatarUrl && newAvatarUrl !== currentAvatarUrl) {
        console.log('Setting avatar URL to:', newAvatarUrl)
        setCurrentAvatarUrl(newAvatarUrl)
      } else if (!newAvatarUrl && currentAvatarUrl) {
        // Clear avatar URL if user no longer has one
        setCurrentAvatarUrl(undefined)
      }
    }
  }, [user, profileImage, currentAvatarUrl]) // Update when user, profileImage, or currentAvatarUrl changes

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

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, JPG, GIF, or WebP)')
      return
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB')
      return
    }

    setIsUploadingAvatar(true)
    
    // Create preview URL immediately for instant feedback
    const previewUrl = URL.createObjectURL(file)
    setCurrentAvatarUrl(previewUrl)
    
    try {
      console.log('Starting avatar upload...')
      const updatedUser = await updateUserProfile({ avatar_url: file })
      console.log('Upload response:', updatedUser)
      
      // Revoke the preview URL to prevent memory leaks
      URL.revokeObjectURL(previewUrl)
      
      // Update to the server URL after successful upload
      if (updatedUser && typeof updatedUser === 'object' && 'avatar_url_full' in updatedUser) {
        console.log('Upload successful, updating to server URL:', updatedUser.avatar_url_full)
        setCurrentAvatarUrl(updatedUser.avatar_url_full as string | undefined)
      }
      
      toast.success('Profile picture updated successfully!')
      
      // Trigger profile update callback if provided
      if (onProfileUpdate) {
        onProfileUpdate()
      }
    } catch (error: any) {
      console.error('Error updating profile picture:', error)
      // Clean up the preview URL on error
      URL.revokeObjectURL(previewUrl)
      // Revert to previous avatar
      const fallbackUrl = user?.avatar_url_full || user?.avatar_url || undefined
      setCurrentAvatarUrl(fallbackUrl)
      toast.error(error.response?.data?.message || 'Failed to update profile picture')
    } finally {
      setIsUploadingAvatar(false)
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveAvatar = async () => {
    if (!user?.avatar_url) return

    setIsUploadingAvatar(true)
    try {
      await updateUserProfile({ delete_avatar: true })
      
      // Clear local avatar URL
      setCurrentAvatarUrl(undefined)
      
      toast.success('Profile picture removed successfully!')
      
      // Trigger profile update callback if provided
      if (onProfileUpdate) {
        onProfileUpdate()
      }
    } catch (error: any) {
      console.error('Error removing profile picture:', error)
      toast.error(error.response?.data?.message || 'Failed to remove profile picture')
    } finally {
      setIsUploadingAvatar(false)
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
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                      {currentAvatarUrl ? (
                        <img 
                          src={currentAvatarUrl} 
                          alt={fullName}
                          className="w-full h-full object-cover"
                          onLoad={() => {
                            console.log('Avatar image loaded successfully:', currentAvatarUrl)
                          }}
                          onError={(e) => {
                            console.error('Avatar image failed to load:', currentAvatarUrl)
                            console.error('Error details:', e)
                            // Don't change the URL on error to prevent infinite loops
                            // Just log the error and keep the current state
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                          <User size={40} className="text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    
                    {/* Avatar Upload Overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      {isUploadingAvatar ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Button
                          onClick={handleAvatarClick}
                          variant="ghost"
                          size="sm"
                          className="h-auto p-2 text-white hover:bg-white/20"
                          disabled={isUploadingAvatar}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    
                    {user?.email_verified_at && (
                      <img
                        src={theme === 'dark' ? "/verification-dark.svg" : "/verification.png"}
                        alt="Verified"
                        className="absolute top-1 right-1 w-5 h-5 z-10"
                      />
                    )}
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-foreground text-lg">{fullName}</span>
                    {(currentAvatarUrl || user?.avatar_url_full || user?.avatar_url) && (
                      <Button
                        onClick={handleRemoveAvatar}
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground hover:text-destructive mt-1"
                        disabled={isUploadingAvatar}
                      >
                        Remove photo
                      </Button>
                    )}
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
                        ? "bg-red-500 text-white hover:bg-red-500 hover:text-white" // Active = Red
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