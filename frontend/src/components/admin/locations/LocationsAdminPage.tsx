"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Location, locationsService } from "@/lib/api/locations"
import { toast } from "sonner"

export function LocationsAdminPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedGovernorate, setSelectedGovernorate] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load locations from API
  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      const locationsData = await locationsService.listLocations()
      setLocations(locationsData)
      setError(null)
    } catch (err) {
      setError("Failed to load locations")
      toast.error("Failed to load locations")
      console.error("Error loading locations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!selectedGovernorate || !selectedDistrict) {
      toast.error("Please fill in both governorate and district")
      return
    }
    
    // Check for duplicate location
    const isDuplicate = locations.some(loc => 
      loc.governorate.toLowerCase() === selectedGovernorate.toLowerCase() && 
      loc.district.toLowerCase() === selectedDistrict.toLowerCase()
    )
    
    if (isDuplicate) {
      toast.error("This location already exists")
      return
    }
    
    try {
      setIsSubmitting(true)
      setError(null)
      const newLocation = await locationsService.createLocation({
        governorate: selectedGovernorate.trim(),
        district: selectedDistrict.trim()
      })
      
      setLocations(prev => [...prev, newLocation])
      setSelectedGovernorate("")
      setSelectedDistrict("")
      toast.success("Location added successfully")
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to add location"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error adding location:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/admin/locations/edit?id=${id}`)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this location?")) return
    
    try {
      setError(null)
      await locationsService.deleteLocation(id)
      setLocations(prev => prev.filter(loc => loc.id !== id))
      toast.success("Location deleted successfully")
    } catch (err: any) {
      let errorMessage = "Failed to delete location"
      
      if (err?.response?.status === 409) {
        errorMessage = "Cannot delete location as it's being used by other records"
      } else if (err?.response?.status === 404) {
        errorMessage = "Location not found"
      } else if (err?.response?.status === 403) {
        errorMessage = "You don't have permission to delete locations"
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error deleting location:", err)
    }
  }

  const handleCancel = () => {
    setSelectedGovernorate("")
    setSelectedDistrict("")
  }

  const isFormValid = selectedGovernorate && selectedDistrict

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

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
              <div className="min-h-screen bg-background p-4 lg:p-6">
                <div className="w-full mx-auto">
                  {/* Page Title */}
                  <h1 className="text-xl lg:text-2xl font-semibold text-foreground mb-6 lg:mb-8">Manage Locations</h1>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}

                  {/* Locations Table */}
                  <div className="bg-background rounded-lg shadow-sm mb-6 lg:mb-8 w-full overflow-hidden border border-border">
                    {/* Table Header - Stack on mobile/tablet */}
                    <div className="hidden md:grid md:grid-cols-10 gap-2 p-4 border-b border-border bg-primary/10 font-medium text-foreground">
                      <div className="md:col-span-4">Governorate</div>
                      <div className="md:col-span-4">District</div>
                      <div className="md:col-span-2">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-border">
                      {locations.map((location) => (
                        <div key={location.id} className="p-4 hover:bg-secondary/50">
                          {/* Mobile view - stacked layout */}
                          <div className="md:hidden grid grid-cols-1 gap-2 mb-3">
                            <div>
                              <span className="font-medium">Governorate: </span>
                              <span className="text-foreground">{location.governorate}</span>
                            </div>
                            <div>
                              <span className="font-medium">District: </span>
                              <span className="text-foreground">{location.district}</span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button
                                size="sm"
                                onClick={() => handleEdit(location.id)}
                                className="bg-red-300 hover:bg-red-400 text-white flex-1"
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
                            <div className="md:col-span-4 text-foreground truncate">{location.governorate}</div>
                            <div className="md:col-span-4 text-foreground truncate">{location.district}</div>
                            <div className="md:col-span-2 flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleEdit(location.id)}
                                className="bg-red-300 hover:bg-red-400 text-white px-2"
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

                    {locations.length === 0 && (
                      <div className="p-8 text-center text-muted-foreground">
                        No locations found. Add your first location below.
                      </div>
                    )}
                  </div>

                  {/* Add New Location Form */}
                  <div className="bg-background rounded-lg shadow-sm p-4 lg:p-6 border border-border">
                    <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Add New Location</h2>
                    <div className="space-y-4 lg:space-y-6">
                      {/* Governorate Field */}
                      <div>
                        <label htmlFor="governorate" className="block text-base lg:text-lg font-medium text-foreground mb-2">
                          Governorate:
                        </label>
                        <input
                          type="text"
                          value={selectedGovernorate}
                          onChange={(e) => setSelectedGovernorate(e.target.value)}
                          placeholder="Enter governorate name"
                          className="w-full p-2 border border-border rounded-md focus:border-primary focus:ring-primary"
                        />
                      </div>

                      {/* District Field */}
                      <div>
                        <label htmlFor="district" className="block text-base lg:text-lg font-medium text-foreground mb-2">
                          District
                        </label>
                        <input
                          type="text"
                          value={selectedDistrict}
                          onChange={(e) => setSelectedDistrict(e.target.value)}
                          placeholder="Enter district name"
                          className="w-full p-2 border border-border rounded-md focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 lg:gap-4 pt-4 lg:pt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="text-primary hover:text-primary/80 hover:bg-primary/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={!isFormValid || isSubmitting}
                        onClick={handleAdd}
                        variant="default"
                        className="bg-red-500 hover:bg-red-600 text-white px-4 lg:px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Add"}
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