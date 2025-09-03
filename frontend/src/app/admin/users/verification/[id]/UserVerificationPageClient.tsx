"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import verificationService, { VerificationResponse } from "@/lib/api/verification"


export function UserVerificationPageClient({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [notes, setNotes] = useState("")
  const [verificationData, setVerificationData] = useState<VerificationResponse['data'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVerificationData = async () => {
      try {
        const resolvedParams = await params
        const verificationId = parseInt(resolvedParams.id)
        
        if (isNaN(verificationId)) {
          setError("Invalid verification ID")
          setIsLoading(false)
          return
        }

        const response = await verificationService.getVerification(verificationId)
        setVerificationData(response.data)
        setNotes(response.data.notes || "")
      } catch (err) {
        console.error("Error loading verification data:", err)
        setError("Failed to load verification data")
      } finally {
        setIsLoading(false)
      }
    }

    loadVerificationData()
  }, [params])

  const handleApprove = async () => {
    if (!verificationData) return
    
    try {
      await verificationService.updateVerificationStatus(
        verificationData.id,
        'approved',
        notes
      )
      router.push('/admin/users?tab=verification')
    } catch (err) {
      console.error("Error approving verification:", err)
      setError("Failed to approve verification")
    }
  }

  const handleDecline = async () => {
    if (!verificationData) return
    
    try {
      await verificationService.updateVerificationStatus(
        verificationData.id,
        'rejected',
        notes
      )
      router.push('/admin/users?tab=verification')
    } catch (err) {
      console.error("Error declining verification:", err)
      setError("Failed to decline verification")
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-background p-4 md:p-6 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading verification data...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error || !verificationData) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-background p-4 md:p-6 w-full">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-destructive mb-4">{error || "Verification not found"}</p>
              <Button onClick={() => router.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background p-4 md:p-6 w-full">
        <div className="w-full">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full">
            {/* Personal Details Section */}
            <div className="bg-card rounded-lg shadow-sm p-6 h-full border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Personal Details</h2>
              
              <div className="space-y-6 h-full">
                {/* Profile Image */}
                <div className="flex justify-center">
                  <div className="w-56 h-56 rounded-lg overflow-hidden bg-muted shadow-md">
                    {verificationData.user && (
                      <img
                        src="/placeholder.svg?height=224&width=224&text=Profile"
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=224&width=224&text=Profile";
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Name</label>
                    <p className="text-foreground font-medium">
                      {verificationData.user?.first_name} {verificationData.user?.last_name}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Username</label>
                    <p className="text-foreground">{verificationData.user?.username}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                    <p className="text-foreground">{verificationData.user?.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Document Type</label>
                    <p className="text-foreground capitalize">
                      {verificationData.document_type.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <p className={`font-medium capitalize ${
                      verificationData.status === 'approved' ? 'text-green-600 dark:text-green-400' :
                      verificationData.status === 'rejected' ? 'text-red-600 dark:text-red-400' :
                      'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {verificationData.status}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Submitted At</label>
                    <p className="text-foreground">
                      {new Date(verificationData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submitted Documents Section */}
            <div className="bg-card rounded-lg shadow-sm p-6 h-full border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Submitted Documents</h2>
              
              {/* Document Images */}
              <div className="space-y-4">
                {verificationData.image_full_urls && verificationData.image_full_urls.length > 0 ? (
                  verificationData.image_full_urls.map((imageUrl: any, index: number) => {
                    // Handle both string URLs and object URLs with original property
                    const imageSrc = typeof imageUrl === 'string' ? imageUrl : imageUrl?.original;
                    
                    // Skip if no valid image source
                    if (!imageSrc || imageSrc.trim() === '') {
                      return null;
                    }
                    
                    return (
                      <div key={index} className="border-2 border-border rounded-lg p-4 bg-muted">
                        <div className="bg-card rounded-lg p-4 shadow-sm">
                          <div className="text-center mb-4">
                            <p className="text-sm font-medium text-foreground">
                              Document {index + 1} - {verificationData.document_type.replace('_', ' ').toUpperCase()}
                            </p>
                          </div>
                          
                          <div className="flex justify-center">
                            <div className="max-w-md w-full">
                              <img
                                src={imageSrc}
                                alt={`Document ${index + 1}`}
                                className="w-full min-h-[250px] h-auto object-cover rounded-lg border border-border"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/placeholder.svg?height=250&width=400&text=Document";
                                }}
                              />
                            </div>
                          </div>
                          
                          {/* Document Details */}
                          <div className="mt-4 text-center">
                            <p className="text-xs text-muted-foreground">
                              {typeof imageUrl === 'object' && imageUrl?.original ? 
                                imageUrl.original.split('/').pop() : 
                                `Document ${index + 1}`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }).filter(Boolean)
                ) : (
                  <div className="border-2 border-border rounded-lg p-4 bg-muted">
                    <div className="bg-card rounded-lg p-4 shadow-sm text-center">
                      <p className="text-muted-foreground">No documents available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-8 bg-card rounded-lg shadow-sm p-6 w-full border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this verification request..."
              className="w-full h-40 p-3 border border-input rounded-lg resize-none bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-6 w-full pb-8">
            {verificationData.status === 'pending' && (
              <>
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="px-10 py-3 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950 text-base"
                >
                  Decline
                </Button>
                <Button
                  onClick={handleApprove}
                  className="px-10 py-3 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white text-base"
                >
                  Approve
                </Button>
              </>
            )}
            {verificationData.status !== 'pending' && (
              <div className="text-center w-full">
                <p className="text-muted-foreground mb-2">This verification has already been processed.</p>
                {verificationData.verifier && (
                  <p className="text-sm text-muted-foreground">
                    Processed by: {verificationData.verifier.first_name} {verificationData.verifier.last_name}
                  </p>
                )}
                {verificationData.verified_at && (
                  <p className="text-sm text-muted-foreground">
                    On: {new Date(verificationData.verified_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
