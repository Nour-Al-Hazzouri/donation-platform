"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Upload, AlertCircle, X, Plus } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useModal } from "@/contexts/ModalContext"
import { verificationService } from "@/lib/api"

export default function AccVerification() {
  const { user, updateVerification } = useAuthStore()
  const { closeModal } = useModal()
  const [documentImages, setDocumentImages] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)
  const [documentType, setDocumentType] = useState<'id_card' | 'passport' | 'driver_license'>('id_card')
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      // Limit to 7 files total as per API documentation
      const updatedFiles = [...documentImages, ...newFiles].slice(0, 7);
      setDocumentImages(updatedFiles);
    }
  }
  
  const removeFile = (index: number) => {
    setDocumentImages(documentImages.filter((_, i) => i !== index));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (documentImages.length === 0) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await verificationService.submitVerification({
        document_type: documentType,
        documents: documentImages
      })
      
      // Do not update verification status - it will remain pending until admin approval
      setVerificationSuccess(true)
      setTimeout(() => closeModal(), 2000)
    } catch (error: any) {
      console.error("Verification failed:", error)
      setError(error?.response?.data?.message || 'Failed to submit verification. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
      {/* Blurred backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={closeModal}
      />
      
      {/* Modal container */}
      <div className="relative bg-card dark:bg-card rounded-lg shadow-xl w-full max-w-md mx-4 my-8 overflow-hidden min-h-min">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Verify Your Identity</h2>
          
          {verificationSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-green-600 mb-2">Documents Submitted</h3>
              <p className="text-gray-600">
                Your identity documents have been received and are pending admin approval. We'll notify you once verification is complete.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground text-sm">Document Type</Label>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Button 
                      type="button"
                      variant={documentType === 'id_card' ? 'default' : 'outline'}
                      className={documentType === 'id_card' ? 'bg-[#f90404] hover:bg-[#d90404] text-white' : 'text-foreground'}
                      onClick={() => setDocumentType('id_card')}
                    >
                      ID Card
                    </Button>
                    <Button 
                      type="button"
                      variant={documentType === 'passport' ? 'default' : 'outline'}
                      className={documentType === 'passport' ? 'bg-[#f90404] hover:bg-[#d90404] text-white' : 'text-foreground'}
                      onClick={() => setDocumentType('passport')}
                    >
                      Passport
                    </Button>
                    <Button 
                      type="button"
                      variant={documentType === 'driver_license' ? 'default' : 'outline'}
                      className={documentType === 'driver_license' ? 'bg-[#f90404] hover:bg-[#d90404] text-white' : 'text-foreground'}
                      onClick={() => setDocumentType('driver_license')}
                    >
                      Driver's License
                    </Button>
                  </div>
                  
                  <Label className="text-foreground text-sm">Upload Documents</Label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-muted rounded-lg p-6 dark:bg-muted/20">
                    {documentImages.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-sm font-medium text-gray-700 dark:text-foreground mb-2">Uploaded Documents ({documentImages.length}/7):</p>
                        <div className="space-y-2">
                          {documentImages.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-muted p-2 rounded-md">
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <p className="text-sm text-gray-700 dark:text-foreground truncate max-w-[200px]">{file.name}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {documentImages.length < 7 && (
                      <label className="cursor-pointer block text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-foreground">
                            Click to upload your ID documents
                          </p>
                          <p className="text-xs text-gray-500 dark:text-muted-foreground">
                            Accepted: JPG, PNG, PDF (max. 10MB per file)
                          </p>
                          <p className="text-xs text-gray-500 dark:text-muted-foreground">
                            You can upload up to 7 documents
                          </p>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/jpeg,image/png,application/pdf"
                          multiple
                        />
                      </label>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="text-foreground border-border hover:bg-muted dark:hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={documentImages.length === 0 || isSubmitting}
                    className="bg-[#f90404] hover:bg-[#d90404] text-white"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Documents"}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}