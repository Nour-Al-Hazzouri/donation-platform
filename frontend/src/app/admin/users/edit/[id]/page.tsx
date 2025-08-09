"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

// Mock data for fetching user by ID
const fetchUserById = (id: string) => {
  // This would be replaced with an actual API call
  return {
    id,
    personalDetails: {
      name: `User ${id}`,
      gender: "male",
      phoneNumber: "09034867656",
      email: `user${id}@example.com`,
      address: {
        district: "Hamra",
        governorate: "Beirut",
      },
      profileImage: "/placeholder.svg?height=300&width=300&text=Profile",
    },
    createdAt: "2024-01-15",
    status: "active",
  }
}

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  // In a real application, you would fetch the user data from an API
  const userData = fetchUserById(userId)
  
  const [formData, setFormData] = useState({
    name: userData.personalDetails.name,
    gender: userData.personalDetails.gender,
    phoneNumber: userData.personalDetails.phoneNumber,
    email: userData.personalDetails.email,
    district: userData.personalDetails.address.district,
    governorate: userData.personalDetails.address.governorate,
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // In a real application, you would make an API call to update the user
      // await updateUser(userId, formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Navigate back to user profile
      router.push(`/admin/users/manage/${userId}`)
    } catch (error) {
      console.error("Error updating user:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar - only visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                  {/* Back Button */}
                  <button
                    onClick={() => router.push(`/admin/users/manage/${userId}`)}
                    className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-black transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Edit Form */}
                  <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-8">Edit User Profile</h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-blue-500 mb-4">Personal Information</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name</Label>
                              <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="gender">Gender</Label>
                              <Select
                                value={formData.gender}
                                onValueChange={(value) => handleSelectChange("gender", value)}
                              >
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor="phoneNumber">Phone Number</Label>
                              <Input
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="mt-1"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1"
                                required
                              />
                            </div>
                          </div>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-6">
                          <h3 className="text-xl font-semibold text-blue-500 mb-4">Address</h3>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="district">District</Label>
                              <Input
                                id="district"
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                                className="mt-1"
                                required
                              />
                            </div>

                            <div>
                              <Label htmlFor="governorate">Governorate</Label>
                              <Input
                                id="governorate"
                                name="governorate"
                                value={formData.governorate}
                                onChange={handleChange}
                                className="mt-1"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
                        <Button
                          type="button"
                          onClick={() => router.push(`/admin/users/manage/${userId}`)}
                          variant="outline"
                          className="px-8"
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-green-500 hover:bg-green-600 text-white px-8"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}