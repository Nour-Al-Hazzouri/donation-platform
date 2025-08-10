'use client'

import { useState } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS, COLORS } from "@/lib/constants"
import { usePathname } from "next/navigation"
import { Menu, X, User, LogOut } from 'lucide-react'
import Image from "next/image"
import { useModal } from '@/contexts/ModalContext'
import { useAuthStore } from '@/store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./ModeToggle"
import { useTheme } from "next-themes"

export function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openModal } = useModal()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme } = useTheme()
  
  // Check if the current user is an admin
  const isAdmin = user?.email === 'admin@gmail.com'

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const renderNavLink = (item: typeof NAV_ITEMS[0], isMobile = false) => {
    const isActive = pathname === item.href
    const mobileClasses = `px-3 py-2 rounded-md text-base font-medium ${
      isActive 
        ? `text-red-500 bg-secondary` 
        : `text-muted-foreground hover:text-red-500 hover:bg-secondary/50`
    }`
    
    const desktopClasses = `${
      isActive 
        ? `text-red-500 font-medium border-b-2 border-red-500 pb-1` 
        : `text-muted-foreground hover:text-red-500`
    } text-sm lg:text-base whitespace-nowrap`

    return (
      <Link
        key={item.name}
        href={item.href}
        className={isMobile ? mobileClasses : desktopClasses}
        onClick={closeMobileMenu}
        style={isActive && !isMobile ? { borderBottomColor: '#ef4444' } : {}}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <>
      <header className="w-full px-4 md:px-6 py-4 shadow-sm sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <div className="w-40 h-10 relative">
              <Image 
                src={theme === "dark" ? "/logo-dark-removebg-preview.png" : "/logo.png"} 
                alt="GiveLeb Logo" 
                fill
                sizes="(max-width: 768px) 160px, 200px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {NAV_ITEMS.map((item, index) => {
              if (index >= 4 && index < NAV_ITEMS.length - 1) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`hidden lg:inline-block ${
                      pathname === item.href 
                        ? `text-red-500 font-medium border-b-2 border-red-500 pb-1` 
                        : `text-muted-foreground hover:text-red-500`
                    } text-sm lg:text-base whitespace-nowrap`}
                    style={pathname === item.href ? { borderBottomColor: '#ef4444' } : {}}
                  >
                    {item.name}
                  </Link>
                )
              }
              return renderNavLink(item)
            })}
          </nav>

          {/* Desktop Auth Buttons or Profile */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <ModeToggle />
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-red-500 border-red-500 text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base flex items-center gap-2"
                  >
                    <User size={16} />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin" : "/profile"} className="flex items-center gap-2 cursor-pointer">
                      <User size={16} />
                      <span>{isAdmin ? "Dashboard" : "Profile"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logout()} className="flex items-center gap-2 cursor-pointer">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="bg-red-500 border-red-500 text-white hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base"
                  onClick={() => openModal('signIn')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base"
                  onClick={() => openModal('signUp')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-30 bg-background overflow-y-auto">
          <div className="p-4">
            <nav className="flex flex-col space-y-4">
              {NAV_ITEMS.map(item => renderNavLink(item, true))}
              
              <div className="pt-4 border-t border-border flex flex-col space-y-3">
                <div className="flex justify-center mb-3">
                  <ModeToggle />
                </div>
                {isAuthenticated && user ? (
                  <>
                    <Link href={isAdmin ? "/admin" : "/profile"}>
                      <Button
                        className="bg-red-500 text-white w-full text-center py-2 px-4 rounded-full flex items-center justify-center gap-2 hover:bg-red-600"
                        onClick={closeMobileMenu}
                      >
                        <User size={16} />
                        {isAdmin ? "Dashboard" : "Profile"}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 w-full text-center py-2 px-4 rounded-full border flex items-center justify-center gap-2 hover:border-red-600 hover:text-red-600"
                      onClick={() => {
                        closeMobileMenu()
                        logout()
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="bg-red-500 text-white w-full text-center py-2 px-4 rounded-full hover:bg-red-600"
                      onClick={() => {
                        closeMobileMenu()
                        openModal('signIn')
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 w-full text-center py-2 px-4 rounded-full border hover:border-red-600 hover:text-red-600"
                      onClick={() => {
                        closeMobileMenu()
                        openModal('signUp')
                      }}
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}