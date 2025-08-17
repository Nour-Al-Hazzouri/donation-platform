"use client"

import { useParams } from "next/navigation"
import { UserProfileDetails } from "@/components/admin/dashboard/UserProfileDetails"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useUsersContext } from "@/components/admin/dashboard/ManageUsers"

// Create a wrapper component that uses the context
function UserProfileWrapper({ userId }: { userId: string }) {
  const { users } = useUsersContext();
  
  // Find the user in the context
  const user = users.find(user => user.id === userId);
  
  // Retrieve saved address data from localStorage if available
  let savedAddress = { district: "", governorate: "" };
  if (typeof window !== 'undefined') {
    const addressKey = `user_${userId}_address`;
    const savedAddressData = localStorage.getItem(addressKey);
    if (savedAddressData) {
      try {
        savedAddress = JSON.parse(savedAddressData);
        console.log('Retrieved saved address data:', savedAddress);
      } catch (error) {
        console.error('Error parsing saved address data:', error);
      }
    }
  }

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
              district: savedAddress.district || "",
              governorate: savedAddress.governorate || "",
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
      gender: "male", // Default since list data lacks gender
      phoneNumber: user.phone,
      email: user.email,
      address: {
        district: savedAddress.district || "", // Use saved data or empty string
        governorate: savedAddress.governorate || "",
      },
      profileImage: user.avatar || "/placeholder.svg?height=300&width=300&text=Profile",
    },
    createdAt: new Date().toISOString().split('T')[0], // Default to today
    status: "active",
  };
  
  return <UserProfileDetails userId={userId} userData={userData} />;
}

// Main client component
export default function ManageUserPageClient() {
  const params = useParams<{ id: string }>()
  const userId = params.id

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-background">
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
  )
}