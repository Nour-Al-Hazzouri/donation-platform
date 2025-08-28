'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import { useModal } from '@/contexts/ModalContext'
import { useAuthStore } from '@/store/authStore'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'


export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { openModal, closeModal } = useModal()
  const { login } = useAuthStore()
  const router = useRouter()

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // Reset password error
  setPasswordError('')
  
  if (!email || !password) {
    toast({
      title: "Login failed",
      description: "Please enter valid credentials",
      variant: "destructive",
    })
    return
  }
  
  // Check password length
  if (password.length < 8) {
    setPasswordError('Password must be at least 8 characters long')
    return
  }
  
  try {
    setIsLoading(true)
    // Use the login method from useAuthStore
    await login(email, password)
    
    closeModal()
    
    // Get the current user
    const user = useAuthStore.getState().user
    
    // Check if there's a redirect URL in localStorage
    const redirectUrl = localStorage.getItem('redirectAfterAuth')
    
    // If there is a redirect URL, navigate to it and remove it from localStorage
    if (redirectUrl) {
      localStorage.removeItem('redirectAfterAuth')
      router.push(redirectUrl)
    } else {
      // Redirect based on user role
      if (user?.isAdmin) {
        router.push('/admin/dashboard'); // go directly to dashboard
        toast({
          title: "Welcome, Administrator!",
          description: "You have been redirected to the admin dashboard.",
        });
      } else {
        router.push('/profile');
        toast({
          title: "Logged in successfully",
          description: `Welcome back, ${user?.first_name || 'User'}!`,
        });
      }
    }
    
    // Force a page refresh to ensure all components recognize the authentication state
    // This helps with components that might have already mounted with isAuthenticated=false
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  } catch (error: any) {
    toast({
      title: "Login failed",
      description: error.response?.data?.message || error.message || "An error occurred during login",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}
  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Google sign in attempt')
  }

  return (
    <div className="bg-background flex items-center justify-center px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      <div className="w-full max-w-md space-y-4 sm:space-y-6 transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="text-center space-y-1 sm:space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary transition-all duration-300 ease-in-out">Sign in</h1>
          <p className="text-muted-foreground text-base sm:text-lg transition-all duration-300 ease-in-out">Please log in into your account</p>
        </div>

        {/* Sign In Form */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  // Clear error when user types
                  if (passwordError) setPasswordError('')
                }}
                className="w-full h-10 sm:h-12 px-4 pr-12 bg-secondary/50 border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:bg-background focus:ring-2 focus:ring-primary focus:ring-offset-0 transition-all duration-300"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {passwordError && (
              <div className="text-red-500 text-sm mt-1">
                {passwordError}
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button 
              type="button"
              onClick={() => openModal('forgotPassword')}
              className="text-primary hover:text-primary/90 font-medium transition-all duration-300 ease-in-out hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            className="w-full h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-primary-foreground font-semibold rounded-lg transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-4 sm:mt-6">
          <span className="text-muted-foreground text-sm sm:text-base transition-all duration-300">Don't have an account? </span>
          <button 
            type="button"
            onClick={() => openModal('signUp')}
            className="text-primary hover:text-primary/90 font-medium transition-all duration-300 hover:underline"
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
            className="w-full h-10 sm:h-12 border-2 border-[#f90404] text-[#f90404] hover:bg-[#f90404] hover:text-primary-foreground font-medium rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2 sm:gap-3"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="fill-current">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" className="fill-[#f90404]"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="fill-[#f90404]"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="fill-[#f90404]"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="fill-[#f90404]"/>
            </svg>
            Sign in with Google
          </Button>
        </div>
      </div>
    </div>
  )
}