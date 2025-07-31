'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the modal types
export type ModalType = 'signIn' | 'signUp' | 'forgotPassword' | 'verificationCode' | null

// Define the context type
type ModalContextType = {
  modalType: ModalType
  openModal: (type: ModalType) => void
  closeModal: () => void
}

// Create the context with default values
const ModalContext = createContext<ModalContextType>({
  modalType: null,
  openModal: () => {},
  closeModal: () => {}
})

// Create a provider component
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null)

  const openModal = (type: ModalType) => {
    // If there's already a modal open, close it first then open the new one
    if (modalType) {
      // For smooth transition between auth pages, we use a fade effect
      // First set a flag to indicate we're transitioning between modals
      const currentModal = modalType
      
      // Close current modal
      setModalType(null)
      
      // Wait for the fade-out transition to complete before opening new modal
      // Using 200ms which is slightly shorter than the duration-300 transition
      // This creates a smooth crossfade effect without explicit animations
      setTimeout(() => {
        setModalType(type)
      }, 200)
    } else {
      setModalType(type)
    }
  }

  const closeModal = () => {
    setModalType(null)
  }

  return (
    <ModalContext.Provider value={{ modalType, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

// Create a custom hook to use the context
export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}