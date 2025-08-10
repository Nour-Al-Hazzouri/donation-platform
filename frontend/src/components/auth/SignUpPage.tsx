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

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { openModal, closeModal } = useModal()
  const { login } = useAuthStore()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phoneNumber: '',
    email: '',
    password: '',
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
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreeToTerms: checked
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName || !formData.username) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
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
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful registration
      const mockUser = {
        id: '123',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        verified: false
      }
      
      // Login the user
      login(mockUser)
      
      // Close the modal
      closeModal()
      
      // Show success toast
      toast({
        title: "Success",
        description: "Your account has been created successfully!",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white flex items-center justify-center px-4 py-4 sm:py-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <div className="w-full max-w-md space-y-2 sm:space-y-3 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="text-center space-y-0 sm:space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-bold text-[#f90404] transition-all duration-300 ease-in-out">Sign up</h1>
          <p className="text-[#5a5a5a] text-xs sm:text-sm transition-all duration-300 ease-in-out">Please create a new account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
          {/* First Name Field */}
          <div className="space-y-1">
            <Label htmlFor="firstName" className="text-[#000000] font-medium text-sm">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Last Name Field */}
          <div className="space-y-1">
            <Label htmlFor="lastName" className="text-[#000000] font-medium text-sm">
              Last Name
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Username Field */}
          <div className="space-y-1">
            <Label htmlFor="username" className="text-[#000000] font-medium text-sm">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-1">
            <Label htmlFor="phoneNumber" className="text-[#000000] font-medium text-sm">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-[#000000] font-medium text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-8 sm:h-9 px-3 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <Label htmlFor="password" className="text-[#000000] font-medium text-sm">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-8 sm:h-9 px-3 pr-10 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#4285f4] hover:text-[#3367d6] transition-all duration-300"
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
              className="border-[#4285f4] data-[state=checked]:bg-[#4285f4]"
            />
            <Label 
              htmlFor="terms" 
              className="text-[#5a5a5a] text-[10px] sm:text-xs cursor-pointer leading-tight transition-all duration-300"
            >
              Agree the terms of use and privacy policy
            </Label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms || isLoading}
            className="w-full h-8 sm:h-9 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-0.5"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-1 sm:mt-2">
          <span className="text-[#5a5a5a] text-[10px] sm:text-xs transition-all duration-300">Already have an account? </span>
          <button 
            type="button"
            onClick={() => openModal('signIn')}
            className="text-[#f90404] hover:text-[#d90404] font-medium text-[10px] sm:text-xs transition-all duration-300 hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}