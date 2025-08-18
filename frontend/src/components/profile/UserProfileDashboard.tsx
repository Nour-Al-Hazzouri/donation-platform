"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertTriangle, Edit, Save } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useModal } from "@/contexts/ModalContext"
import { useSidebar } from "@/components/ui/sidebar"
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
    fullName: user ? `${user.first_name} ${user.last_name}` : "",
    phoneNumber: user?.phone || "",
    email: user?.email || "",
    governorate: user?.location?.governorate || "",
    district: user?.location?.district || "",
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

  const [showVerification, setShowVerification] = useState(false)

  const handleVerify = () => {
    setShowVerification(true)
  }

  return (
    <section className="bg-background min-h-screen w-full">
      <div className="flex flex-col w-full h-full">
        <div className="flex-1 p-4 sm:p-5 max-w-full overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
              Welcome, {profileData.fullName.split(' ')[0]}
            </h1>
            <Button
              onClick={handleEdit}
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4" />
                  Edit
                </>
              )}
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

          <div className="bg-secondary/50 rounded-lg p-4 sm:p-6 w-full mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h3 className="text-muted-foreground font-medium text-sm sm:text-base">Account Verification</h3>
                {user?.email_verified_at ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" />
                    <span className="text-primary text-sm">Verified</span>
                    {user.email_verified_at && (
                      <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                        Verified on {new Date(user.email_verified_at).toLocaleDateString()}
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
              {user?.email_verified_at ? (
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
          
          {/* Verification Form Section */}
          {showVerification && !user?.email_verified_at && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Identity Verification</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowVerification(false)}
                  className="text-gray-500"
                >
                  Cancel
                </Button>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <AccVerification />
              </div>
            </div>
          )
      }</div>
      </div>

      {modalType === 'documentVerification' && <AccVerification />}
    </section>
  )
}