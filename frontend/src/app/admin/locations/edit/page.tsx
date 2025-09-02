"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Location, locationsService } from "@/lib/api/locations"
import { toast } from "sonner"

export default function EditLocation() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locationId = searchParams.get('id')
  
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [governorate, setGovernorate] = useState("")
  const [district, setDistrict] = useState("")

  useEffect(() => {
    if (locationId) {
      loadLocation()
    } else {
      setError("No location ID provided")
      setLoading(false)
    }
  }, [locationId])

  const loadLocation = async () => {
    try {
      setLoading(true)
      const locationData = await locationsService.getLocation(Number(locationId))
      setLocation(locationData)
      setGovernorate(locationData.governorate)
      setDistrict(locationData.district)
      setError(null)
    } catch (err) {
      setError("Failed to load location")
      toast.error("Failed to load location")
      console.error("Error loading location:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!locationId || !governorate.trim() || !district.trim()) {
      toast.error("Please fill in both governorate and district")
      return
    }
    
    try {
      setIsSubmitting(true)
      setError(null)
      await locationsService.updateLocation(Number(locationId), {
        governorate: governorate.trim(),
        district: district.trim()
      })
      toast.success("Location updated successfully")
      router.push("/admin/locations")
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Failed to update location"
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error updating location:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (location) {
      setGovernorate(location.governorate)
      setDistrict(location.district)
    }
    router.push("/admin/locations")
  }

  const handleBack = () => {
    router.push("/admin/locations")
  }

  const isFormValid = governorate && district
  const hasChanges = location 
    ? (governorate !== location.governorate || district !== location.district)
    : false

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">{error}</div>
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
                <div className="max-w-4xl mx-auto">
                  {/* Back Button */}
                  <Button
                    onClick={handleBack}
                    className="mb-6 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors z-10"
                    aria-label="Go back"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>

                  {/* Page Title */}
                  <h1 className="text-2xl font-semibold text-foreground mb-8">Edit Location</h1>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                      {error}
                    </div>
                  )}

                  {/* Edit Form */}
                  <div className="bg-background rounded-lg shadow-sm border border-border p-6">
                    <div className="space-y-6">
                      {/* Governorate Field */}
                      <div>
                        <label htmlFor="governorate" className="block text-lg font-medium text-foreground mb-2">
                          Governorate:
                        </label>
                        <input
                          type="text"
                          value={governorate}
                          onChange={(e) => setGovernorate(e.target.value)}
                          placeholder="Enter governorate name"
                          className="w-full max-w-xs p-2 border border-border rounded-md focus:border-primary focus:ring-primary"
                        />
                      </div>

                      {/* District Field */}
                      <div>
                        <label htmlFor="district" className="block text-lg font-medium text-foreground mb-2">
                          District:
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Enter district name"
                          className="w-full max-w-xs p-2 border border-border rounded-md focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-border mt-6">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        disabled={!isFormValid || !hasChanges || isSubmitting}
                        onClick={handleSave}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
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