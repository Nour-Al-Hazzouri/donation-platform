'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuthStore } from '@/lib/store/authStore'
import { useRequestsStore } from '@/lib/store/requestsStore'

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
  const { addRequest } = useRequestsStore()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    title: '',
    description: '',
    goalAmount: '',
    image: null as File | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Create image URL if image was uploaded (in real app, this would be uploaded to a server)
      let imageUrl: string | undefined
      if (formData.image) {
        imageUrl = URL.createObjectURL(formData.image)
      }
      
      // Create the new request object
      const newRequest = {
        name: formData.name,
        title: formData.title,
        description: formData.description,
        goalAmount: formData.goalAmount,
        imageUrl: imageUrl,
        avatarUrl:"/placeholder.svg?height=48&width=48",
        initials: getUserInitials(formData.name),
        isVerified: user?.verified || false
      }
      
      // Add request to the store
      addRequest(newRequest)
      
      console.log('Request created successfully:', newRequest)
      
      // Redirect to requests page with success message
      router.push('/requests')
    } catch (error) {
      console.error('Error submitting request:', error)
      // In a real app, you'd show an error message to the user
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <Label htmlFor="name" className="text-base font-medium text-gray-900">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Steve Rogers"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      {/* Title Field */}
      <div>
        <Label htmlFor="title" className="text-base font-medium text-gray-900">
          Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          type="text"
          placeholder="in need for..."
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`mt-2 ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title}</p>
        )}
      </div>

      {/* Description Field */}
      <div>
        <Label htmlFor="description" className="text-base font-medium text-gray-900">
          Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          placeholder="I want..."
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className={`mt-2 min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Goal Amount Field */}
      <div>
        <Label htmlFor="goalAmount" className="text-base font-medium text-gray-900">
          Goal Amount <span className="text-red-500">*</span>
        </Label>
        <Input
          id="goalAmount"
          type="number"
          placeholder="ex: 10000"
          value={formData.goalAmount}
          onChange={(e) => handleInputChange('goalAmount', e.target.value)}
          className={`mt-2 ${errors.goalAmount ? 'border-red-500' : ''}`}
        />
        {errors.goalAmount && (
          <p className="mt-1 text-sm text-red-500">{errors.goalAmount}</p>
        )}
      </div>

      {/* Image Upload */}
      <div>
        <Label className="text-base font-medium text-gray-900 mb-3 block">
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
          <span className="text-gray-500 text-sm">
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
              src={URL.createObjectURL(formData.image) || "/placeholder.svg"} 
              alt="Preview" 
              className="w-full max-w-md h-32 object-cover rounded-md border"
            />
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg"
        >
          {isSubmitting ? 'Creating Request...' : 'Create Request'}
        </Button>
      </div>
    </form>
  )
}
