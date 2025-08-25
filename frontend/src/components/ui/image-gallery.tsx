'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, ImageIcon } from 'lucide-react'
import { cn } from '@/utils'
import Image from 'next/image'

interface ImageGalleryProps {
  images: string[] | undefined
  className?: string
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imgError, setImgError] = useState<Record<number, boolean>>({})

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
        <ImageIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground ml-2">No images available</p>
      </div>
    )
  }

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const closeFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFullscreen(false)
  }

  // Single image display
  if (images.length === 1) {
    return (
      <div 
        className={cn("relative rounded-lg overflow-hidden cursor-pointer", className)}
        onClick={toggleFullscreen}
      >
        {imgError[0] ? (
          <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground ml-2">Image unavailable</p>
          </div>
        ) : (
          <img
            src={images[0]}
            alt="Post image"
            className="w-full h-auto max-h-96 object-cover"
            onError={() => setImgError(prev => ({ ...prev, 0: true }))}
          />
        )}
        
        {isFullscreen && !imgError[0] && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeFullscreen}>
            <button 
              className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
              onClick={closeFullscreen}
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={images[0]}
              alt="Post image fullscreen"
              className="max-w-full max-h-full object-contain p-4"
              onError={() => setImgError(prev => ({ ...prev, 0: true }))}
            />
          </div>
        )}
      </div>
    )
  }

  // Multiple images gallery
  return (
    <div className={cn("relative", className)}>
      {/* Main image display */}
      <div 
        className="relative rounded-lg overflow-hidden cursor-pointer"
        onClick={toggleFullscreen}
      >
        {imgError[currentIndex] ? (
          <div className="flex items-center justify-center h-40 bg-muted rounded-lg">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground ml-2">Image unavailable</p>
          </div>
        ) : (
          <img
            src={images[currentIndex]}
            alt={`Post image ${currentIndex + 1}`}
            className="w-full h-auto max-h-96 object-cover"
            onError={() => setImgError(prev => ({ ...prev, [currentIndex]: true }))}
          />
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex mt-2 gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <div 
              key={index}
              className={cn(
                "w-16 h-16 rounded-md overflow-hidden flex-shrink-0 cursor-pointer border-2",
                index === currentIndex ? "border-primary" : "border-transparent"
              )}
              onClick={() => setCurrentIndex(index)}
            >
              {imgError[index] ? (
                <div className="flex items-center justify-center w-full h-full bg-muted">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              ) : (
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(prev => ({ ...prev, [index]: true }))}
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Navigation arrows */}
      <button
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
        onClick={handlePrevious}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <button
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
        onClick={handleNext}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      
      {/* Fullscreen mode */}
      {isFullscreen && !imgError[currentIndex] && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center" onClick={closeFullscreen}>
          <button 
            className="absolute top-4 right-4 text-white p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70"
            onClick={closeFullscreen}
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={images[currentIndex]}
            alt={`Post image ${currentIndex + 1} fullscreen`}
            className="max-w-full max-h-full object-contain p-4"
            onError={() => setImgError(prev => ({ ...prev, [currentIndex]: true }))}
          />
          
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={handlePrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
            onClick={handleNext}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  )
}