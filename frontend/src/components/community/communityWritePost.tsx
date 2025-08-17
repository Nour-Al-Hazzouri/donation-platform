"use client"

import React, { useState } from 'react'
import { ArrowLeft, ImageIcon, ArrowUp, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { COLORS } from '@/utils/constants'
import { useAuthStore } from '@/store/authStore'
import { CommunityPost } from '@/types'
import { communityService } from '@/lib/api/community'
import { toast } from 'sonner'
import { EventSelector } from './EventSelector'

interface CommunityWritePostProps {
  onCancel: () => void;
  onSubmitSuccess?: (newPost: CommunityPost) => void;
}

export default function CommunityWritePost({ onCancel, onSubmitSuccess }: CommunityWritePostProps) {
  const [tags, setTags] = useState('')
  const [postContent, setPostContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { user } = useAuthStore()

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviewImages = newFiles.map(file => URL.createObjectURL(file))
      
      setSelectedFiles([...selectedFiles, ...newFiles])
      setPreviewImages([...previewImages, ...newPreviewImages])
    }
  }

  const removeImage = (index: number) => {
    const newFiles = [...selectedFiles]
    const newPreviewImages = [...previewImages]
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewImages[index])
    
    newFiles.splice(index, 1)
    newPreviewImages.splice(index, 1)
    
    setSelectedFiles(newFiles)
    setPreviewImages(newPreviewImages)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postContent.trim()) return
    
    // Validate event selection
    if (!selectedEventId) {
      setError('Please select a donation event')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      // Prepare form data for API
      const formData = new FormData()
      formData.append('content', postContent)
      
      // Add tags if present
      const tagsList = tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      if (tagsList.length > 0) {
        tagsList.forEach(tag => {
          formData.append('tags[]', tag)
        })
      }
      
      // Add images if present
      selectedFiles.forEach(file => {
        formData.append('image_urls[]', file)
      })
      
      // Send to API
      const postData = {
        content: postContent,
        event_id: selectedEventId, // Add the selected event ID
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image_urls: selectedFiles
      };
      const response = await communityService.createPost(postData)
      
      if (response.success) {
        toast.success('Post created successfully!')
        
        if (onSubmitSuccess && response.data) {
          onSubmitSuccess(response.data)
        }
        
        // Reset form
        setTags('')
        setPostContent('')
        setSelectedFiles([])
        setPreviewImages([])
        
        // Return to feed
        onCancel()
      } else {
        setError('Failed to create post. Please try again.')
        toast.error('Failed to create post')
      }
    } catch (error: any) {
      console.error('Error creating post:', error)
      setError(error?.message || 'Failed to create post. Please try again.')
      toast.error('Error creating post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Button 
                onClick={onCancel}
                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <h1 className="text-lg font-medium text-foreground">Tags</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <form onSubmit={handleSubmit}>
{/* Event Selector Field */}
          <div className="mb-6">
            <Label className="mb-2">
              Related Donation Event <span className="text-red-500">*</span>
            </Label>
            <EventSelector 
              onSelect={setSelectedEventId}
              selectedEventId={selectedEventId}
              placeholder="Select a related donation event..."
            />
            {error && !selectedEventId && (
              <p className="text-destructive text-xs mt-1">Please select a donation event</p>
            )}
          </div>

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

          {/* Error message */}
          {error && (
            <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {previewImages.length > 0 && (
            <div className="mb-6">
              {previewImages.length === 1 ? (
                <div className="relative group">
                  <img 
                    src={previewImages[0]} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(0)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {previewImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Preview ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        {index + 1} / {previewImages.length}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button variant="outline" asChild>
              <Label className="cursor-pointer">
                <ImageIcon className="w-4 h-4 mr-2" />
                {previewImages.length > 0 ? `Add More Images (${previewImages.length})` : 'Add Images'}
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
              variant="default"
              className="bg-red-500 hover:bg-red-600 text-white gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <ArrowUp className="w-4 h-4" />
                  Post
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}