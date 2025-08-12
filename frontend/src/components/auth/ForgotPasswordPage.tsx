'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from 'lucide-react'
import { useModal } from '@/contexts/ModalContext'
import VerificationCodePage from './VerificationCodePage'
import { toast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { openModal } = useModal()

  const handleBack = () => {
    openModal('signIn')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically make an API call to send the verification code
      // For demonstration, we'll simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Verification code sent to:', email)
      setShowVerification(true)
      toast({
        title: "Verification code sent",
        description: `We've sent a 6-digit code to ${email}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background flex flex-col px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      {!showVerification && (
        <>
          {/* Back Button */}
          <div className="pb-3 sm:pb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
              <span className="font-medium">Back</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-md space-y-4 sm:space-y-6 transition-all duration-300 ease-in-out">
              {/* Header */}
              <div className="space-y-3 sm:space-y-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-primary leading-tight transition-all duration-300 ease-in-out">
                  Forgot
                  <br />
                  password?
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed transition-all duration-300 ease-in-out">
                  Enter your email for the verification process,
                  <br />
                  we will send code to your email
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 sm:h-12 px-4 bg-secondary/50 border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300 ease-in-out"
                    required
                  />
                </div>

                {/* Continue Button */}
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-primary-foreground font-semibold rounded-lg transition-all duration-300 ease-in-out mt-6 sm:mt-8"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Continue"}
                </Button>
              </form>
            </div>
          </div>
        </>
      )}

      {showVerification && (
        <VerificationCodePage 
          userEmail={email} 
          onBack={() => setShowVerification(false)} 
          onSuccess={() => openModal('newPassword')}
        />
      )}
    </div>
  )
}