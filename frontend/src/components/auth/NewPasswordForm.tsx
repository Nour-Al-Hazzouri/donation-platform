"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { useModal } from "@/contexts/ModalContext"
import { useAuthStore } from "@/store/authStore"

interface NewPasswordFormProps {
  email: string;
  code: string;
}

export default function NewPasswordForm({ email, code }: NewPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { openModal, closeModal } = useModal()

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset error state
    setPasswordError('')
    
    // Validate passwords
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Call the resetPassword method from authStore
      await useAuthStore.getState().resetPassword({
        email,
        code,
        password,
        password_confirmation: confirmPassword
      })
      
      console.log('Password reset successful')
      
      // Show success modal
      openModal('passwordResetSuccess')
    } catch (error: any) {
      setPasswordError(error.message || 'Failed to reset password. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    // Go back to verification code
    openModal('verificationCode')
  }

  return (
    <div className="bg-background flex flex-col px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
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
      
      <div className="w-full max-w-md space-y-6">
        <div className="text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary leading-tight transition-all duration-300 ease-in-out">New Password</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground transition-all duration-300 ease-in-out">
            Set the new password for your account so you can login and access all features.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-base font-normal text-foreground">
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 sm:h-12 px-4 pr-12 bg-secondary/50 border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center pr-3 text-muted-foreground hover:text-primary hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="text-base font-normal text-foreground">
                Confirm Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirm-password"
                  name="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full h-10 sm:h-12 px-4 pr-12 bg-secondary/50 border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center pr-3 text-muted-foreground hover:text-primary hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
          {/* Error message */}
          {passwordError && (
            <div className="text-red-500 text-sm mt-2">
              {passwordError}
            </div>
          )}
          
          <div className="flex justify-start">
            <Button
            type="submit"
            className="w-full h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Setting New Password...' : 'Set New Password'}
          </Button>
          </div>
        </form>
      </div>
    </div>
  )
}