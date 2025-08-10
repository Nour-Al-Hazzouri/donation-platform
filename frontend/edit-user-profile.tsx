"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data constants
const INITIAL_USER_DATA = {
  id: "",
  personalDetails: {
    name: "",
    gender: "male",
    phoneNumber: "",
    email: "",
    address: {
      district: "",
      governorate: "Beirut",
    },
    profileImage: null as File | null,
  },
}

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
]

const GOVERNORATE_OPTIONS = [
  "Beirut",
  "Mount Lebanon",
  "North",
  "South",
  "Bekaa",
  "Nabatieh",
  "Akkar",
  "Baalbek-Hermel",
]

interface UserFormData {
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
    profileImage: File | null
  }
}

interface EditUserProfileProps {
  initialData?: UserFormData
  mode?: "add" | "edit"
  onBack?: () => void
  onSave?: (userData: UserFormData) => void
  onCancel?: () => void
}

export default function EditUserProfile({
  initialData = INITIAL_USER_DATA,
  mode = "add",
  onBack,
  onSave,
  onCancel,
}: EditUserProfileProps) {
  const [formData, setFormData] = useState<UserFormData>(initialData)
  const [imageFileName, setImageFileName] = useState<string>("")

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child, subChild] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: subChild
            ? {
                ...(prev[parent as keyof typeof prev] as any)[child],
                [subChild]: value,
              }
            : value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          [field]: value,
        },
      }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          profileImage: file,
        },
      }))
      setImageFileName(file.name)
    }
  }

  const handleBack = () => {
    onBack?.()
  }

  const handleSave = () => {
    onSave?.(formData)
  }

  const handleCancel = () => {
    onCancel?.()
  }

  const isFormValid =
    formData.personalDetails.name.trim() &&
    formData.personalDetails.gender &&
    formData.personalDetails.phoneNumber.trim() &&
    formData.personalDetails.email.trim() &&
    formData.personalDetails.address.district.trim() &&
    formData.personalDetails.address.governorate

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Personal Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            {mode === "edit" ? "Edit User" : "Add New User"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Upload and Basic Info */}
            <div className="space-y-8">
              {/* Image Upload */}
              <div className="flex justify-center lg:justify-start">
                <label htmlFor="profile-image">
                  <div className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </div>
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imageFileName && (
                <p className="text-sm text-gray-600 text-center lg:text-left">Selected: {imageFileName}</p>
              )}

              {/* Personal Information Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Name</label>
                  <Input
                    type="text"
                    value={formData.personalDetails.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Gender</label>
                  <Select
                    value={formData.personalDetails.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.personalDetails.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.personalDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Address */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-blue-500 mb-6">Address</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">District</label>
                    <Input
                      type="text"
                      value={formData.personalDetails.address.district}
                      onChange={(e) => handleInputChange("address.district", e.target.value)}
                      className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500"
                      placeholder="Enter district"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Governorate</label>
                    <Select
                      value={formData.personalDetails.address.governorate}
                      onValueChange={(value) => handleInputChange("address.governorate", value)}
                    >
                      <SelectTrigger className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {GOVERNORATE_OPTIONS.map((governorate) => (
                          <SelectItem key={governorate} value={governorate}>
                            {governorate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
            <Button onClick={handleCancel} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === "edit" ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}