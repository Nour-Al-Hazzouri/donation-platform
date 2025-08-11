"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUsersContext } from "./ManageUsers"

// Mock data constants
const USER_PROFILE_DATA = {
  id: "user-1",
  personalDetails: {
    name: "moe",
    gender: "male",
    phoneNumber: "09034867656",
    email: "moe@me.com",
    address: {
      district: "",
      governorate: "",
    },
    profileImage: "/placeholder.svg?height=300&width=300&text=Profile",
  },
  createdAt: "2024-01-15",
  status: "active",
}

interface UserProfileData {
  id: string
  personalDetails: {
    name: string
    gender: string
    phoneNumber: string
    email: string
    address: {
      district: string
      governorate: string
    }
    profileImage: string
  }
  createdAt: string
  status: string
}

interface UserProfileDetailsProps {
  userId?: string
  userData?: UserProfileData
  onBack?: () => void
  onEdit?: (userId: string) => void
  onDelete?: (userId: string) => void
}

export function UserProfileDetails({
  userId,
  userData = USER_PROFILE_DATA,
  onBack,
  onEdit,
  onDelete,
}: UserProfileDetailsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { deleteUser } = useUsersContext()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.push("/admin/users")
    }
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(userData.id)
    } else {
      // Navigate to edit page
      router.push(`/admin/users/edit/${userData.id}`)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${userData.personalDetails.name}'s profile?`)) {
      setIsDeleting(true)
      try {
        if (onDelete) {
          await onDelete(userData.id)
        } else {
          // Delete user using the context function
          deleteUser(userData.id)
          router.push("/admin/users")
        }
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Personal Details Section */}
        <div className="bg-background rounded-lg shadow-sm border border-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Personal Details</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Profile Image and Basic Info */}
            <div className="space-y-8">
              {/* Profile Image */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-64 h-64 rounded-2xl overflow-hidden bg-muted">
                  <Image
                    src={userData.personalDetails.profileImage || "/placeholder.svg"}
                    alt={`${userData.personalDetails.name}'s profile`}
                    width={256}
                    height={256}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <p className="text-lg text-foreground font-medium">{userData.personalDetails.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
                  <p className="text-lg text-foreground">{userData.personalDetails.gender}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                  <p className="text-lg text-foreground">{userData.personalDetails.phoneNumber}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <p className="text-lg text-foreground">{userData.personalDetails.email}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Address */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-red-500 mb-6">Address</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">district</label>
                    <p className="text-lg text-foreground">{userData.personalDetails.address.district}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">governorate</label>
                    <p className="text-lg text-foreground">{userData.personalDetails.address.governorate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-border">
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="ghost"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button onClick={handleEdit} className="bg-red-500 hover:bg-red-600 text-white px-8">
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}