'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from 'lucide-react'
import { useModal } from '@/contexts/ModalContext'
import { useAuthStore } from '@/store/authStore'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const { openModal, closeModal } = useModal()
  const { login } = useAuthStore()
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    agreeToTerms: false
  })

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear password error when user types in password fields
    if ((field === 'password' || field === 'password_confirmation') && passwordError) {
      setPasswordError('')
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset password error
    setPasswordError('')
    
    // Validate form data
    if (!formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }
    
    // Check password length
    if (formData.password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }
    
    if (formData.password !== formData.password_confirmation) {
      setPasswordError('Passwords do not match')
      return
    }
    
    if (!formData.agreeToTerms) {
      toast({
        title: "Error",
        description: "You must agree to the terms and privacy policy",
        variant: "destructive",
      })
      return
    }
    
    setIsLoading(true)
    
    try {
      // Use the authStore register method which will call the API through our service
      await useAuthStore.getState().register({
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      })
      
      // The login is handled inside the register function in authStore
      
      // Close the modal
      closeModal()
      
      // Check if there's a redirect URL in localStorage
      const redirectUrl = localStorage.getItem('redirectAfterAuth')
      
      // If there is a redirect URL, navigate to it and remove it from localStorage
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterAuth')
        router.push(redirectUrl)
      }
      
      // Show success toast
      toast({
        title: "Success",
        description: "Your account has been created successfully!",
      })
    } catch (error: any) {
      // Show error toast
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-background flex items-center justify-center px-4 py-4 sm:py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <div className="w-full max-w-md space-y-2 sm:space-y-3 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="text-center space-y-0 sm:space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-primary transition-all duration-300 ease-in-out">Sign up</h1>
          <p className="text-muted-foreground text-xs sm:text-sm transition-all duration-300 ease-in-out">Please create a new account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          {/* First Name Field */}
          <div className="space-y-1">
            <Label htmlFor="first_name" className="text-foreground font-medium text-sm">
              First Name
            </Label>
            <Input
              id="first_name"
              type="text"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Last Name Field */}
          <div className="space-y-1">
            <Label htmlFor="last_name" className="text-foreground font-medium text-sm">
              Last Name
            </Label>
            <Input
              id="last_name"
              type="text"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Username Field */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-foreground font-medium text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-foreground font-medium text-sm">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-foreground font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-foreground font-medium text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-8 sm:h-9 px-3 pr-10 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary/80 hover:text-primary transition-all duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">
                {passwordError}
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password_confirmation" className="text-foreground font-medium text-sm">
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password_confirmation}
                onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                className="w-full h-8 sm:h-9 px-3 pr-10 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary/80 hover:text-primary transition-all duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="flex items-center space-x-2 pt-0.5">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              className="border-[#f90404] data-[state=checked]:bg-[#f90404]"
            />
            <Label 
              htmlFor="terms" 
              className="text-muted-foreground text-[10px] sm:text-xs cursor-pointer leading-tight transition-all duration-300"
            >
              Agree the terms of use and privacy policy
            </Label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || isLoading}
            className="w-full h-8 sm:h-9 bg-[#f90404] hover:bg-[#d90404] text-primary-foreground font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-1 sm:mt-2">
          <span className="text-muted-foreground text-[10px] sm:text-xs transition-all duration-300">Already have an account? </span>
          <button 
            type="button"
            onClick={() => openModal('signIn')}
            className="text-primary hover:text-primary/90 font-medium text-[10px] sm:text-xs transition-all duration-300 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}