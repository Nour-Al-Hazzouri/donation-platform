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
import { COLORS } from "@/utils/constants"
import { cn } from '@/utils'

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
    <div className="min-h-screen bg-background p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {onBack && (
          <Button
            onClick={handleBack}
            className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors mb-4 sm:mb-6 z-10"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
              Title<span className="text-primary">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Blog post title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full text-sm sm:text-base border-input focus:border-primary focus:ring-primary"
              required
            />
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
              Content<span className="text-primary">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="Blog post content"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full min-h-[120px] text-sm sm:text-base border-input focus:border-primary focus:ring-primary resize-vertical"
              required
            />
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
              Priority<span className="text-primary">*</span>
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
              required
            >
              <SelectTrigger className="w-full max-w-full sm:max-w-xs border-input focus:border-primary focus:ring-primary text-sm sm:text-base">
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
            <label htmlFor="image" className="block text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">
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
                    className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-md hover:bg-muted"
                  >
                    <X className="w-5 h-5 text-primary" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/80"
                  >
                    <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-4 sm:pb-6 px-2 text-center">
                      <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-muted-foreground" />
                      <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-muted-foreground">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
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
              {imageError && <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-destructive">{imageError}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:space-x-4 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-background hover:bg-muted text-primary border border-primary px-4 sm:px-8 w-full sm:w-auto order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-8 w-full sm:w-auto order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Processing..." : mode === "create" ? "Create" : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}