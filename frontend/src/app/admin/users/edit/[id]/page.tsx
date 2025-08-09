"use client"

import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import EditUserProfile from "@/components/admin/users/EditUserProfile"

// Mock data constant for user profiles - matches the IDs and data from ManageUsers component
const MOCK_USER_DATA = {
  "1": {
    id: "1",
    personalDetails: {
      name: "Tomiwa Oyeledu Dolapo",
      gender: "male",
      phoneNumber: "+2349034526771",
      email: "tomiwaledu@me.com",
      address: {
        district: "Hamra",
        governorate: "Beirut",
      },
      profileImage: null,
    },
  },
  "2": {
    id: "2",
    personalDetails: {
      name: "Bessie Cooper",
      gender: "female",
      phoneNumber: "(505) 555-0125",
      email: "michael.mitc@me.com",
      address: {
        district: "Achrafieh",
        governorate: "Beirut",
      },
      profileImage: null,
    },
  },
  "3": {
    id: "3",
    personalDetails: {
      name: "Albert Flores",
      gender: "male",
      phoneNumber: "(808) 555-0111",
      email: "alma.lawson@we.com",
      address: {
        district: "Tripoli",
        governorate: "North",
      },
      profileImage: null,
    },
  },
  "4": {
    id: "4",
    personalDetails: {
      name: "Brooklyn Simmons",
      gender: "female",
      phoneNumber: "(480) 555-0103",
      email: "debbie.baker@you.com",
      address: {
        district: "Sidon",
        governorate: "South",
      },
      profileImage: null,
    },
  },
  "5": {
    id: "5",
    personalDetails: {
      name: "Devon Lane",
      gender: "male",
      phoneNumber: "(217) 555-0113",
      email: "felicia.reid@us.com",
      address: {
        district: "Zahle",
        governorate: "Bekaa",
      },
      profileImage: null,
    },
  },
  "6": {
    id: "6",
    personalDetails: {
      name: "Jerome Bell",
      gender: "male",
      phoneNumber: "(629) 555-0129",
      email: "sara.cruz@them.com",
      address: {
        district: "Nabatieh",
        governorate: "Nabatieh",
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