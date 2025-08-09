"use client"

import { useParams } from "next/navigation"
import { UserProfileDetails } from "@/components/admin/dashboard/UserProfileDetails"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UsersProvider } from "@/components/admin/dashboard/ManageUsers"

// Create a wrapper component that uses the context
function UserProfileWrapper({ userId }: { userId: string }) {
  const { users } = useUsersContext();
  
  // Find the user in the context
  const user = users.find(user => user.id === userId);
  
  // If user not found, return a default user
  if (!user) {
    return (
      <UserProfileDetails 
        userId={userId} 
        userData={{
          id: userId,
          personalDetails: {
            name: `User ${userId}`,
            gender: "unknown",
            phoneNumber: "N/A",
            email: `user${userId}@example.com`,
            address: {
              district: "Unknown",
              governorate: "Unknown",
            },
            profileImage: "/placeholder.svg?height=300&width=300&text=Profile",
          },
          createdAt: "2024-01-01",
          status: "unknown",
        }} 
      />
    );
  }
  
  // Convert the user from the list format to the detailed format
  const userData = {
    id: user.id,
    personalDetails: {
      name: user.name,
      gender: "male", // Default to male since we don't have this in the list
      phoneNumber: user.phone,
      email: user.email,
      address: {
        district: "Unknown", // We don't have this in the list
        governorate: "Unknown", // We don't have this in the list
      },
      profileImage: user.avatar || "/placeholder.svg?height=300&width=300&text=Profile",
    },
    createdAt: new Date().toISOString().split('T')[0], // Default to today
    status: "active",
  };
  
  return <UserProfileDetails userId={userId} userData={userData} />;
}

// Import useUsersContext
import { useUsersContext } from "@/components/admin/dashboard/ManageUsers"

// Main page component
export default function UserManagePage() {
  const params = useParams<{ id: string }>()
  const userId = params.id

  return (
    <AdminLayout>
      <UsersProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full overflow-x-hidden">
            {/* Desktop sidebar - only visible on md screens and up */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <DashboardSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1 w-full min-w-0 flex flex-col">
              <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
                <UserProfileWrapper userId={userId} />
              </SidebarInset>
            </div>
          </div>
        </SidebarProvider>
      </UsersProvider>
    </AdminLayout>
  )
}