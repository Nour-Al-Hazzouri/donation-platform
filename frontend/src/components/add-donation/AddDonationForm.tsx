'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuthStore } from '@/store/authStore'
import { useDonationsStore } from '@/store/donationsStore'

function getUserInitials(firstName: string, lastName: string): string {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${firstInitial}${lastInitial}`
}

export function AddDonationForm() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addDonation } = useDonationsStore()
  
  const [formData, setFormData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    title: '',
    description: '',
    donationAmount: '',
    image: null as File | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update the name field if user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: `${user.first_name} ${user.last_name}` }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type and size
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Invalid file type. Please upload a JPEG, PNG, JPG, or GIF image.' }))
        return
      }
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: 'Image size exceeds 5MB limit.' }))
        return
      }
      
      setFormData(prev => ({ ...prev, image: file }))
      // Clear any previous errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.donationAmount.trim()) {
      newErrors.donationAmount = 'Donation amount is required'
    } else if (isNaN(Number(formData.donationAmount)) || Number(formData.donationAmount) <= 0) {
      newErrors.donationAmount = 'Please enter a valid amount'
    }
    
    // Keep any existing image errors
    if (errors.image) {
      newErrors.image = errors.image
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !user) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Prepare donation data for API
      const newDonation = {
        title: formData.title,
        description: formData.description,
        type: 'offer', // This is a donation offer
        goalAmount: parseFloat(formData.donationAmount),
        unit: 'LBP', // Default currency unit
        locationId: 1, // Default location ID
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined, // Convert File to URL for processing in the store
        // Set end_date to 30 days from now (this will be used in the store)
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
      
      // Call the API to create the donation
      await addDonation(newDonation)
      
      // Redirect to the donations page
      router.push('/donations')
    } catch (error) {
      console.error('Error submitting donation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-medium text-foreground">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
          readOnly={!!user} // Read-only if user is logged in
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title" className="text-base font-medium text-foreground">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="Enter donation title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`mt-2 ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description" className="text-base font-medium text-foreground">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="Enter donation description"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`mt-2 min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div>
        <Label htmlFor="donationAmount" className="text-base font-medium text-foreground">
          Donation Amount <span className="text-red-500">*</span>
        </Label>
        <Input
          id="donationAmount"
          type="number"
          placeholder="Enter donation amount"
          value={formData.donationAmount}
          onChange={(e) => handleInputChange('donationAmount', e.target.value)}
          className={`mt-2 ${errors.donationAmount ? 'border-red-500' : ''}`}
        />
        {errors.donationAmount && (
          <p className="mt-1 text-sm text-red-500">{errors.donationAmount}</p>
        )}
      </div>

      <div>
        <Label className="text-base font-medium text-foreground mb-3 block">
          Upload Image
        </Label>
        <div className="flex items-center space-x-4">
          <label htmlFor="image-upload">
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </label>
          <span className="text-muted-foreground text-sm">
            {formData.image ? formData.image.name : 'No file chosen'}
          </span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        
        {errors.image && (
          <p className="mt-2 text-sm text-red-500">{errors.image}</p>
        )}
        
        {formData.image && !errors.image && (
          <div className="mt-4">
            <img 
              src={URL.createObjectURL(formData.image)} 
              alt="Preview" 
              className="w-full max-w-md h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg"
        >
          {isSubmitting ? 'Creating Donation...' : 'Create Donation'}
        </Button>
      </div>
    </form>
  )
}