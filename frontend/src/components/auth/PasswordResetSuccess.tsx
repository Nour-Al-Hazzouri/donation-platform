import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useModal } from "@/contexts/ModalContext"

export default function PasswordResetSuccess() {
  const { openModal, closeModal } = useModal()

  const handleContinue = () => {
    // Close current modal and open sign in modal
    openModal('signIn')
  }

  return (
    <div className="bg-background flex flex-col items-center justify-center px-4 py-6 sm:py-8 rounded-lg shadow-lg transition-all duration-300 ease-in-out text-center">
      <div className="space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-24 w-24 text-primary stroke-1" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground transition-all duration-300 ease-in-out">Successfully</h1>
        <p className="text-sm sm:text-base text-muted-foreground transition-all duration-300 ease-in-out">
          Your password has been reset successfully
        </p>
        <div>
          <Button
            type="button"
            onClick={handleContinue}
            className="w-full max-w-xs h-10 sm:h-12 bg-[#f90404] hover:bg-[#d90404] text-white font-semibold rounded-lg transition-all duration-300"
          >
            CONTINUE
          </Button>
        </div>
      </div>
    </div>
  )
}