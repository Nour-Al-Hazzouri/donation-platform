'use client'

import React, { createContext, useContext, useState, ReactNode, useRef } from 'react'

// Define the modal types
export type ModalType = 'signIn' | 'signUp' | 'forgotPassword' | 'verificationCode' | null

// Define the context type
type ModalContextType = {
  modalType: ModalType
  previousModalType: ModalType
  isTransitioning: boolean
  transitionDirection: 'in' | 'out' | null
  openModal: (type: ModalType) => void
  closeModal: () => void
}

// Create the context with default values
const ModalContext = createContext<ModalContextType>({
  modalType: null,
  previousModalType: null,
  isTransitioning: false,
  transitionDirection: null,
  openModal: () => {},
  closeModal: () => {}
})

// Create a provider component
export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalType, setModalType] = useState<ModalType>(null)
  const [previousModalType, setPreviousModalType] = useState<ModalType>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionDirection, setTransitionDirection] = useState<'in' | 'out' | null>(null)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openModal = (type: ModalType) => {
    // If there's already a modal open, transition between them
    if (modalType) {
      // Don't do anything if trying to open the same modal
      if (modalType === type) return
      
      // Clear any existing timeout
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
      
      // Start transition out
      setIsTransitioning(true)
      setTransitionDirection('out')
      setPreviousModalType(modalType)
      
      // After a short delay, change the modal type and transition in
      transitionTimeoutRef.current = setTimeout(() => {
        setModalType(type)
        setTransitionDirection('in')
        
        // Complete the transition
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false)
          setTransitionDirection(null)
        }, 300) // Match the duration-300 in the CSS
      }, 300) // Match the duration-300 in the CSS
    } else {
      // If no modal is open, simply open the new one with an in transition
      setModalType(type)
      setIsTransitioning(true)
      setTransitionDirection('in')
      
      // Complete the transition
      transitionTimeoutRef.current = setTimeout(() => {
        setIsTransitioning(false)
        setTransitionDirection(null)
      }, 300) // Match the duration-300 in the CSS
    }
  }

  const closeModal = () => {
    // Only start close transition if a modal is open and we're not already transitioning out
    if (modalType && transitionDirection !== 'out') {
      setIsTransitioning(true)
      setTransitionDirection('out')
      setPreviousModalType(modalType)
      
      // After transition completes, actually close the modal
      transitionTimeoutRef.current = setTimeout(() => {
        setModalType(null)
        setIsTransitioning(false)
        setTransitionDirection(null)
      }, 300) // Match the duration-300 in the CSS
    } else {
      // If no modal or already transitioning out, just close immediately
      setModalType(null)
      setIsTransitioning(false)
      setTransitionDirection(null)
    }
  }

  return (
    <ModalContext.Provider value={{
      modalType,
      previousModalType,
      isTransitioning,
      transitionDirection,
      openModal,
      closeModal
    }}>
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