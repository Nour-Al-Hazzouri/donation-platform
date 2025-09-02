'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuthStore } from '@/store/authStore'
import { useDonationsStore } from '@/store/donationsStore'

export type AddDonationFormValues = {
  title: string
  description: string
  type: 'request' | 'offer'
  goalAmount: number
  unit: string
  locationId: number
  imageUrl?: string
  endDate: string
}

interface AddDonationFormProps {
  onSubmit?: (values: AddDonationFormValues) => Promise<void>
  submitting?: boolean
  error?: string | null
}

function getUserInitials(firstName?: string, lastName?: string): string {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : ''
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : ''
  return `${firstInitial}${lastInitial}`
}

export function AddDonationForm({ onSubmit, submitting: submittingProp, error: externalError }: AddDonationFormProps) {
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
  const [verificationError, setVerificationError] = useState<string | null>(null)

  // Sync external submitting prop if provided
  useEffect(() => {
    if (typeof submittingProp === 'boolean') {
      setIsSubmitting(submittingProp)
    }
  }, [submittingProp])

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

    // Check if user is verified
    if (!user.verified && !user.email_verified_at) {
      setVerificationError('Only verified users can make donations. Please verify your account first to ensure donation security and prevent fraud.')
      return
    }

    // Build the values object expected by onSubmit (if provided)
    const values: AddDonationFormValues = {
      title: formData.title,
      description: formData.description,
      type: 'offer', // This is a donation offer in your form
      goalAmount: parseFloat(formData.donationAmount),
      unit: 'LBP',
      locationId: 1,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined
    }

    // If caller passed an onSubmit prop, prefer that
    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(values)
        router.push('/donations')
      } catch (err: any) {
        console.error('Error in external onSubmit:', err)
        setErrors(prev => ({ ...prev, form: err?.response?.data?.message ?? 'Failed to create donation. Please try again later.' }))
      } finally {
        setIsSubmitting(false)
      }
      return
    }

    // Otherwise, call the store's addDonation and provide the full Omit<DonationData, 'id'> payload
    setIsSubmitting(true)
    try {
      const donationPayload = {
        // Required fields from DonationData
        name: formData.name,
        title: formData.title,
        description: formData.description,
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
        avatarUrl: user?.avatar_url || undefined,
        initials: getUserInitials(user?.first_name, user?.last_name),
        isVerified: !!user.email_verified_at,
        donationAmount: formData.donationAmount,
        createdAt: new Date().toISOString(),
        goalAmount: parseFloat(formData.donationAmount),
        currentAmount: 0,
        possibleAmount: 0,
        unit: 'LBP',
        type: 'offer' as 'offer',
        status: 'active' as 'active',
        userId: user.id,
        locationId: 1,
        endDate: values.endDate,
        location: null
      }

      // Call your zustand store which will call the API
      await addDonation(donationPayload as any) // store expects Omit<DonationData,'id'>

      // Redirect to the donations listing after success
      router.push('/donations')
    } catch (error: any) {
      console.error('Error submitting donation:', error)
      if (error.response?.status === 403) {
        setVerificationError('Only verified users can make donations. Please verify your account first to ensure donation security and prevent fraud.')
      } else if (error.response?.data?.message) {
        setErrors(prev => ({ ...prev, form: error.response.data.message }))
      } else {
        setErrors(prev => ({ ...prev, form: 'Failed to create donation. Please try again later.' }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(errors.form || externalError) && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.form || externalError}
        </div>
      )}
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

      {verificationError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {verificationError}
        </div>
      )}

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
