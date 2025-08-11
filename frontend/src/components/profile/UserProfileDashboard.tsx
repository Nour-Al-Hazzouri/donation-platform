"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertTriangle } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useModal } from "@/contexts/ModalContext"
import ProfileSidebar from "./Sidebar"
import AccVerification from "./AccVerification"

interface UserProfileDashboardProps {
  onViewChange?: (view: 'profile' | 'notifications') => void
}

const locations = [
  { governorate: 'Beirut', district: 'Achrafieh' },
  { governorate: 'Beirut', district: 'Hamra' },
  { governorate: 'Beirut', district: 'Verdun' },
  { governorate: 'Mount Lebanon', district: 'Jounieh' },
  { governorate: 'Mount Lebanon', district: 'Baabda' },
  { governorate: 'Mount Lebanon', district: 'Metn' },
  { governorate: 'North', district: 'Tripoli' },
  { governorate: 'North', district: 'Koura' },
  { governorate: 'North', district: 'Zgharta' },
  { governorate: 'South', district: 'Sidon' },
  { governorate: 'South', district: 'Tyre' },
  { governorate: 'South', district: 'Nabatieh' },
  { governorate: 'Bekaa', district: 'Zahle' },
  { governorate: 'Bekaa', district: 'Baalbek' },
  { governorate: 'Bekaa', district: 'Rachaya' },
  { governorate: 'Nabatieh', district: 'Bint Jbeil' },
  { governorate: 'Nabatieh', district: 'Marjeyoun' },
  { governorate: 'Akkar', district: 'Halba' },
  { governorate: 'Baalbek-Hermel', district: 'Hermel' },
]

const governorates = [...new Set(locations.map(loc => loc.governorate))]

export default function UserProfileDashboard({ onViewChange }: UserProfileDashboardProps) {
  const { user } = useAuthStore()
  const { openModal, modalType } = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: user?.name || "",
    gender: user?.gender || "",
    phoneNumber: user?.phoneNumber || "",
    email: user?.email || "",
    governorate: user?.governorate || "",
    district: user?.district || "",
  })

  const getDistricts = () => {
    if (!profileData.governorate) return []
    return locations
      .filter(loc => loc.governorate === profileData.governorate)
      .map(loc => loc.district)
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => {
      if (field === 'governorate') {
        return {
          ...prev,
          governorate: value,
          district: ''
        }
      }
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleEdit = () => {
    setIsEditing(!isEditing)
    if (isEditing) {
      console.log("Saving profile data:", profileData)
    }
  }

  const handleVerify = () => {
    openModal('documentVerification')
  }

  return (
    <section className="bg-background min-h-screen w-full">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full lg:w-64 shrink-0 md:fixed md:left-0 md:top-0 md:bottom-0 md:pt-16 md:z-10">
          <div className="hidden md:block">
            <ProfileSidebar 
              activeItem="profile" 
              fullName={profileData.fullName} 
              profileImage={user?.profileImage}
              onViewChange={onViewChange}
            />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5 max-w-full overflow-x-hidden md:ml-64">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
              Welcome, {profileData.fullName.split(' ')[0]}
            </h1>
            <Button
              onClick={handleEdit}
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
            >
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 w-full">
            <div className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">{profileData.fullName}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Gender</Label>
                {isEditing ? (
                  <div className="h-10 sm:h-12 w-full">
                    <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger className="w-full h-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 min-w-[200px]">
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
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.gender || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">{profileData.email}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Governorate</Label>
                {isEditing ? (
                  <div className="h-10 sm:h-12 w-full">
                    <Select 
                      value={profileData.governorate} 
                      onValueChange={(value) => handleInputChange("governorate", value)}
                    >
                      <SelectTrigger className="w-full h-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Select governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov} value={gov}>
                            {gov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.governorate || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">District</Label>
                {isEditing ? (
                  <div className="h-10 sm:h-12 w-full">
                    <Select 
                      value={profileData.district} 
                      onValueChange={(value) => handleInputChange("district", value)}
                      disabled={!profileData.governorate}
                    >
                      <SelectTrigger className="w-full h-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder={profileData.governorate ? "Select district" : "First select governorate"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts().map((dist) => (
                          <SelectItem key={dist} value={dist}>
                            {dist}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.district || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h3 className="text-muted-foreground font-medium text-sm sm:text-base">Account Verification</h3>
                {user?.verified ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" />
                    <span className="text-primary text-sm">Verified</span>
                    {user.verifiedAt && (
                      <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                        Verified on {new Date(user.verifiedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    <span className="text-muted-foreground text-sm">Not Verified</span>
                  </div>
                )}
              </div>
              {user?.verified ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  <span className="text-primary text-sm">Verification Complete</span>
                </div>
              ) : (
                <Button
                  onClick={handleVerify}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  Verify Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalType === 'documentVerification' && <AccVerification />}
    </section>
  )
}