"use client"

import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EditUserProfile from "@/components/admin/users/EditUserProfile"
import { useUsersContext, UsersProvider } from "@/components/admin/dashboard/ManageUsers"

// Wrapper component that provides the context
export default function AddUserPage() {
  return (
    <AdminLayout>
      <UsersProvider>
        <AddUserContent />
      </UsersProvider>
    </AdminLayout>
  )
}

// Child component that uses the context
function AddUserContent() {
  const router = useRouter()
  const { addUser } = useUsersContext()
  
  const handleBack = () => {
    router.push('/admin/users')
  }

  const handleSave = (userData: any) => {
    // Add the new user to the context
    addUser(userData)
    console.log('User added successfully:', userData)
    
    // Navigate back to users list
    router.push('/admin/users')
  }

  const handleCancel = () => {
    router.push('/admin/users')
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
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
  )
}