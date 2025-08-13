'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft } from 'lucide-react'
import { useModal } from '@/contexts/ModalContext'
import { toast } from "@/components/ui/use-toast"

interface VerificationCodePageProps {
  onBack?: () => void;
  onSuccess?: (code: string) => void;
  userEmail?: string;
}

export default function VerificationCodePage({ onBack, onSuccess, userEmail }: VerificationCodePageProps) {
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1 || !/^\d*$/.test(value)) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newCode = [...code]
    
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      newCode[i] = pastedData[i]
    }
    
    setCode(newCode)
    
    const nextEmptyIndex = newCode.findIndex(digit => digit === '')
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleConfirm = async () => {
    const verificationCode = code.join('')
    
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter a 6-digit code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    
    try {
      // We don't actually verify the code here - we'll do that in the reset password step
      // This is just to check if the code format is valid
      console.log('Code entered:', verificationCode)
      toast({
        title: "Code accepted",
        description: "You can now set a new password",
      })
      
      if (onSuccess) {
        onSuccess(verificationCode)
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message || "The code you entered is incorrect. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (onBack) {
      onBack()
    }
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <div className="bg-background rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-md transition-all duration-300 ease-in-out">
      {onBack && (
        <div className="pb-3 sm:pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 ease-in-out"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
            <span className="font-medium">Back</span>
          </button>
        </div>
      )}
      
      <div className="text-center space-y-3 sm:space-y-4 mb-6 sm:mb-8 transition-all duration-300 ease-in-out">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground transition-all duration-300 ease-in-out">Enter 6 digit code</h1>
        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed transition-all duration-300 ease-in-out">
          A six-digit code has been sent to{userEmail ? ` ${userEmail}` : ' your email address'}.
        </p>
      </div>

      <div className="flex justify-center gap-1 sm:gap-1.5 md:gap-2 mb-6 sm:mb-8 transition-all duration-300 ease-in-out">
        {code.map((digit, index) => (
          <Input
            key={index}
            ref={el => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-8 sm:w-10 md:w-11 lg:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-semibold bg-secondary/50 border-0 rounded-lg focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300 ease-in-out"
            aria-label={`Digit ${index + 1}`}
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="flex gap-3 sm:gap-4 transition-all duration-300 ease-in-out">
        <Button
          onClick={handleConfirm}
          disabled={!isCodeComplete || isLoading}
          className="flex-1 h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-primary-foreground font-semibold rounded-lg transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Verifying..." : "Confirm"}
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 h-10 sm:h-12 bg-background border-2 border-[#f90404] text-[#f90404] hover:bg-[#f90404]/10 font-semibold rounded-lg transition-all duration-300 ease-in-out"
          disabled={isLoading}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}