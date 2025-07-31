'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from 'lucide-react'
import { useModal } from '@/lib/contexts/ModalContext'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const { openModal } = useModal()

  const handleBack = () => {
    // Navigate back to sign-in
    openModal('signIn')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle forgot password logic here
    console.log('Forgot password request for:', email)
  }

  return (
    <div className="bg-white flex flex-col px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      {/* Back Button */}
      <div className="pb-3 sm:pb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#5a5a5a] hover:text-[#000000] transition-all duration-300 ease-in-out"
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
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f90404] leading-tight transition-all duration-300 ease-in-out">
              Forgot
              <br />
              password?
            </h1>
            <p className="text-[#5a5a5a] text-sm sm:text-base leading-relaxed transition-all duration-300 ease-in-out">
              Enter your email for the verification process,
              <br />
              we will send code to your email
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#000000] font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 sm:h-12 px-4 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300 ease-in-out"
                required
              />
            </div>

            {/* Continue Button */}
            <Button
              type="submit"
              className="w-full h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-all duration-300 ease-in-out mt-6 sm:mt-8"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}