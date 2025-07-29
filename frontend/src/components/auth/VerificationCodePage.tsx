'use client'

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useModal } from '@/lib/contexts/ModalContext'

export default function VerificationCodePage() {
  const [code, setCode] = useState(['', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { closeModal } = useModal()

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return
    
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous input
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 4)
    const newCode = [...code]
    
    for (let i = 0; i < pastedData.length && i < 4; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i]
      }
    }
    
    setCode(newCode)
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newCode.findIndex(digit => digit === '')
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleConfirm = () => {
    const verificationCode = code.join('')
    if (verificationCode.length === 4) {
      // Handle verification logic here
      console.log('Verification code:', verificationCode)
    }
  }

  const handleCancel = () => {
    // Close the modal
    closeModal()
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
      {/* Header */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl font-bold text-[#000000]">Enter 4 digit code</h1>
        <p className="text-[#5a5a5a] text-sm leading-relaxed">
          A four-digit code should have come to your email address that you indicated.
        </p>
      </div>

      {/* Code Input Fields */}
      <div className="flex justify-center gap-4 mb-8">
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
            className="w-16 h-20 text-center text-2xl font-semibold bg-[#f5f5f5] border-0 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleConfirm}
          disabled={!isCodeComplete}
          className="flex-1 h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </Button>
        <Button
          onClick={handleCancel}
          variant="outline"
          className="flex-1 h-12 bg-white border-2 border-[#000000] text-[#000000] hover:bg-gray-50 font-semibold rounded-lg transition-colors"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}