"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Upload } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useModal } from "@/lib/contexts/ModalContext"

export default function AccVerification() {
  const { user, updateVerification } = useAuthStore()
  const { closeModal } = useModal()
  const [idImage, setIdImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSuccess, setVerificationSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!idImage) return
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateVerification(true, new Date().toISOString())
      setVerificationSuccess(true)
      setTimeout(() => closeModal(), 2000)
    } catch (error) {
      console.error("Verification failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={closeModal}
      />
      
      {/* Modal container */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-[#5a5a5a] mb-6">Verify Your Identity</h2>
          
          {verificationSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-green-600 mb-2">Documents Submitted</h3>
              <p className="text-gray-600">
                Your identity documents have been received. We'll notify you once verification is complete.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[#5a5a5a] text-sm">Upload Government ID</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {idImage ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                        <p className="text-sm text-gray-700">{idImage.name}</p>
                        <button
                          type="button"
                          onClick={() => setIdImage(null)}
                          className="mt-2 text-sm text-[#f90404] hover:underline"
                        >
                          Change file
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            Click to upload your ID document
                          </p>
                          <p className="text-xs text-gray-500">
                            Accepted: JPG, PNG, PDF (max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/jpeg,image/png,application/pdf"
                          required
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    className="text-[#5a5a5a] border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={!idImage || isSubmitting}
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