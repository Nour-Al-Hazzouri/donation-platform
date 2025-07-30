'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from 'lucide-react'
import { useModal } from '@/lib/contexts/ModalContext'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { openModal } = useModal()
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: '',
    agreeToTerms: false // Changed from true to false
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign up logic here
    console.log('Sign up attempt:', formData)
  }

  return (
    <div className="bg-white flex items-center justify-center px-4 py-8 rounded-lg shadow-lg">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#f90404]">Sign up</h1>
          <p className="text-[#5a5a5a] text-lg">Please create a new account</p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#000000] font-medium">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full h-12 px-4 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0"
              required
            />
          </div>

          {/* Phone Number Field */}
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-[#000000] font-medium">
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              className="w-full h-12 px-4 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#000000] font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full h-12 px-4 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[#000000] font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full h-12 px-4 pr-12 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4285f4] hover:text-[#3367d6] transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Terms and Privacy Checkbox */}
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={handleCheckboxChange}
              className="w-5 h-5 border-2 border-[#4285f4] data-[state=checked]:bg-[#4285f4] data-[state=checked]:border-[#4285f4] rounded-sm"
            />
            <Label 
              htmlFor="terms" 
              className="text-[#5a5a5a] text-sm cursor-pointer leading-relaxed"
            >
              Agree the terms of use and privacy policy
            </Label>
          </div>

          {/* Sign Up Button */}
          <Button
            type="submit"
            disabled={!formData.agreeToTerms}
            className="w-full h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign up
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <span className="text-[#5a5a5a]">Already have an account? </span>
          <button 
            type="button"
            onClick={() => openModal('signIn')}
            className="text-[#f90404] hover:text-[#d90404] font-medium transition-colors"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}