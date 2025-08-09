'use client'

import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import EditLocation, { LocationData } from '@/components/admin/dashboard/EditLocation'

export default function EditLocationPage() {
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