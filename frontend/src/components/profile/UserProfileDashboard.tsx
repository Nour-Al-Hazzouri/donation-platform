"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useModal } from "@/lib/contexts/ModalContext"
import ProfileSidebar from "./Sidebar"

interface UserProfileDashboardProps {
  onViewChange?: (view: 'profile' | 'notifications') => void
}

export default function UserProfileDashboard({ onViewChange }: UserProfileDashboardProps) {
  const { user } = useAuthStore()
  const { openModal } = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    gender: user?.gender || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    governorate: user?.governorate || "",
    district: user?.district || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      console.log("Saving profile data:", profileData)
    }
  }

  const handleVerify = () => {
    openModal('verificationCode')
  }

  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <ProfileSidebar 
          activeItem="profile" 
          fullName={profileData.fullName} 
          profileImage={user?.profileImage}
          onViewChange={onViewChange}
        />

        <div className="flex-1 p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#5a5a5a] mb-4 sm:mb-0">
              Welcome, {profileData.fullName.split(' ')[0]}
            </h1>
            <Button
              onClick={handleEdit}
              className="bg-[#f90404] hover:bg-[#d90404] text-white px-6 py-2 rounded-lg text-sm lg:text-base w-fit"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-6">
              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">{profileData.fullName}</p>
                )}
              </div>

              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Gender</Label>
                {isEditing ? (
                  <div className="h-10 lg:h-12">
                    <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="w-full h-full px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">
                    {profileData.gender || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">
                    {profileData.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">{profileData.email}</p>
                )}
              </div>

              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Governorate</Label>
                {isEditing ? (
                  <Input
                    value={profileData.governorate}
                    onChange={(e) => handleInputChange("governorate", e.target.value)}
                    placeholder="Enter governorate"
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">
                    {profileData.governorate || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2 h-[82px]">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">District</Label>
                {isEditing ? (
                  <Input
                    value={profileData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="Enter district"
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-3">
                    {profileData.district || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[#5a5a5a] font-medium text-sm lg:text-base">Account Verification</h3>
                {user?.verified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-600 text-sm">Verified</span>
                    {user.verifiedAt && (
                      <span className="text-xs text-gray-500 ml-2">
                        Verified on {new Date(user.verifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#f90404]" />
                    <span className="text-[#5a5a5a] text-sm">Not Verified</span>
                  </div>
                )}
              </div>
              {user?.verified ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-600 text-sm">Verification Complete</span>
                </div>
              ) : (
                <Button
                  onClick={handleVerify}
                  className="bg-[#f90404] hover:bg-[#d90404] text-white px-6 py-2 rounded-lg text-sm lg:text-base w-fit"
                >
                  Verify Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}