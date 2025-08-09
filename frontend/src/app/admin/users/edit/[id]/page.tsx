"use client"

import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EditUserProfile from "@/components/admin/users/EditUserProfile"

// Mock data constant for user profiles
const MOCK_USER_DATA = {
  "user-1": {
    id: "user-1",
    personalDetails: {
      name: "John Doe",
      gender: "male",
      phoneNumber: "09034867656",
      email: "john.doe@example.com",
      address: {
        district: "Hamra",
        governorate: "Beirut",
      },
      profileImage: null,
    },
  },
  "user-2": {
    id: "user-2",
    personalDetails: {
      name: "Jane Smith",
      gender: "female",
      phoneNumber: "09045678912",
      email: "jane.smith@example.com",
      address: {
        district: "Achrafieh",
        governorate: "Beirut",
      },
      profileImage: null,
    },
  },
  "user-3": {
    id: "user-3",
    personalDetails: {
      name: "Ahmad Hassan",
      gender: "male",
      phoneNumber: "09076543210",
      email: "ahmad.hassan@example.com",
      address: {
        district: "Tripoli",
        governorate: "North",
      },
      profileImage: null,
    },
  },
}

// Function to fetch user by ID using mock data
const fetchUserById = (id: string) => {
  // This would be replaced with an actual API call
  return MOCK_USER_DATA[id as keyof typeof MOCK_USER_DATA] || {
    id,
    personalDetails: {
      name: `User ${id}`,
      gender: "unknown",
      phoneNumber: "N/A",
      email: `user${id}@example.com`,
      address: {
        district: "Unknown",
        governorate: "Unknown",
      },
      profileImage: null,
    },
  }
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  // In a real application, you would fetch the user data from an API
  const userData = fetchUserById(userId)
  
  const handleBack = () => {
    router.push(`/admin/users/manage/${userId}`)
  }

  const handleSave = (userData: any) => {
    // In a real application, you would make an API call to update the user
    console.log('Updating user:', userData)
    
    // Navigate back to user profile
    router.push(`/admin/users/manage/${userId}`)
  }

  const handleCancel = () => {
    router.push(`/admin/users/manage/${userId}`)
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
                initialData={userData}
                mode="edit"
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