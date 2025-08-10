"use client"

import { useState, useEffect } from "react"
import { ChevronDown, Upload, ArrowLeft, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { COLORS } from "@/lib/constants"
import { cn } from '@/lib/utils'

const PRIORITY_OPTIONS = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
]

const INITIAL_FORM_DATA = {
  title: "",
  content: "",
  priority: "",
  image: null as File | null
}

interface CreateBlogPostProps {
  onCancel?: () => void
  onCreate?: (formData: BlogPostFormData) => Promise<void> | void
  onBack?: () => void
  initialData?: Partial<BlogPostFormData> & { imageUrl?: string }
  mode?: "create" | "edit"
}

interface BlogPostFormData {
  title: string
  content: string
  priority: string
  image: File | null
}

export function CreateBlogPost({
  onCancel,
  onCreate,
  onBack,
  initialData,
  mode = "create"
}: CreateBlogPostProps) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    ...INITIAL_FORM_DATA,
    ...initialData
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize image preview when in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData?.imageUrl) {
      setImagePreview(initialData.imageUrl)
    }
  }, [mode, initialData?.imageUrl])

  const handleInputChange = (field: keyof BlogPostFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError("Image size must be less than 2MB")
        return
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setImageError("Please select an image file")
        return
      }

      setImageError("")
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }
  
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    if (imagePreview) {
      // Only revoke object URL if it's not the initial image URL
      if (!initialData?.imageUrl || imagePreview !== initialData.imageUrl) {
        URL.revokeObjectURL(imagePreview)
      }
    }
    setImagePreview(null)
    setImageError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content || !formData.priority) return
    
    try {
      setIsSubmitting(true)
      await onCreate?.(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    if (imagePreview) {
      // Only revoke object URL if it's not the initial image URL
      if (!initialData?.imageUrl || imagePreview !== initialData.imageUrl) {
        URL.revokeObjectURL(imagePreview)
      }
    }
    onCancel?.()
  }

  const handleBack = () => {
    if (imagePreview) {
      // Only revoke object URL if it's not the initial image URL
      if (!initialData?.imageUrl || imagePreview !== initialData.imageUrl) {
        URL.revokeObjectURL(imagePreview)
      }
    }
    onBack?.()
  }

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.priority

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className={cn(
              "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md mb-4 sm:mb-6 z-10"
            )}
            style={{ color: COLORS.primary }}
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Blog post title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full text-sm sm:text-base border-gray-300 focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              Content<span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="Blog post content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full min-h-[120px] text-sm sm:text-base border-gray-300 focus:border-red-500 focus:ring-red-500 resize-vertical"
              required
            />
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              Priority<span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
              required
            >
              <SelectTrigger className="w-full max-w-full sm:max-w-xs border-gray-300 focus:border-red-500 focus:ring-red-500 text-sm sm:text-base">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image Upload Field */}
          <div>
            <label htmlFor="image" className="block text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">
              Featured Image
            </label>
            <div className="flex flex-col gap-3 sm:gap-4">
              {imagePreview ? (
                <div className="relative group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6 px-2 text-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-gray-500" />
                      <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (MAX. 2MB)
                      </p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
              {imageError && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-red-600">{imageError}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-white hover:bg-gray-100 text-red-500 border border-red-500 px-4 sm:px-8 w-full sm:w-auto order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-[#f90404] hover:bg-[#d90404] text-white px-4 sm:px-8 w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}