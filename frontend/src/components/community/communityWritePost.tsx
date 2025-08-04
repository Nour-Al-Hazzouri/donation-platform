"use client"

import React, { useState } from 'react'
import { ArrowLeft, ImageIcon, ArrowUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { COLORS } from '@/lib/constants'

interface CommunityWritePostProps {
  onCancel: () => void;
  onSubmitSuccess?: () => void;
}

export default function CommunityWritePost({ onCancel, onSubmitSuccess }: CommunityWritePostProps) {
  const [tags, setTags] = useState('')
  const [postContent, setPostContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      console.log('Post content:', postContent)
      console.log('Images:', images)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setTags('')
      setPostContent('')
      setImages([])
      
      if (onSubmitSuccess) {
        onSubmitSuccess()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Circular indicator like in carousel */}
            <div 
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: COLORS.primary }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onCancel}
              className="hover:bg-accent"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
          </div>
          <h1 className="text-lg font-medium text-foreground">Tags</h1>
        </div>
      </div>

      {/* Rest of the component remains the same */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit}>
          {/* Tags Field */}
          <div className="mb-6">
            <Label className="mb-2">
              Tags
            </Label>
            <Input
              type="text"
              placeholder="Add tags (separated by commas)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Content Field */}
          <div className="mb-6">
            <Label className="mb-2">
              Content
            </Label>
            <textarea
              className="w-full p-3 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[200px] text-foreground bg-background placeholder:text-muted-foreground"
              placeholder="Type your question"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              required
            />
          </div>

          {images.length > 0 && (
            <div className="mb-6 grid grid-cols-2 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Preview ${index}`} 
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Label className="cursor-pointer">
                <ImageIcon className="w-4 h-4 mr-2" />
                Add Image
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </Label>
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting || !postContent.trim()}
              style={{
                backgroundColor: isSubmitting || !postContent.trim() ? undefined : COLORS.primary,
                color: 'white'
              }}
              className="hover:bg-primaryHover gap-2"
            >
              <ArrowUp className="w-4 h-4" />
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}