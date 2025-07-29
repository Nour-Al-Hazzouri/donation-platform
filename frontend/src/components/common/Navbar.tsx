'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_ITEMS, COLORS } from '@/lib/constants'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div>
      {/* Mobile menu button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-expanded={isOpen}
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-16 inset-x-0 z-50 p-4 bg-white shadow-lg rounded-b-lg">
          <nav className="flex flex-col space-y-4">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? `text-[${COLORS.primary}] bg-gray-100`
                      : `text-[${COLORS.text.secondary}] hover:text-[${COLORS.text.primary}] hover:bg-gray-50`
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
              <Link
                href="/auth/login"
                className={`w-full text-center py-2 px-4 rounded-full bg-[${COLORS.primary}] text-white`}
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/auth/register"
                className={`w-full text-center py-2 px-4 rounded-full border border-[${COLORS.primary}] text-[${COLORS.primary}]`}
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}