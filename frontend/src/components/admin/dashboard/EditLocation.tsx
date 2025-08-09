"use client"

import { useState, useMemo, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COLORS } from "@/lib/constants"

// Mock data constants - same as manage locations
const LOCATIONS = [
  { governorate: "Beirut", district: "Achrafieh" },
  { governorate: "Beirut", district: "Hamra" },
  { governorate: "Beirut", district: "Verdun" },
  { governorate: "Mount Lebanon", district: "Jounieh" },
  { governorate: "Mount Lebanon", district: "Baabda" },
  { governorate: "Mount Lebanon", district: "Metn" },
  { governorate: "North", district: "Tripoli" },
  { governorate: "North", district: "Koura" },
  { governorate: "North", district: "Zgharta" },
  { governorate: "South", district: "Sidon" },
  { governorate: "South", district: "Tyre" },
  { governorate: "South", district: "Nabatieh" },
  { governorate: "Bekaa", district: "Zahle" },
  { governorate: "Bekaa", district: "Baalbek" },
  { governorate: "Bekaa", district: "Rachaya" },
  { governorate: "Nabatieh", district: "Bint Jbeil" },
  { governorate: "Nabatieh", district: "Marjeyoun" },
  { governorate: "Akkar", district: "Halba" },
  { governorate: "Baalbek-Hermel", district: "Hermel" },
]

export interface LocationData {
  id?: string
  governorate: string
  district: string
}

interface EditLocationProps {
  initialData?: LocationData
  onSave?: (locationData: LocationData) => void
  onCancel?: () => void
  onBack?: () => void
}

export default function EditLocation({
  initialData = { governorate: "Beirut", district: "Achrafieh" },
  onSave,
  onCancel,
  onBack,
}: EditLocationProps) {
  const [selectedGovernorate, setSelectedGovernorate] = useState(initialData.governorate)
  const [selectedDistrict, setSelectedDistrict] = useState(initialData.district)

  // Get unique governorates for dropdown
  const governorates = useMemo(() => {
    const unique = [...new Set(LOCATIONS.map((location) => location.governorate))]
    return unique.sort()
  }, [])

  // Get districts for selected governorate
  const availableDistricts = useMemo(() => {
    if (!selectedGovernorate) return []
    return LOCATIONS.filter((location) => location.governorate === selectedGovernorate)
      .map((location) => location.district)
      .sort()
  }, [selectedGovernorate])

  // Update district when governorate changes
  useEffect(() => {
    if (selectedGovernorate && availableDistricts.length > 0) {
      // If current district is not available in new governorate, select first available
      if (!availableDistricts.includes(selectedDistrict)) {
        setSelectedDistrict(availableDistricts[0])
      }
    }
  }, [selectedGovernorate, availableDistricts, selectedDistrict])

  const handleGovernorateChange = (value: string) => {
    setSelectedGovernorate(value)
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
  }

  const handleSave = () => {
    if (selectedGovernorate && selectedDistrict) {
      const locationData: LocationData = {
        id: initialData.id,
        governorate: selectedGovernorate,
        district: selectedDistrict,
      }
      onSave?.(locationData)
    }
  }

  const handleCancel = () => {
    // Reset to initial values
    setSelectedGovernorate(initialData.governorate)
    setSelectedDistrict(initialData.district)
    onCancel?.()
  }

  const handleBack = () => {
    onBack?.()
  }

  const isFormValid = selectedGovernorate && selectedDistrict
  const hasChanges = selectedGovernorate !== initialData.governorate || selectedDistrict !== initialData.district

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button - Updated to match carousel left indicator */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className={cn(
            "mb-6 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md z-10",
            "transition-all duration-200 hover:scale-105"
          )}
          aria-label="Go back"
          style={{ color: COLORS.primary }}
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Edit Location</h1>

        {/* Edit Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-6">
            {/* Governorate Field */}
            <div>
              <label htmlFor="governorate" className="block text-lg font-medium text-gray-900 mb-2">
                Governorate:
              </label>
              <Select value={selectedGovernorate} onValueChange={handleGovernorateChange}>
                <SelectTrigger className="w-full max-w-xs border-gray-300 focus:border-[#f90404] focus:ring-[#f90404]">
                  <SelectValue placeholder="Select Governorate" />
                </SelectTrigger>
                <SelectContent>
                  {governorates.map((governorate) => (
                    <SelectItem key={governorate} value={governorate}>
                      {governorate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District Field */}
            <div>
              <label htmlFor="district" className="block text-lg font-medium text-gray-900 mb-2">
                District
              </label>
              <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedGovernorate}>
                <SelectTrigger className="w-full max-w-xs border-gray-300 focus:border-[#f90404] focus:ring-[#f90404] disabled:opacity-50">
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {availableDistricts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-[#f90404] hover:text-[#d90404] hover:bg-[#d90404]/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isFormValid || !hasChanges}
              onClick={handleSave}
              className="bg-[#f90404] hover:bg-[#d90404] text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Edit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}