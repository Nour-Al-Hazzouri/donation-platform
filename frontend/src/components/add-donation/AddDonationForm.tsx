'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuthStore } from '@/store/authStore'
import { useDonationsStore } from '@/store/donationsStore'

function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export function AddDonationForm() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { addDonation } = useDonationsStore()
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    donationAmount: '',
    image: null as File | null
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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

    if (!formData.donationAmount.trim()) {
      newErrors.donationAmount = 'Donation amount is required'
    } else if (isNaN(Number(formData.donationAmount)) || Number(formData.donationAmount) <= 0) {
      newErrors.donationAmount = 'Please enter a valid amount'
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
      let imageUrl: string | undefined
      if (formData.image) {
        // Create a blob URL for the image
        imageUrl = URL.createObjectURL(formData.image)
      }
      
      const newDonation = {
        id: Date.now(), // Generate a unique ID
        name: formData.name,
        title: formData.title,
        description: formData.description,
        donationAmount: formData.donationAmount,
        imageUrl: imageUrl,
        avatarUrl: "/placeholder.svg",
        initials: getUserInitials(formData.name),
        isVerified: user?.verified || false
      }
      
      addDonation(newDonation)
      
      router.push('/donations?success=donation-created')
    } catch (error) {
      console.error('Error submitting donation:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-base font-medium text-gray-900">
          Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`mt-2 ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="title" className="text-base font-medium text-gray-900">
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
        <Label htmlFor="description" className="text-base font-medium text-gray-900">
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
        <Label htmlFor="donationAmount" className="text-base font-medium text-gray-900">
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
        
        {formData.image && (
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