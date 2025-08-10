"use client"

import { ModeToggle } from "./ModeToggle"

interface ThemeToggleProviderProps {
  className?: string
}

/**
 * A universal component for providing theme toggle functionality across the application.
 * This component can be easily integrated into any header or navigation component.
 */
export function ThemeToggleProvider({ className = "" }: ThemeToggleProviderProps) {
  return (
    <div className={className}>
      <ModeToggle />
    </div>
  )
}