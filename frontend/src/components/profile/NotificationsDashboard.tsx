"use client"

import { useState } from "react"
import { CheckCircle, MessageCircle, Heart, User as UserIcon } from "lucide-react"
import ProfileSidebar from "./Sidebar"
import { useAuthStore } from "@/store/store/authStore"
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
    <section className="bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full lg:w-64 shrink-0 md:fixed md:left-0 md:top-0 md:bottom-0 md:pt-16 md:z-10">
          <div className="hidden md:block">
            <ProfileSidebar 
              activeItem="notifications" 
              fullName={user?.name || "Guest"} 
              profileImage={user?.profileImage}
              onViewChange={onViewChange}
            />
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8 lg:overflow-y-auto md:ml-64">
          <div className="max-w-4xl">
            <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-6">
              Notifications
            </h1>
            
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow"
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
                      <AvatarFallback className="bg-muted">
                        <UserIcon size={20} className="text-muted-foreground" />
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
                                ? "text-primary font-medium"
                                : "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                    <p className="text-xs lg:text-sm text-muted-foreground mt-2">{notification.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button 
                className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm lg:text-base transition-colors px-4 py-2 rounded-lg"
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