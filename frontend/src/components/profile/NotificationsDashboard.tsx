"use client"

import { useState } from "react"
import { CheckCircle, MessageCircle, Heart, User as UserIcon } from "lucide-react"
import ProfileSidebar from "./Sidebar"
import { useAuthStore } from "@/lib/store/authStore"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface Notification {
  id: string
  avatar: string
  message: string
  timestamp: string
  isHighlighted?: boolean
}

const generateMockNotifications = (): Notification[] => [
  {
    id: `1-${crypto.randomUUID()}`,
    avatar: "/default-avatar.png",
    message: "Sarah Johnson donated $50 to Emergency Food Relief\nYour generous contribution will help provide meals for families in need.",
    timestamp: "2m ago",
  },
  {
    id: `2-${crypto.randomUUID()}`,
    avatar: "/default-avatar.png",
    message: "Ahmed Hassan requested Winter Clothing Drive\nLooking for warm clothes and blankets for displaced families.",
    timestamp: "5m ago",
  },
  {
    id: `3-${crypto.randomUUID()}`,
    avatar: "/default-avatar.png",
    message: "Your account has been verified\nYou now have access to all donation and request features.",
    timestamp: "10m ago",
  },
  {
    id: `4-${crypto.randomUUID()}`,
    avatar: "/default-avatar.png",
    message: "Account verification pending\nPlease check your email and complete the verification process.",
    timestamp: "15m ago",
  },
  {
    id: `5-${crypto.randomUUID()}`,
    avatar: "/default-avatar.png",
    message: 'Maria Rodriguez commented on your post\n"Thank you for organizing this amazing initiative!"',
    timestamp: "20m ago",
  }
]

interface NotificationsDashboardProps {
  onViewChange?: (view: 'profile' | 'notifications') => void
}

export default function NotificationsDashboard({ onViewChange }: NotificationsDashboardProps) {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>(() => generateMockNotifications())

  const loadMoreNotifications = () => {
    setNotifications(prev => [
      ...prev,
      ...generateMockNotifications().map(notif => ({
        ...notif,
        id: `${notif.id.split('-')[0]}-${crypto.randomUUID()}`
      }))
    ])
  }

  return (
    <section className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto lg:h-screen">
        <ProfileSidebar 
          activeItem="notifications" 
          fullName={user?.name || "Guest"} 
          profileImage={user?.profileImage}
          onViewChange={onViewChange}
        />

        <div className="flex-1 p-4 lg:p-8 lg:overflow-y-auto lg:h-screen">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#5a5a5a] mb-6">
              Notifications
            </h1>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                      <AvatarImage 
                        src={notification.avatar} 
                        alt="Notification avatar"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none'
                        }}
                      />
                      <AvatarFallback className="bg-gray-200">
                        <UserIcon size={20} className="text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="space-y-1">
                      {notification.message.split("\n").map((line, index) => (
                        <p
                          key={index}
                          className={`text-sm lg:text-base leading-relaxed ${
                            index === 0
                              ? notification.isHighlighted
                                ? "text-[#f90404] font-medium"
                                : "text-[#000000] font-medium"
                              : "text-[#5a5a5a]"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs lg:text-sm text-[#9ca3af] mt-2">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                className="text-[#f90404] hover:text-[#d90404] font-medium text-sm lg:text-base transition-colors"
                onClick={loadMoreNotifications}
              >
                Load more notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}