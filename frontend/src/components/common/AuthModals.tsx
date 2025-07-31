'use client'

import { useModal, type ModalType } from '@/lib/contexts/ModalContext'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import SignInPage from '@/components/auth/SignInPage'
import SignUpPage from '@/components/auth/SignUpPage'
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage'
import VerificationCodePage from '@/components/auth/VerificationCodePage'
import { useEffect, useState } from 'react'

export function AuthModals() {
  const { modalType, closeModal } = useModal()
  const [modalSize, setModalSize] = useState('md')
  
  // Update modal size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setModalSize('sm')
      } else if (window.innerWidth < 1024) {
        setModalSize('md')
      } else {
        setModalSize('lg')
      }
    }
    
    // Set initial size
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <>
      {/* Sign In Modal */}
      <Dialog open={modalType === 'signIn'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Sign In</DialogTitle>
          <DialogDescription className="sr-only">
            Sign in to your account
          </DialogDescription>
          <div className="relative z-50 isolate transition-opacity duration-300">
            <SignInPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={modalType === 'signUp'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new account
          </DialogDescription>
          <div className="relative z-50 isolate transition-opacity duration-300">
            <SignUpPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={modalType === 'forgotPassword'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Forgot Password</DialogTitle>
          <DialogDescription className="sr-only">
            Reset your password
          </DialogDescription>
          <div className="relative z-50 isolate transition-opacity duration-300">
            <ForgotPasswordPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Code Modal */}
      <Dialog open={modalType === 'verificationCode'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Verification Code</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your verification code
          </DialogDescription>
          <div className="relative z-50 isolate transition-opacity duration-300">
            <VerificationCodePage />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}