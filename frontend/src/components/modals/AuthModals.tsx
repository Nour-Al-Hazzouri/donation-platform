'use client'

import { useModal, type ModalType } from '@/contexts/ModalContext'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import SignInPage from '@/components/auth/SignInPage'
import SignUpPage from '@/components/auth/SignUpPage'
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage'
import VerificationCodePage from '@/components/auth/VerificationCodePage'
import NewPasswordForm from '@/components/auth/NewPasswordForm'
import PasswordResetSuccess from '@/components/auth/PasswordResetSuccess'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function AuthModals() {
  const { modalType, previousModalType, isTransitioning, transitionDirection, closeModal, modalParams } = useModal()
  const [modalSize, setModalSize] = useState('md')
  
  // Determine if a modal should be shown (either current or previous during transition)
  const shouldShowModal = (type: ModalType) => {
    if (type === null) return false
    return modalType === type || (isTransitioning && previousModalType === type)
  }
  
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
      <Dialog open={shouldShowModal('signIn')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Sign In</DialogTitle>
          <DialogDescription className="sr-only">
            Sign in to your account
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'signIn' && (
              <motion.div
                key="signIn"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <SignInPage />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={shouldShowModal('signUp')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new account
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'signUp' && (
              <motion.div
                key="signUp"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <SignUpPage />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={shouldShowModal('forgotPassword')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Forgot Password</DialogTitle>
          <DialogDescription className="sr-only">
            Reset your password
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'forgotPassword' && (
              <motion.div
                key="forgotPassword"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <ForgotPasswordPage />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Verification Code Modal */}
      <Dialog open={shouldShowModal('verificationCode')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Verification Code</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your verification code
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'verificationCode' && (
              <motion.div
                key="verificationCode"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <VerificationCodePage />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
      {/* New Password Modal */}
      <Dialog open={shouldShowModal('newPassword')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">New Password</DialogTitle>
          <DialogDescription className="sr-only">
            Set your new password
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'newPassword' && (
              <motion.div
                key="newPassword"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <NewPasswordForm email={modalParams.email} code={modalParams.code} />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Password Reset Success Modal */}
      <Dialog open={shouldShowModal('passwordResetSuccess')} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className={`p-0 border-none bg-transparent shadow-none transition-all duration-300 ${modalSize === 'sm' ? 'max-w-[90%]' : modalSize === 'md' ? 'max-w-md' : 'max-w-lg'}`}>
          <DialogTitle className="sr-only">Password Reset Success</DialogTitle>
          <DialogDescription className="sr-only">
            Your password has been reset successfully
          </DialogDescription>
          <AnimatePresence mode="wait">
            {modalType === 'passwordResetSuccess' && (
              <motion.div
                key="passwordResetSuccess"
                initial={transitionDirection === 'in' ? { opacity: 0, y: 10, scale: 0.98 } : {}}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative z-50 isolate"
              >
                <PasswordResetSuccess />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AuthModals