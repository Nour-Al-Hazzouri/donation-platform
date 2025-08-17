"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"

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

interface VerificationRequestDetailsClientProps {
  id: string
}

export default function VerificationRequestDetailsClient({ id }: VerificationRequestDetailsClientProps) {
  const router = useRouter()
  const [notes, setNotes] = useState(VERIFICATION_REQUEST.notes)

  // In a real app, you would fetch the verification request data based on the ID
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="text-base font-medium text-gray-900 capitalize">{VERIFICATION_REQUEST.personalDetails.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.email}</p>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Governorate</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.governorate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">City</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">District</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.district}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Street</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.personalDetails.address.street}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ID Card Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-full">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">ID Card</h2>
            
            <div className="space-y-6">
              {/* ID Card Image */}
              <div className="flex justify-center">
                <div className="w-full max-w-md h-64 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                  <Image
                    src={VERIFICATION_REQUEST.submittedDocuments.idCard.image || "/placeholder.svg"}
                    alt="ID Card"
                    width={400}
                    height={250}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
              </div>

              {/* ID Card Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">ID Card Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Additional Info</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.additionalInfo}</p>
                  </div>
                </div>
              </div>

              {/* ID Card Fields */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">ID Card Fields</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID Number</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Expiration Date</p>
                    <p className="text-base font-medium text-gray-900">{VERIFICATION_REQUEST.submittedDocuments.idCard.fields.expirationDate}</p>
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
  )
}