"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"

// Mock data constants - In a real app, this would come from an API call
const VERIFICATION_REQUEST = {
  id: "1",
  personalDetails: {
    name: "moe",
    gender: "male",
    phoneNumber: "09034867656",
    email: "moe@me.com",
    address: {
      district: "district",
      street: "Hamra St.",
      governorate: "governorate",
      city: "Beirut"
    },
    profileImage: "/placeholder.svg?height=300&width=300&text=Profile"
  },
  submittedDocuments: {
    idCard: {
      image: "/placeholder.svg?height=250&width=400&text=ID+Card",
      type: "YOUR BEECH CARD",
      additionalInfo: "CARE PADD",
      fields: {
        name: "NAME",
        idNumber: "ID NUMBER", 
        dateOfBirth: "DATE OF BIRTH",
        expirationDate: "EXPIRATION DATE"
      },
      barcode: "||||||||||||||||||||||||"
    }
  },
  notes: "",
  status: "pending"
}

export function VerificationRequestDetailsPageClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Unwrap params using React.use() to avoid the warning
  const { id } = use(params)
  const [notes, setNotes] = useState(VERIFICATION_REQUEST.notes)

  // In a real app, you would fetch the verification request data based on the ID
  // const { id } = params;
  // useEffect(() => { fetch data based on id }, [id]);

  const handleApprove = async () => {
    // In a real app, you would call an API to approve the verification request
    console.log(`Approving verification request ${id} with notes: ${notes}`)
    // await approveVerificationRequest(id, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleDecline = async () => {
    // In a real app, you would call an API to decline the verification request
    console.log(`Declining verification request ${id} with notes: ${notes}`)
    // await declineVerificationRequest(id, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full">
        <div className="w-full">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {/* Personal Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Details</h2>
              
              <div className="space-y-6 h-full">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="w-56 h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                    <Image
                      src={VERIFICATION_REQUEST.personalDetails.profileImage || "/placeholder.svg"}
                      alt="Profile"
                      width={224}
                      height={224}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-gray-900 font-medium">{VERIFICATION_REQUEST.personalDetails.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 capitalize">{VERIFICATION_REQUEST.personalDetails.gender}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                    <p className="text-gray-900">{VERIFICATION_REQUEST.personalDetails.phoneNumber}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900">{VERIFICATION_REQUEST.personalDetails.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <div className="text-gray-900 space-y-1">
                      <p>{VERIFICATION_REQUEST.personalDetails.address.street}</p>
                      <p>{VERIFICATION_REQUEST.personalDetails.address.city}, {VERIFICATION_REQUEST.personalDetails.address.district}</p>
                      <p>{VERIFICATION_REQUEST.personalDetails.address.governorate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 h-full">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Submitted Documents</h2>
              
              {/* ID Card Document */}
              <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50 h-full flex flex-col">
                <div className="bg-white rounded-lg p-4 shadow-sm flex-grow">
                  {/* Document Header */}
                  <div className="text-center mb-4">
                    <p className="text-sm font-medium text-gray-600">YOUR IMAGE</p>
                    <p className="text-xs text-gray-500">IMAGE IMAGE</p>
                  </div>

                  {/* Document Content */}
                  <div className="flex items-start gap-4">
                    {/* Avatar placeholder */}
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-gray-400 rounded-full"></div>
                    </div>

                    {/* Document Fields */}
                    <div className="flex-1 space-y-2">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500">NAME</p>
                          <div className="h-3 bg-gray-200 rounded mt-1"></div>
                        </div>
                        <div>
                          <p className="text-gray-500">ID NUMBER</p>
                          <div className="h-3 bg-gray-200 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-gray-500">DATE OF BIRTH</p>
                          <div className="h-3 bg-gray-200 rounded mt-1"></div>
                        </div>
                        <div>
                          <p className="text-gray-500">EXPIRATION DATE</p>
                          <div className="h-3 bg-gray-200 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="text-gray-500">SERIAL: <span className="text-gray-700">1120-00023</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Document Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center text-xs">
                      <p className="text-gray-600">YOUR BEECH CARD</p>
                      <p className="text-gray-600">CARE PADD</p>
                    </div>
                    <div className="mt-2 text-center">
                      <div className="font-mono text-xs tracking-wider">
                        ||||||||||||||||||||||||||||||||
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this verification request..."
              className="w-full h-40 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-6 w-full pb-8">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="px-10 py-3 border-red-500 text-red-500 hover:bg-red-50 text-base"
            >
              Decline
            </Button>
            <Button
              onClick={handleApprove}
              className="px-10 py-3 bg-green-500 hover:bg-green-600 text-white text-base"
            >
              Approve
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
