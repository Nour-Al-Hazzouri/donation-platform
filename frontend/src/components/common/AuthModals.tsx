'use client'

import { useModal, type ModalType } from '@/lib/contexts/ModalContext'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import SignInPage from '@/components/auth/SignInPage'
import SignUpPage from '@/components/auth/SignUpPage'
import ForgotPasswordPage from '@/components/auth/ForgotPasswordPage'
import VerificationCodePage from '@/components/auth/VerificationCodePage'

export function AuthModals() {
  const { modalType, closeModal } = useModal()

  return (
    <>
      {/* Sign In Modal */}
      <Dialog open={modalType === 'signIn'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Sign In</DialogTitle>
          <DialogDescription className="sr-only">
            Sign in to your account
          </DialogDescription>
          <div className="animate-in fade-in-0 zoom-in-95 duration-300 relative z-50 isolate">
            <SignInPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={modalType === 'signUp'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Sign Up</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new account
          </DialogDescription>
          <div className="animate-in fade-in-0 zoom-in-95 duration-300 relative z-50 isolate">
            <SignUpPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Forgot Password Modal */}
      <Dialog open={modalType === 'forgotPassword'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Forgot Password</DialogTitle>
          <DialogDescription className="sr-only">
            Reset your password
          </DialogDescription>
          <div className="animate-in fade-in-0 zoom-in-95 duration-300 relative z-50 isolate">
            <ForgotPasswordPage />
          </div>
        </DialogContent>
      </Dialog>

      {/* Verification Code Modal */}
      <Dialog open={modalType === 'verificationCode'} onOpenChange={(open) => !open && closeModal()} defaultOpen={false}>
        <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Verification Code</DialogTitle>
          <DialogDescription className="sr-only">
            Enter your verification code
          </DialogDescription>
          <div className="animate-in fade-in-0 zoom-in-95 duration-300 relative z-50 isolate">
            <VerificationCodePage />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}