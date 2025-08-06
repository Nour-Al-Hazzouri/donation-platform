'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { useModal } from '@/lib/contexts/ModalContext'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { openModal } = useModal()

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle sign in logic here
    console.log('Sign in attempt:', { email, password })
  }

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Google sign in attempt')
  }

  return (
    <div className="bg-white flex items-center justify-center px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <div className="w-full max-w-md space-y-4 sm:space-y-6 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#f90404] transition-all duration-300 ease-in-out">Sign in</h1>
          <p className="text-[#5a5a5a] text-base sm:text-lg transition-all duration-300 ease-in-out">Please log in into your account</p>
        </div>

        {/* Sign In Form */}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 sm:h-12 px-4 pr-12 bg-[#f5f5f5] border-0 rounded-lg text-[#000000] placeholder:text-[#5a5a5a] focus:bg-white focus:ring-2 focus:ring-[#f90404] focus:ring-offset-0 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5a5a5a] hover:text-[#f90404] transition-colors duration-300 ease-in-out"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button 
              type="button"
              onClick={() => openModal('forgotPassword')}
              className="text-[#f90404] hover:text-[#d90404] font-medium transition-all duration-300 ease-in-out hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-all duration-300"
          >
            Sign in
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4 sm:mt-6">
          <span className="text-[#5a5a5a] text-sm sm:text-base transition-all duration-300">Don't have an account? </span>
          <button 
            type="button"
            onClick={() => openModal('signUp')}
            className="text-[#f90404] hover:text-[#d90404] font-medium transition-all duration-300 hover:underline"
          >
            Sign up
          </button>
        </div>

        {/* Google Sign In */}
        <div className="pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full h-10 sm:h-12 border-2 border-[#4285f4] text-[#4285f4] hover:bg-[#4285f4] hover:text-white font-medium rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 sm:gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}