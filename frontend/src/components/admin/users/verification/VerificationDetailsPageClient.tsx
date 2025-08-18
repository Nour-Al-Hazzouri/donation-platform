"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import verificationService from "@/lib/api/verification"
import { toast } from "@/components/ui/use-toast"

interface VerificationDetailsPageClientProps {
  verificationId: number
}

export default function VerificationDetailsPageClient({ verificationId }: VerificationDetailsPageClientProps) {
  const router = useRouter()
  
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
                          <p className="text-sm text-muted-foreground">Governorate</p>
                          <p className="font-medium text-foreground">{verification.user?.location?.governorate || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Documents Section */}
                <div className="bg-background rounded-lg shadow-sm p-4 sm:p-6 border border-border">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Verification Documents</h2>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Document Type */}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Document Type</p>
                      <p className="font-medium text-foreground">{verification.document_type || 'N/A'}</p>
                    </div>
                    
                    {/* Document Images */}
                    <div className="space-y-2 sm:space-y-4">
                      <h3 className="text-base sm:text-lg font-medium text-foreground">Document Images</h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {verification.document_images && verification.document_images.length > 0 ? (
                          verification.document_images.map((image: string, index: number) => (
                            <div key={index} className="relative aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 shadow-md">
                              <Image
                                src={image}
                                alt={`Document ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                              <a 
                                href={image} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200"
                              >
                                <span className="text-transparent hover:text-white font-medium">View Full Size</span>
                              </a>
                            </div>
                          ))
                        ) : (
                          <p className="col-span-2 text-muted-foreground italic">No document images provided</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Verification Notes */}
                    <div className="pt-2 sm:pt-4">
                      <h3 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4">Verification Notes</h3>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add notes about this verification request..."
                        className="w-full min-h-[100px] p-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        disabled={isProcessed}
                      />
                    </div>
                    
                    {/* Action Buttons */}
                    {!isProcessed && (
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                        <Button 
                          onClick={handleApprove}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          disabled={submitting}
                        >
                          {submitting ? 'Processing...' : 'Approve Verification'}
                        </Button>
                        <Button 
                          onClick={handleDecline}
                          variant="destructive"
                          className="flex-1"
                          disabled={submitting}
                        >
                          {submitting ? 'Processing...' : 'Decline Verification'}
                        </Button>
                      </div>
                    )}
                    
                    {/* Status Information */}
                    {isProcessed && (
                      <div className={`p-4 rounded-md ${verification.status === 'approved' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        <p className="font-medium">
                          This verification request has been {verification.status === 'approved' ? 'approved' : 'declined'}.
                        </p>
                        {verification.admin_notes && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Notes:</p>
                            <p className="text-sm">{verification.admin_notes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}