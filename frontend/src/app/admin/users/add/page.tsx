"use client"

import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EditUserProfile from "@/components/admin/users/EditUserProfile"

export default function AddUserPage() {
  const router = useRouter()
  
  const handleBack = () => {
    router.push('/admin/users')
  }

  const handleSave = (userData: any) => {
    // In a real application, you would make an API call to create the user
    console.log('Creating user:', userData)
    
    // Navigate back to users list
    router.push('/admin/users')
  }

  const handleCancel = () => {
    router.push('/admin/users')
  }

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar - only visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-0 flex-1 flex flex-col">
              <EditUserProfile 
                mode="add"
                onBack={handleBack}
                onSave={handleSave}
                onCancel={handleCancel}
              />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}