'use client'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import ProfileSidebar from './Sidebar'
import NotificationsDashboard from './NotificationsDashboard'
import { MainLayout } from '@/components/layouts/MainLayout'

export default function ProfileClient() {
  const [activeView, setActiveView] = useState<'profile' | 'notifications'>('profile')
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuthStore()
  
  useEffect(() => {
    const view = searchParams?.get('view')
    if (view === 'notifications') {
      setActiveView('notifications')
    } else {
      setActiveView('profile')
    }
  }, [searchParams])

  if (!isAuthenticated || !user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-[50vh]">
          <p className="text-lg">Please sign in to view your profile</p>
        </div>
      </MainLayout>
    )
  }

  const handleViewChange = (view: 'profile' | 'notifications') => {
    setActiveView(view)
  }

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-72 flex-shrink-0">
          <ProfileSidebar 
            activeItem={activeView} 
            fullName={`${user.first_name || ''} ${user.last_name || ''}`}
            profileImage={user.avatar_url || undefined}
            onViewChange={handleViewChange}
          />
        </div>
        
        <div className="flex-grow">
          {activeView === 'profile' ? (
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow dark:shadow-gray-800 p-6 border dark:border-gray-800">
              <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h1>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">First Name</p>
                      <p className="text-gray-900 dark:text-white">{user.first_name || 'Not provided'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Name</p>
                      <p className="text-gray-900 dark:text-white">{user.last_name || 'Not provided'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Username</p>
                      <p className="text-gray-900 dark:text-white">{user.username || 'Not provided'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Verification Status</p>
                      <p className="text-gray-900 dark:text-white">{user.verified ? 'Verified' : 'Not verified'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Add more sections as needed */}
              </div>
            </div>
          ) : (
            <NotificationsDashboard />
          )}
        </div>
      </div>
    </MainLayout>
  )
}