'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import EditLocation, { LocationData } from '@/components/admin/dashboard/EditLocation'

export default function LocationEditPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get location data from URL params
  const id = searchParams.get('id')
  const governorate = searchParams.get('governorate') || 'Beirut'
  const district = searchParams.get('district') || 'Achrafieh'
  
  const initialData: LocationData = {
    id: id || undefined,
    governorate,
    district
  }
  
  const handleSave = (locationData: LocationData) => {
    // In a real app, this would save to the backend
    console.log('Saving location:', locationData)
    
    // Store the updated location in localStorage to persist between page navigations
    if (locationData.id) {
      // Get existing locations from localStorage or initialize empty array
      const storedLocations = localStorage.getItem('adminLocations')
      let locations = storedLocations ? JSON.parse(storedLocations) : []
      
      // Update the location with matching id
      locations = locations.map((loc: LocationData) => 
        loc.id === locationData.id ? locationData : loc
      )
      
      // Save back to localStorage
      localStorage.setItem('adminLocations', JSON.stringify(locations))
    }
    
    // Navigate back to locations page
    router.push('/admin/locations')
  }
  
  const handleCancel = () => {
    // Navigate back to locations page without saving
    router.push('/admin/locations')
  }
  
  const handleBack = () => {
    // Navigate back to locations page
    router.push('/admin/locations')
  }
  
  return (
    <EditLocation 
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
      onBack={handleBack}
    />
  )
}