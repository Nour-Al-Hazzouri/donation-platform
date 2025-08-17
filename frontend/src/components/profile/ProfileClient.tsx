'use client'

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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Profile</h1>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                      <p>{user.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                      <p>{user.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Username</p>
                      <p>{user.username || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p>{user.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Verification Status</p>
                      <p>{user.verified ? 'Verified' : 'Not verified'}</p>
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