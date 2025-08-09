"use client"

import { useState } from "react"
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

export default function VerificationRequestDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [notes, setNotes] = useState(VERIFICATION_REQUEST.notes)

  // In a real app, you would fetch the verification request data based on the ID
  // const { id } = params;
  // useEffect(() => { fetch data based on id }, [id]);

  const handleApprove = async () => {
    // In a real app, you would call an API to approve the verification request
    console.log(`Approving verification request ${params.id} with notes: ${notes}`)
    // await approveVerificationRequest(params.id, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleDecline = async () => {
    // In a real app, you would call an API to decline the verification request
    console.log(`Declining verification request ${params.id} with notes: ${notes}`)
    // await declineVerificationRequest(params.id, notes);
    router.push('/admin/users?tab=verification')
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full">
        <div className="w-full max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-4 sm:mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 w-full">
            {/* Personal Details Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 h-full">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Personal Details</h2>
              
              <div className="space-y-4 sm:space-y-6 h-full">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.gender}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.phoneNumber}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{VERIFICATION_REQUEST.personalDetails.email}</p>
                  </div>
                </div>

                {/* Address Information */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.district}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Street</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.street}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Governorate</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.governorate}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.city}</p>
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
                      src={VERIFICATION_REQUEST.submittedDocuments.idCard.image}
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
                    <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.type}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Additional Info</p>
                    <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.additionalInfo}</p>
                  </div>
                </div>

                {/* ID Card Fields */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">ID Card Fields</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Name on ID</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">ID Number</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.idNumber}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.dateOfBirth}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">Expiration Date</p>
                      <p className="font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.expirationDate}</p>
                    </div>
                  </div>
                </div>

                {/* Barcode */}
                <div className="pt-2 sm:pt-4">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Barcode</h3>
                  <div className="bg-gray-100 p-3 sm:p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <p>{VERIFICATION_REQUEST.submittedDocuments.idCard.barcode}</p>
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
        </div>
      </div>
    </AdminLayout>
  )
}