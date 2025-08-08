"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

// Mock data constants based on provided locations
const LOCATIONS = [
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

interface Location {
  id: string
  governorate: string
  district: string
}

export function LocationsAdminPage() {
  // Convert mock data to include IDs for table display
  const [locations, setLocations] = useState<Location[]>(
    LOCATIONS.slice(0, 4).map((location, index) => ({
      id: `location-${index + 1}`,
      ...location
    }))
  )

  const [selectedGovernorate, setSelectedGovernorate] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")

  // Get unique governorates for dropdown
  const governorates = useMemo(() => {
    const unique = [...new Set(LOCATIONS.map(location => location.governorate))]
    return unique.sort()
  }, [])

  // Get districts for selected governorate
  const availableDistricts = useMemo(() => {
    if (!selectedGovernorate) return []
    return LOCATIONS
      .filter(location => location.governorate === selectedGovernorate)
      .map(location => location.district)
      .sort()
  }, [selectedGovernorate])

  const handleGovernorateChange = (value: string) => {
    setSelectedGovernorate(value)
    setSelectedDistrict("") // Reset district when governorate changes
  }

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value)
  }

  const handleAdd = () => {
    if (selectedGovernorate && selectedDistrict) {
      const newLocation = {
        governorate: selectedGovernorate,
        district: selectedDistrict
      }
      
      // Add to local state
      const newLocationWithId = {
        id: `location-${Date.now()}`,
        ...newLocation
      }
      setLocations(prev => [...prev, newLocationWithId])
      
      // Reset form
      setSelectedGovernorate("")
      setSelectedDistrict("")
    }
  }

  const handleEdit = (id: string) => {
    // In a real app, this would open an edit form or modal
    console.log("Edit location", id)
  }

  const handleDelete = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id))
  }

  const handleCancel = () => {
    setSelectedGovernorate("")
    setSelectedDistrict("")
  }

  const isFormValid = selectedGovernorate && selectedDistrict

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
                  {/* Page Title */}
                  <h1 className="text-2xl font-semibold text-gray-900 mb-8">Manage Locations</h1>

                  {/* Locations Table */}
                  <div className="bg-white rounded-lg shadow-sm mb-8">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 gap-4 p-4 border-b bg-red-50 font-medium text-gray-700">
                      <div>Governorate</div>
                      <div>District</div>
                      <div>Action</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {locations.map((location) => (
                        <div key={location.id} className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-gray-50">
                          <div className="text-gray-900">{location.governorate}</div>
                          <div className="text-gray-900">{location.district}</div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEdit(location.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(location.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-4"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Location Form */}
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Location</h2>
                    <div className="space-y-6">
                      {/* Governorate Field */}
                      <div>
                        <label htmlFor="governorate" className="block text-lg font-medium text-gray-900 mb-2">
                          Governorate:
                        </label>
                        <Select
                          value={selectedGovernorate}
                          onValueChange={handleGovernorateChange}
                        >
                          <SelectTrigger className="w-full max-w-xs border-gray-300 focus:border-red-500 focus:ring-red-500">
                            <SelectValue placeholder="--Select Governorate--" />
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
                        <Select
                          value={selectedDistrict}
                          onValueChange={handleDistrictChange}
                          disabled={!selectedGovernorate}
                        >
                          <SelectTrigger className="w-full max-w-xs border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:opacity-50">
                            <SelectValue placeholder="A Random District" />
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
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={!isFormValid}
                        onClick={handleAdd}
                        className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </Button>
                    </div>
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