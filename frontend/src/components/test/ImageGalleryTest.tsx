'use client'

import React, { useState } from 'react'
import { ImageGallery } from '@/components/ui/image-gallery'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ImageGalleryTest() {
  // Test cases with different URL formats
  const testCases = [
    {
      name: 'Valid URLs',
      images: [
        'https://images.unsplash.com/photo-1504281623087-1f6f7c0fd8ce?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop'
      ]
    },
    {
      name: 'Relative URLs',
      images: [
        '/donation1.png',
        '/donation2.jpg'
      ]
    },
    {
      name: 'Storage URLs',
      images: [
        'storage/community/posts/abc123.jpg',
        'storage/community/posts/def456.jpg'
      ]
    },
    {
      name: 'Invalid URLs',
      images: [
        'https://invalid-domain-that-does-not-exist.com/image.jpg',
        'https://example.com/non-existent-image.png'
      ]
    },
    {
      name: 'Mixed URLs',
      images: [
        'https://images.unsplash.com/photo-1504281623087-1f6f7c0fd8ce?w=500&h=300&fit=crop',
        '/donation1.png',
        'storage/community/posts/abc123.jpg',
        'https://invalid-domain-that-does-not-exist.com/image.jpg'
      ]
    },
    {
      name: 'Empty Array',
      images: []
    },
    {
      name: 'Undefined',
      images: undefined
    }
  ]

  const [currentTestCase, setCurrentTestCase] = useState(0)

  const nextTestCase = () => {
    setCurrentTestCase((prev) => (prev + 1) % testCases.length)
  }

  const prevTestCase = () => {
    setCurrentTestCase((prev) => (prev - 1 + testCases.length) % testCases.length)
  }

  const currentTest = testCases[currentTestCase]

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">ImageGallery Component Test</h1>
      
      <div className="flex gap-4 mb-4">
        <Button onClick={prevTestCase} variant="outline">Previous Test</Button>
        <Button onClick={nextTestCase} variant="outline">Next Test</Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Case: {currentTest.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2">Images Array:</h3>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(currentTest.images, null, 2)}
            </pre>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium mb-2">Component Output:</h3>
            <div className="border border-border rounded-lg p-4">
              <ImageGallery images={currentTest.images} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}