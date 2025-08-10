"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// Mock data constants - In a real app, this would come from an API call
// Using the same user IDs as in ManageUsers component (users with IDs 2 and 5 have verification requests)
const MOCK_VERIFICATION_DATA = {
  "2": {
    id: "2",
    personalDetails: {
      name: "Bessie Cooper",
      gender: "female",
      phoneNumber: "(505) 555-0125",
      email: "michael.mitc@me.com",
      address: {
        district: "Achrafieh",
        street: "Main St.",
        governorate: "Beirut",
        city: "Beirut"
      },
      profileImage: "/placeholder.svg?height=300&width=300&text=Profile"
    },
    submittedDocuments: {
      idCard: {
        image: "/placeholder.svg?height=250&width=400&text=ID+Card",
        type: "NATIONAL ID CARD",
        additionalInfo: "VERIFIED",
        fields: {
          name: "Bessie Cooper",
          idNumber: "ID12345678", 
          dateOfBirth: "1985-06-15",
          expirationDate: "2030-06-15"
        },
        barcode: "||||||||||||||||||||||||"
      }
    },
    notes: "",
    status: "pending"
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
        street: "Cedar St.",
        governorate: "Bekaa",
        city: "Zahle"
      },
      profileImage: "/placeholder.svg?height=300&width=300&text=Profile"
    },
    submittedDocuments: {
      idCard: {
        image: "/placeholder.svg?height=250&width=400&text=ID+Card",
        type: "NATIONAL ID CARD",
        additionalInfo: "PENDING",
        fields: {
          name: "Devon Lane",
          idNumber: "ID87654321", 
          dateOfBirth: "1990-03-22",
          expirationDate: "2028-03-22"
        },
        barcode: "||||||||||||||||||||||||"
      }
    },
    notes: "",
    status: "pending"
  }
}

export default function VerificationRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Unwrap params using React.use() to avoid the warning
  const { id } = use(params)
  const userId = id
  
  // Get the verification data for this specific user ID
  const userData = MOCK_VERIFICATION_DATA[userId as keyof typeof MOCK_VERIFICATION_DATA] || {
    id: userId,
    personalDetails: {
      name: `User ${userId}`,
      gender: "unknown",
      phoneNumber: "N/A",
      email: `user${userId}@example.com`,
      address: {
        district: "Unknown",
        street: "Unknown",
        governorate: "Unknown",
        city: "Unknown"
      },
      profileImage: "/placeholder.svg?height=300&width=300&text=Profile"
    },
    submittedDocuments: {
      idCard: {
        image: "/placeholder.svg?height=250&width=400&text=ID+Card",
        type: "UNKNOWN",
        additionalInfo: "UNKNOWN",
        fields: {
          name: "UNKNOWN",
          idNumber: "UNKNOWN", 
          dateOfBirth: "UNKNOWN",
          expirationDate: "UNKNOWN"
        },
        barcode: "||||||||||||||||||||||||"
      }
    },
    notes: "",
    status: "pending"
  }
  
  const [notes, setNotes] = useState(userData.notes)

  // In a real app, you would fetch the verification request data based on the ID
  // useEffect(() => { fetch data based on id }, [id]);

  const handleApprove = async () => {
    // In a real app, you would call an API to approve the verification request
    console.log(`Approving verification request ${userId} with notes: ${notes}`)
    // await approveVerificationRequest(userId, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleDecline = async () => {
    // In a real app, you would call an API to decline the verification request
    console.log(`Declining verification request ${userId} with notes: ${notes}`)
    // await declineVerificationRequest(userId, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleBack = () => {
    router.back()
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
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="w-full max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="mb-4 sm:mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 w-full">
            {/* Personal Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Personal Details</h2>
              
              <div className="space-y-4 sm:space-y-6 h-full">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    <Image
                      src={userData.personalDetails.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{userData.personalDetails.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900">{userData.personalDetails.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{userData.personalDetails.phoneNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{userData.personalDetails.email}</p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium text-gray-900">{userData.personalDetails.address.district}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="font-medium text-gray-900">{userData.personalDetails.address.street}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Governorate</p>
                      <p className="font-medium text-gray-900">{userData.personalDetails.address.governorate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">{userData.personalDetails.address.city}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Card Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">ID Card</h2>
              
              <div className="space-y-4 sm:space-y-6">
                {/* ID Card Image */}
                <div className="flex justify-center">
                  <div className="w-full max-w-md rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    <Image
                      src={userData.submittedDocuments.idCard.image}
                      alt="ID Card"
                      width={400}
                      height={250}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>

                {/* ID Card Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">ID Type</p>
                    <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Additional Info</p>
                    <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.additionalInfo}</p>
                  </div>
                </div>

                {/* ID Card Fields */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">ID Card Fields</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name on ID</p>
                      <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.fields.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">ID Number</p>
                      <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.fields.idNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.fields.dateOfBirth}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="font-medium text-gray-900">{userData.submittedDocuments.idCard.fields.expirationDate}</p>
                    </div>
                  </div>
                </div>

                {/* Barcode */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Barcode</h3>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <p>{userData.submittedDocuments.idCard.barcode}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Actions */}
          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Review and Decision</h2>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Notes Textarea */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Notes</label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base"
                  placeholder="Add any notes about this verification request..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                <Button 
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto order-2 sm:order-1"
                  onClick={handleDecline}
                >
                  Decline Verification
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto order-1 sm:order-2"
                  onClick={handleApprove}
                >
                  Approve Verification
                </Button>
              </div>
            </div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}