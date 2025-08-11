"use client"

import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EditUserProfile from "@/components/admin/users/EditUserProfile"
import { UsersProvider, useUsersContext } from "@/components/admin/dashboard/ManageUsers"

// Create a wrapper component that uses the context
function EditUserWrapper({ userId }: { userId: string }) {
  const router = useRouter()
  const { users, updateUser } = useUsersContext()
  
  // Try to find the user in the context first
  let user = users.find(u => u.id === userId)

  // Fallback: read from localStorage to avoid initial empty context on first render
  if (!user && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('mockUsers')
      const parsed: any[] = stored ? JSON.parse(stored) : []
      user = parsed.find(u => u.id === userId)
    } catch {}
  }
  
  // Try to get saved address data from localStorage
  let savedAddress = { governorate: "", district: "" };
  if (typeof window !== 'undefined' && userId) {
    try {
      const addressKey = `user_${userId}_address`;
      const storedAddress = localStorage.getItem(addressKey);
      if (storedAddress) {
        savedAddress = JSON.parse(storedAddress);
        console.log('Retrieved saved address:', savedAddress);
      }
    } catch (error) {
      console.error('Error retrieving saved address:', error);
    }
  }

  // Build initial data for the edit form
  const userData = user ? {
    id: user.id,
    personalDetails: {
      name: user.name,
      gender: "male", // Default gender since list doesn't contain it
      phoneNumber: user.phone,
      email: user.email,
      address: {
        // Use saved address data if available, otherwise use empty string
        district: savedAddress.district || "",
        governorate: savedAddress.governorate || "",
      },
      profileImage: null,
    },
  } : {
    id: userId,
    personalDetails: {
      name: `User ${userId}`,
      gender: "male",
      phoneNumber: "N/A",
      email: `user${userId}@example.com`,
      address: {
        district: savedAddress.district || "",
        governorate: savedAddress.governorate || "",
      },
      profileImage: null,
    },
  }

  const handleBack = () => {
    router.push(`/admin/users/manage/${userId}`)
  }

  const handleSave = (updatedUserData: any) => {
    // Persist updates to the shared mock users store
    updateUser(updatedUserData)

    // Navigate back to user profile
    router.push(`/admin/users/manage/${userId}`)
  }

  const handleCancel = () => {
    router.push(`/admin/users/manage/${userId}`)
  }

  return (
    <EditUserProfile 
      initialData={userData}
      mode="edit"
      onBack={handleBack}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  )
}

export default function EditUserPage() {
  const params = useParams<{ id: string }>()
  const userId = params.id

  return (
    <AdminLayout>
      <UsersProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
            {/* Desktop sidebar - only visible on md screens and up */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 w-full min-w-0 flex flex-col">
              <SidebarInset className="p-0 flex-1 flex flex-col">
                <EditUserWrapper userId={userId} />
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </UsersProvider>
    </AdminLayout>
  )
}