// frontend/src/components/profile/NotificationsDashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { CheckCircle, MessageCircle, Heart, User as UserIcon, Megaphone, ShieldCheck } from "lucide-react"
import ProfileSidebar from "./Sidebar"
import { useAuthStore } from "@/store/authStore"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { notificationService, Notification } from "@/lib/api/notifications"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"

interface NotificationsDashboardProps {
  onViewChange?: (view: 'profile' | 'notifications') => void
}

export default function NotificationsDashboard({ onViewChange }: NotificationsDashboardProps) {
  const { user } = useAuthStore()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  useEffect(() => {
    setNotifications([])
    setPage(1)
    fetchNotifications(true)
    fetchUnreadCount()
    // eslint-disable-next-line
  }, [user?.id, user?.isAdmin])

  const fetchNotifications = async (reset = false) => {
    try {
      setLoading(true)
      const params: any = {
        page: reset ? 1 : page,
        per_page: 10,
      }
      const response = await notificationService.list(params)
      if (response && response.data) {
        setNotifications(prev =>
          reset ? response.data : [...prev, ...response.data]
        )
        if (response.meta) {
          setPagination({
            current_page: response.meta.current_page,
            last_page: response.meta.last_page,
            per_page: response.meta.per_page,
            total: response.meta.total
          })
          setHasMore(response.meta.current_page < response.meta.last_page)
        }
        setPage(prev => reset ? 2 : prev + 1)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount()
      setUnreadCount(response.unread_count)
    } catch (error) {
      console.error("Failed to fetch unread count:", error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId)
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  // Recognize all possible transaction and admin action notification types
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'transaction_contribution':
      case 'transaction_claim':
      case 'contribution':
      case 'claim':
      case 'donation_contribution':
      case 'donation_claim':
      case 'admin_transaction':
      case 'admin_request':
        return <CheckCircle className="text-green-500" size={20} />
      case 'admin_action':
      case 'admin_approved':
      case 'admin_rejected':
        return <ShieldCheck className="text-blue-500" size={20} />
      case 'new_comment':
        return <MessageCircle className="text-blue-500" size={20} />
      case 'post_upvoted':
      case 'post_downvoted':
        return <Heart className="text-red-500" size={20} />
      case 'new_announcement':
        return <Megaphone className="text-yellow-500" size={20} />
      default:
        return <UserIcon className="text-gray-500" size={20} />
    }
  }

  // Render notification messages for both user and admin actions
  const formatNotificationMessage = (notification: Notification) => {
    const { type, related_user, data, message, user: notifUser } = notification

    // Transaction/donation/request logic for both admin and normal users
    if (
      [
        'transaction_contribution',
        'contribution',
        'donation_contribution',
        'admin_transaction'
      ].includes(type.name)
    ) {
      // If the notification is for the current user (self), show confirmation
      if (notifUser?.id === user?.id) {
        if (user?.isAdmin) {
          return `You (Admin) have successfully donated $${data?.amount || ''}${data?.event_type ? ` to ${data.event_type}` : ''}.`
        }
        return `You have successfully donated $${data?.amount || ''}${data?.event_type ? ` to ${data.event_type}` : ''}.`
      }
      // If the notification is for admin (and not self), show admin message
      if (user?.isAdmin) {
        return `New donation received from ${related_user?.first_name || 'a user'}${data?.amount ? ` ($${data.amount})` : ''}.`
      }
      // If the notification is for a normal user and admin made the donation
      if (related_user?.isAdmin) {
        return `Admin has made a donation of $${data?.amount || ''}${data?.event_type ? ` to ${data.event_type}` : ''}.`
      }
    }

    if (
      [
        'transaction_claim',
        'claim',
        'donation_claim',
        'admin_request'
      ].includes(type.name)
    ) {
      // If the notification is for the current user (self), show confirmation
      if (notifUser?.id === user?.id) {
        if (user?.isAdmin) {
          return `You (Admin) have submitted a request for ${data?.event_type || 'a donation'}.`
        }
        return `You have submitted a request for ${data?.event_type || 'a donation'}.`
      }
      // If the notification is for admin (and not self), show admin message
      if (user?.isAdmin) {
        return `New request submitted by ${related_user?.first_name || 'a user'}.`
      }
      // If the notification is for a normal user and admin made the request
      if (related_user?.isAdmin) {
        return `Admin submitted a request for ${data?.event_type || 'a donation'}.`
      }
    }

    // Other notification types
    switch (type.name) {
      case 'admin_action':
      case 'admin_approved':
        return `Admin approved your ${data?.event_type || 'request'}${data?.amount ? ` ($${data.amount})` : ''}`
      case 'admin_rejected':
        return `Admin rejected your ${data?.event_type || 'request'}${data?.amount ? ` ($${data.amount})` : ''}`
      case 'new_comment':
        return `${related_user?.first_name || 'Someone'} commented on your post`
      case 'post_upvoted':
        return `${related_user?.first_name || 'Someone'} upvoted your post`
      case 'post_downvoted':
        return `${related_user?.first_name || 'Someone'} downvoted your post`
      case 'verification_approved':
        return 'Your account verification has been approved'
      case 'verification_rejected':
        return 'Your account verification was rejected'
      case 'new_announcement':
        return message || 'A new announcement has been posted'
      default:
        if (message) return message
        return type.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }
  }

  return (
    <section className="bg-background min-h-screen">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full lg:w-64 shrink-0 md:fixed md:left-0 md:top-0 md:bottom-0 md:pt-16 md:z-10">
          <div className="hidden md:block">
            <ProfileSidebar
              activeItem="notifications"
              fullName={`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || "Guest"}
              profileImage={user?.avatar_url || user?.avatar_url_full || undefined}
              onViewChange={onViewChange}
            />
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-8 lg:overflow-y-auto md:ml-64">
          <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
                Notifications {unreadCount > 0 && `(${unreadCount})`}
                {user?.isAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Admin</span>
                )}
              </h1>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Mark all as read
                </Button>
              )}
            </div>

            {loading && notifications.length === 0 ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 bg-card border border-border rounded-lg hover:shadow-sm transition-shadow ${
                      !notification.is_read ? 'border-l-4 border-l-primary' : ''
                    }`}
                    onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0">
                      <Avatar className="h-10 w-10 lg:h-12 lg:w-12">
                        <AvatarImage
                          src={notification.related_user?.avatar || '/default-avatar.png'}
                          alt="Notification avatar"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        <AvatarFallback className="bg-muted">
                          {getNotificationIcon(notification.type.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="space-y-1">
                        <p
                          className={`text-sm lg:text-base leading-relaxed ${
                            !notification.is_read
                              ? "text-primary font-medium"
                              : "text-foreground"
                          }`}
                        >
                          {formatNotificationMessage(notification)}
                        </p>
                        {user?.isAdmin && notification.type.name === 'new_announcement' && (
                          <span className="text-xs text-yellow-700 font-semibold">System Announcement</span>
                        )}
                      </div>
                      <p className="text-xs lg:text-sm text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {hasMore && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchNotifications()}
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load more notifications'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}