"use client"

import { useState } from "react"
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

// Mock data constants
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
  onCreate?: (formData: BlogPostFormData) => void
  onBack?: () => void
  initialData?: Partial<BlogPostFormData>
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
  const [imageFileName, setImageFileName] = useState<string>("") 
  const [imageError, setImageError] = useState<string>("") 

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
      
      setImageError("")
      setImageFileName(file.name)
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }
  
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }))
    setImageFileName("")
    setImageError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title && formData.content && formData.priority) {
      onCreate?.(formData)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    }
  }

  const isFormValid = formData.title.trim() && formData.content.trim() && formData.priority

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={handleBack}
            className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-900 mb-2">
              Title<span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              type="text"
              placeholder="whatever"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full text-base border-gray-300 focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-900 mb-2">
              Content<span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="whatever"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
              className="w-full min-h-[120px] text-base border-gray-300 focus:border-red-500 focus:ring-red-500 resize-vertical"
              required
            />
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="block text-lg font-medium text-gray-900 mb-2">
              Priority
            </label>
            <Select
              value={formData.priority}
              onValueChange={(value) => handleInputChange("priority", value)}
            >
              <SelectTrigger className="w-full max-w-xs border-gray-300 focus:border-red-500 focus:ring-red-500">
                <SelectValue placeholder="select priority" />
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
            <label htmlFor="image" className="block text-lg font-medium text-gray-900 mb-2">
              Featured Image
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Upload Image</span>
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
                {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
              </div>
              
              {!formData.image && (
                <div className="text-gray-500 mt-2">image.png</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={handleCancel}
              className="bg-white hover:bg-gray-100 text-red-500 border border-red-500 px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
              className="bg-green-500 hover:bg-green-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}