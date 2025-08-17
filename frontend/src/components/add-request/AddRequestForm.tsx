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

// Helper function to get user initials
function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function AddRequestForm() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addDonation } = useDonationsStore()
  
  const [formData, setFormData] = useState({
    name: user ? `${user.first_name} ${user.last_name}` : '',
    title: '',
    description: '',
    goalAmount: '',
    image: null as File | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: `${user.first_name} ${user.last_name}` }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
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

    if (!formData.goalAmount.trim()) {
      newErrors.goalAmount = 'Goal amount is required'
    } else if (isNaN(Number(formData.goalAmount)) || Number(formData.goalAmount) <= 0) {
      newErrors.goalAmount = 'Please enter a valid amount'
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
    if (!user.email_verified_at) {
      setErrors(prev => ({ ...prev, form: 'You must be verified to create a request. Please verify your account first.' }))
      return
    }

    setIsSubmitting(true)
    
    try {
      // Create the new donation request object
      const newRequest = {
        title: formData.title,
        description: formData.description,
        type: 'request', // Set type as request
        goalAmount: parseFloat(formData.goalAmount),
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined // Create a blob URL for the image
      }
      
      // Add donation request to the store using the API service
      await addDonation({
        title: formData.title,
        description: formData.description,
        type: 'request',
        goalAmount: parseFloat(formData.goalAmount),
        imageUrl: formData.image ? URL.createObjectURL(formData.image) : undefined,
        name: formData.name,
        initials: getUserInitials(formData.name),
        isVerified: !!user.email_verified_at
      })
      
      // Redirect to requests page
      router.push('/requests')
    } catch (error) {
      console.error('Error submitting request:', error)
      setErrors(prev => ({ ...prev, form: 'Failed to create request. Please try again later.' }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.form}
          </div>
        )}
        {/* Name Field */}
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
            className={`mt-2 bg-background dark:bg-background dark:text-foreground border-input dark:border-border ${errors.name ? 'border-red-500' : ''}`}
            readOnly={!!user}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Title Field */}
        <div>
          <Label htmlFor="title" className="text-base font-medium text-foreground">
            Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter request title"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className={`mt-2 bg-background dark:bg-background dark:text-foreground border-input dark:border-border ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <Label htmlFor="description" className="text-base font-medium text-foreground">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Enter request description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`mt-2 min-h-[120px] bg-background dark:bg-background dark:text-foreground border-input dark:border-border resize-none ${errors.description ? 'border-red-500' : ''}`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Goal Amount Field */}
        <div>
          <Label htmlFor="goalAmount" className="text-base font-medium text-foreground">
            Goal Amount <span className="text-red-500">*</span>
          </Label>
          <Input
            id="goalAmount"
            type="number"
            placeholder="Enter goal amount"
            value={formData.goalAmount}
            onChange={(e) => handleInputChange('goalAmount', e.target.value)}
            className={`mt-2 bg-background dark:bg-background dark:text-foreground border-input dark:border-border ${errors.goalAmount ? 'border-red-500' : ''}`}
          />
          {errors.goalAmount && (
            <p className="mt-1 text-sm text-red-500">{errors.goalAmount}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-base font-medium text-foreground mb-3 block">
            Upload Image
          </Label>
          <div className="flex items-center space-x-4">
            <label htmlFor="image-upload">
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white flex items-center gap-2 transition-colors"
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
            </label>
            <span className="text-muted-foreground dark:text-muted-foreground text-sm">
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
          
          {/* Image Preview */}
          {formData.image && (
            <div className="mt-4">
              <img 
                src={URL.createObjectURL(formData.image)} 
                alt="Preview" 
                className="w-full max-w-md h-32 object-cover rounded-md border border-border dark:border-border"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 text-white dark:text-white py-3 text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Request...' : 'Create Request'}
          </Button>
        </div>
      </form>
    </div>
  )
}