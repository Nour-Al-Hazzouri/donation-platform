"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import { COLORS } from "@/lib/constants"

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
  const router = useRouter()
  
  // Initialize locations state
  const [locations, setLocations] = useState<Location[]>([])
  
  // Load locations from localStorage or use mock data if none exist
  useEffect(() => {
    const storedLocations = localStorage.getItem('adminLocations')
    if (storedLocations) {
      // Use locations from localStorage
      setLocations(JSON.parse(storedLocations))
    } else {
      // Initialize with mock data
      const initialLocations = LOCATIONS.slice(0, 4).map((location, index) => ({
        id: `location-${index + 1}`,
        ...location
      }))
      setLocations(initialLocations)
      
      // Store initial locations in localStorage
      localStorage.setItem('adminLocations', JSON.stringify(initialLocations))
    }
  }, [])

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
      const updatedLocations = [...locations, newLocationWithId]
      setLocations(updatedLocations)
      
      // Update localStorage
      localStorage.setItem('adminLocations', JSON.stringify(updatedLocations))
      
      // Reset form
      setSelectedGovernorate("")
      setSelectedDistrict("")
    }
  }

  const handleEdit = (id: string) => {
    // Find the location to edit
    const locationToEdit = locations.find(loc => loc.id === id)
    if (locationToEdit) {
      // Navigate to edit page with location data
      const params = new URLSearchParams()
      params.set('id', id)
      params.set('governorate', locationToEdit.governorate)
      params.set('district', locationToEdit.district)
      router.push(`/admin/locations/edit?${params.toString()}`)
    }
  }

  const handleDelete = (id: string) => {
    const updatedLocations = locations.filter(loc => loc.id !== id)
    setLocations(updatedLocations)
    
    // Update localStorage
    localStorage.setItem('adminLocations', JSON.stringify(updatedLocations))
  }

  const handleCancel = () => {
    setSelectedGovernorate("")
    setSelectedDistrict("")
  }

  const isFormValid = selectedGovernorate && selectedDistrict

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-hidden">
          {/* Sidebar - visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-4 lg:p-6 flex-1 flex flex-col">
              <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
                <div className="w-full mx-auto">
                  {/* Page Title */}
                  <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6 lg:mb-8">Manage Locations</h1>

                  {/* Locations Table */}
                  <div className="bg-white rounded-lg shadow-sm mb-6 lg:mb-8 w-full overflow-hidden">
                    {/* Table Header - Stack on mobile/tablet */}
                    <div className="hidden md:grid md:grid-cols-10 gap-2 p-4 border-b bg-red-50 font-medium text-gray-700">
                      <div className="md:col-span-4">Governorate</div>
                      <div className="md:col-span-4">District</div>
                      <div className="md:col-span-2">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {locations.map((location) => (
                        <div key={location.id} className="p-4 hover:bg-gray-50">
                          {/* Mobile view - stacked layout */}
                          <div className="md:hidden grid grid-cols-1 gap-2 mb-3">
                            <div>
                              <span className="font-medium">Governorate: </span>
                              <span className="text-gray-900">{location.governorate}</span>
                            </div>
                            <div>
                              <span className="font-medium">District: </span>
                              <span className="text-gray-900">{location.district}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleEdit(location.id)}
                                className="bg-red-500 hover:bg-red-600 text-white flex-1"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDelete(location.id)}
                                className="bg-red-500 hover:bg-red-600 text-white flex-1"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Tablet/Desktop view - grid layout */}
                          <div className="hidden md:grid md:grid-cols-10 gap-2 items-center">
                            <div className="md:col-span-4 text-gray-900 truncate">{location.governorate}</div>
                            <div className="md:col-span-4 text-gray-900 truncate">{location.district}</div>
                            <div className="md:col-span-2 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEdit(location.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDelete(location.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Add New Location Form */}
                  <div className="bg-white rounded-lg shadow-sm p-4 lg:p-6">
                    <h2 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Add New Location</h2>
                    <div className="space-y-4 lg:space-y-6">
                      {/* Governorate Field */}
                      <div>
                        <label htmlFor="governorate" className="block text-base lg:text-lg font-medium text-gray-900 mb-2">
                          Governorate:
                        </label>
                        <Select
                          value={selectedGovernorate}
                          onValueChange={handleGovernorateChange}
                        >
                          <SelectTrigger className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500">
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
                        <label htmlFor="district" className="block text-base lg:text-lg font-medium text-gray-900 mb-2">
                          District
                        </label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={handleDistrictChange}
                          disabled={!selectedGovernorate}
                        >
                          <SelectTrigger className="w-full border-gray-300 focus:border-red-500 focus:ring-red-500 disabled:opacity-50">
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
                    <div className="flex justify-end gap-3 lg:gap-4 pt-4 lg:pt-6">
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
                        style={{
                          backgroundColor: COLORS.primaryHover,
                          color: 'white'
                        }}
                        className="hover:bg-[#c00404] px-4 lg:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
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