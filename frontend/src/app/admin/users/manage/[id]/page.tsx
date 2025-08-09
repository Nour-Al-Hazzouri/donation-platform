"use client"

import { useParams } from "next/navigation"
import { UserProfileDetails } from "@/components/admin/dashboard/UserProfileDetails"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// Mock data for fetching user by ID
const fetchUserById = (id: string) => {
  // This would be replaced with an actual API call
  return {
    id,
    personalDetails: {
      name: `User ${id}`,
      gender: "male",
      phoneNumber: "09034867656",
      email: `user${id}@example.com`,
      address: {
        district: "Hamra",
        governorate: "Beirut",
      },
      profileImage: "/placeholder.svg?height=300&width=300&text=Profile",
    },
    createdAt: "2024-01-15",
    status: "active",
  }
}

export default function UserManagePage() {
  const params = useParams()
  const userId = params.id as string
  
  // In a real application, you would fetch the user data from an API
  const userData = fetchUserById(userId)

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
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <UserProfileDetails userId={userId} userData={userData} />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}