"use client"

import { useState, use, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import verificationService from "@/lib/api/verification"
import { toast } from "@/components/ui/use-toast"

export default function VerificationRequestDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  // Unwrap params using React.use() to avoid the warning
  const { id } = use(params)
  const verificationId = parseInt(id)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [verification, setVerification] = useState<any>(null)
  
  // Check if verification is already processed
  const isProcessed = verification?.status === 'approved' || verification?.status === 'rejected'

  // Fetch verification data when component mounts
  useEffect(() => {
    const fetchVerificationData = async () => {
      try {
        setLoading(true)
        const response = await verificationService.getVerification(verificationId)
        setVerification(response.data)
        setLoading(false)
      } catch (err) {
        console.error('Error fetching verification data:', err)
        setError('Failed to load verification data. Please try again.')
        setLoading(false)
      }
    }
    
    if (verificationId) {
      fetchVerificationData()
    }
  }, [verificationId])

  const handleApprove = async () => {
    try {
      setSubmitting(true)
      // Ensure verificationId is a number
      const id = typeof verificationId === 'string' ? parseInt(verificationId, 10) : verificationId
      
      if (isNaN(id)) {
        throw new Error('Invalid verification ID')
      }
      
      await verificationService.updateVerificationStatus(id, 'approved', notes)
      toast({
        title: "Verification approved",
        description: "The user's verification request has been approved.",
      })
      setSubmitting(false)
      router.push('/admin/users?tab=verification')
    } catch (err: any) {
      console.error('Error approving verification:', err)
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to approve verification. Please try again.",
        variant: "destructive"
      })
      setSubmitting(false)
    }
  }

  const handleDecline = async () => {
    try {
      setSubmitting(true)
      // Ensure verificationId is a number
      const id = typeof verificationId === 'string' ? parseInt(verificationId, 10) : verificationId
      
      if (isNaN(id)) {
        throw new Error('Invalid verification ID')
      }
      
      await verificationService.updateVerificationStatus(id, 'rejected', notes)
      toast({
        title: "Verification declined",
        description: "The user's verification request has been declined.",
      })
      setSubmitting(false)
      router.push('/admin/users?tab=verification')
    } catch (err: any) {
      console.error('Error declining verification:', err)
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to decline verification. Please try again.",
        variant: "destructive"
      })
      setSubmitting(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar - only visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              <div className="w-full max-w-6xl mx-auto">
                {/* Back Button */}
                <button
                  onClick={handleBack}
                  className="mb-4 sm:mb-6 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              {!loading && !error && verification && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8 w-full">
                  {/* Personal Details Section */}
                  <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6 h-full border border-border">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Personal Details</h2>
                    
                    <div className="space-y-4 sm:space-y-6 h-full">
                      {/* Profile Image */}
                      <div className="flex justify-center">
                        <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-lg overflow-hidden bg-gray-100 shadow-md">
                          <Image
                            src={verification.user?.avatar_url_full || verification.user?.avatar_url || "/placeholder.svg"}
                            alt="Profile"
                            width={224}
                            height={224}
                            className="w-full h-full object-cover"
                            priority
                          />
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-1 col-span-1 sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Verification Status</p>
                          <p className={`font-medium ${verification.status === 'pending' ? 'text-yellow-600' : verification.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                            {verification.status ? verification.status.charAt(0).toUpperCase() + verification.status.slice(1) : 'Unknown'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Full Name</p>
                          <p className="font-medium text-foreground">{verification.user ? `${verification.user.first_name} ${verification.user.last_name}` : 'Unknown'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Username</p>
                          <p className="font-medium text-foreground">{verification.user?.username || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Phone Number</p>
                          <p className="font-medium text-foreground">{verification.user?.phone || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-medium text-foreground break-all">{verification.user?.email}</p>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="pt-2 sm:pt-4">
                        <h3 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">District</p>
                            <p className="font-medium text-foreground">{verification.user?.location?.district || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Street</p>
                            <p className="font-medium text-foreground">N/A</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Governorate</p>
                            <p className="font-medium text-foreground">{verification.user?.location?.governorate || 'N/A'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">City</p>
                            <p className="font-medium text-foreground">N/A</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6 h-full border border-border">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Submitted Documents</h2>
                    
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">Document Type</p>
                      <p className="font-medium text-foreground">
                        {verification.document_type ? verification.document_type.split('_').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Unknown'}
                      </p>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      {verification.image_full_urls && verification.image_full_urls.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {verification.image_full_urls.map((imageUrl: {original: string}, index: number) => (
                            <div key={index} className="border border-border rounded-lg p-4">
                              {/* Document Image */}
                              <div className="flex justify-center mb-4">
                                <div className="w-full max-w-md rounded-lg overflow-hidden bg-muted shadow-md">
                                  <img
                                    src={imageUrl.original || "/placeholder.svg?height=250&width=400&text=Document"}
                                    alt={`Document ${index + 1}`}
                                    className="w-full min-h-[250px] h-auto object-cover"
                                  />
                                </div>
                              </div>

                              {/* Document Details */}
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <p className="text-sm text-muted-foreground">Document #{index + 1}</p>
                                  <p className="font-medium text-foreground break-all">{imageUrl.original.split('/').pop() || `Document ${index + 1}`}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No documents submitted
                        </div>
                      )}
                    </div>
                  </div>
                
                  {/* Verification Details */}
                  <div className="xl:col-span-2 mt-6 sm:mt-8 bg-background rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                    <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Verification Details</h2>
                    
                    {/* Dates and Verifier Information */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Submission Date</p>
                        <p className="font-medium text-foreground">
                          {verification.created_at ? new Date(verification.created_at).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      
                      {verification.verified_at && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Verification Date</p>
                          <p className="font-medium text-foreground">
                            {new Date(verification.verified_at).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                      
                      {verification.verifier && (
                        <div className="space-y-1 sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Verified By</p>
                          <p className="font-medium text-foreground">
                            {`${verification.verifier.first_name} ${verification.verifier.last_name}`}
                          </p>
                        </div>
                      )}
                      
                      {verification.notes && (
                        <div className="space-y-1 sm:col-span-2">
                          <p className="text-sm text-muted-foreground">Previous Notes</p>
                          <p className="font-medium text-foreground">{verification.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground mb-4">Review and Decision</h3>
                    <div className="space-y-4 sm:space-y-6">
                    
                      {/* Notes Textarea */}
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-1 sm:mb-2">Notes</label>
                        <textarea
                          id="notes"
                          rows={3}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 text-sm sm:text-base text-foreground"
                          placeholder="Add any notes about this verification request..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          disabled={submitting || isProcessed}
                        />
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                        {isProcessed ? (
                          <div className="w-full text-center p-3 bg-muted rounded-md">
                            <p className="text-muted-foreground">This verification request has already been {verification?.status}.</p>
                          </div>
                        ) : (
                          <>
                            <Button 
                              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto order-2 sm:order-1"
                              onClick={handleDecline}
                              disabled={submitting || isProcessed}
                            >
                              {submitting ? 'Processing...' : 'Decline Verification'}
                            </Button>
                            <Button 
                              className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto order-1 sm:order-2"
                              onClick={handleApprove}
                              disabled={submitting || isProcessed}
                            >
                              {submitting ? 'Processing...' : 'Approve Verification'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}