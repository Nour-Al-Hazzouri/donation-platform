"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Bell, LogOut, CheckCircle, AlertTriangle } from "lucide-react"
import { useModal } from "@/lib/contexts/ModalContext"
import { useAuthStore } from "@/lib/store/authStore"

export default function UserProfileDashboard() {
  const [isEditing, setIsEditing] = useState(false)
  const { openModal } = useModal()
  const { user } = useAuthStore()
  const [profileData, setProfileData] = useState({
    fullName: "Steve Rogers",
    gender: "Male",
    phoneNumber: "71414141",
    email: "steve@gmail.com",
    governorate: "governorate",
    district: "District",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
  }

  const handleVerify = () => {
    // Open verification code modal
    openModal('verificationCode')
  }

  const menuItems = [
    { icon: User, label: "Profile", active: true },
    { icon: Bell, label: "Notifications", active: false },
    { icon: LogOut, label: "Log out", active: false },
  ]

  return (
    <section className="bg-white min-h-screen">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className="w-full lg:w-80 bg-white border-r border-gray-200 p-4 lg:p-6">
          {/* Profile Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 lg:w-24 lg:h-24 bg-black rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle size={16} className="text-white" />
              </div>
            </div>
            <h2 className="text-lg lg:text-xl font-semibold text-[#000000]">{profileData.fullName}</h2>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-1">
            <h3 className="text-[#f90404] font-medium text-sm lg:text-base mb-4">Explore panel</h3>
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  item.active ? "bg-[#f90404] text-white" : "text-[#000000] hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center ${
                    item.active ? "bg-white bg-opacity-20" : "bg-[#f90404]"
                  }`}
                >
                  <item.icon size={14} className={item.active ? "text-white" : "text-white"} />
                </div>
                <span className="text-sm lg:text-base">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#5a5a5a] mb-4 sm:mb-0">Welcome, Steve</h1>
            <Button
              onClick={handleEdit}
              className="bg-[#f90404] hover:bg-[#d90404] text-white px-6 py-2 rounded-lg text-sm lg:text-base w-fit"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-2">{profileData.fullName}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Gender</Label>
                {isEditing ? (
                  <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full h-10 lg:h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-2">{profileData.gender}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-2">{profileData.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <p className="text-[#5a5a5a] text-sm lg:text-base py-2">{profileData.email}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Governorate */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">Governorate</Label>
                {isEditing ? (
                  <Input
                    value={profileData.governorate}
                    onChange={(e) => handleInputChange("governorate", e.target.value)}
                    placeholder="ex: Beirut"
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <div>
                    <p className="text-[#5a5a5a] text-sm lg:text-base py-1">{profileData.governorate}</p>
                    <p className="text-[#9ca3af] text-xs lg:text-sm">ex: Beirut</p>
                  </div>
                )}
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label className="text-[#5a5a5a] text-sm lg:text-base">District</Label>
                {isEditing ? (
                  <Input
                    value={profileData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    placeholder="ex: Hamra St."
                    className="w-full h-10 lg:h-12 px-3 lg:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#f90404] focus:border-[#f90404]"
                  />
                ) : (
                  <div>
                    <p className="text-[#5a5a5a] text-sm lg:text-base py-1">{profileData.district}</p>
                    <p className="text-[#9ca3af] text-xs lg:text-sm">ex: Hamra St.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gray-50 rounded-lg p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-[#5a5a5a] font-medium text-sm lg:text-base">Account Verification</h3>
                {user?.verified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-green-600 text-xs lg:text-sm">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-[#f90404]" />
                    <span className="text-[#5a5a5a] text-xs lg:text-sm">Not Verified</span>
                  </div>
                )}
              </div>
              {!user?.verified && (
                <Button
                  onClick={handleVerify}
                  className="bg-[#f90404] hover:bg-[#d90404] text-white px-6 py-2 rounded-lg text-sm lg:text-base w-fit"
                >
                  Verify
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
