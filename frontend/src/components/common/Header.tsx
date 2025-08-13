"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS, COLORS } from "@/utils/constants"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Menu, X, User, LogOut, Bell, LayoutDashboard, FileText, Users, MapPin } from 'lucide-react'
import Image from "next/image"
import { useModal } from '@/contexts/ModalContext'
import { useAuthStore } from '@/store/authStore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./ModeToggle"
import { useTheme } from "next-themes"
import { cn } from "@/utils"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { openModal } = useModal()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  
  const isAdmin = user?.email === 'admin@gmail.com'

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)
  
  const handleProfileNavigation = () => {
    closeMobileMenu()
    router.push('/profile?view=profile')
  }
  
  const handleNotificationsNavigation = () => {
    closeMobileMenu()
    router.push('/profile?view=notifications')
  }
  
  const handleLogout = () => {
    closeMobileMenu()
    logout()
    router.push('/')
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const renderNavLink = (item: typeof NAV_ITEMS[0], isMobile = false) => {
    const isActive = pathname === item.href
    const mobileClasses = cn(
      "px-3 py-2 rounded-md text-base font-medium",
      isActive 
        ? "text-red-500 bg-accent" 
        : "text-muted-foreground hover:text-red-500 hover:bg-accent/50"
    )
    
    const desktopClasses = cn(
      "text-sm lg:text-base whitespace-nowrap",
      isActive 
        ? "text-red-500 font-medium border-b-2 border-red-500 pb-1" 
        : "text-muted-foreground hover:text-red-500 hover:border-b-2 hover:border-red-500 hover:pb-1 transition-all duration-200"
    )

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault()
      closeMobileMenu()
      if (pathname === item.href) {
        scrollToTop()
      } else {
        router.push(item.href)
      }
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={isMobile ? mobileClasses : desktopClasses}
        onClick={handleClick}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <>
      <header className="w-full px-4 md:px-6 py-2 shadow-sm sticky top-0 bg-background z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                scrollToTop()
              }
            }}
          >
            <div className="w-60 h-15 relative">
              <Image 
                src="/logoooo-removebg-preview.png" 
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
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
                    className={cn(
                      "hidden lg:inline-block text-sm lg:text-base whitespace-nowrap",
                      pathname === item.href 
                        ? "text-red-500 font-medium border-b-2 border-red-500 pb-1" 
                        : "text-muted-foreground hover:text-red-500 hover:border-b-2 hover:border-red-500 hover:pb-1 transition-all duration-200"
                    )}
                    onClick={(e) => {
                      if (pathname === item.href) {
                        e.preventDefault()
                        scrollToTop()
                      }
                    }}
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
                    variant="default"
                    style={{
                      backgroundColor: COLORS.primary,
                      color: "#fff",
                    }}
                    className="hover:bg-[#d90404] transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base flex items-center gap-2"
                  >
                    <User size={16} />
                    <span>{user.first_name} {user.last_name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-background">
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin" : "/profile?view=profile"} className="flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground">
                      <User size={16} />
                      <span>{isAdmin ? "Dashboard" : "Profile"}</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => logout()} 
                    className="flex items-center gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base"
                  onClick={() => openModal('signIn')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="default"
                  style={{
                    backgroundColor: COLORS.primary,
                    color: "#fff",
                  }}
                  className="hover:bg-[#d90404] transition-colors duration-200 rounded-full px-3 lg:px-6 text-sm lg:text-base"
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
                    {/* User info section for mobile */}
                    <div className="flex flex-col items-center space-y-3 p-4 mb-4 bg-secondary/20 rounded-lg">
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={(user.avatar_url || user.avatar_url_full) ?? undefined} alt={`${user.first_name} ${user.last_name}`} />
                          <AvatarFallback className="bg-primary">
                            <User size={32} className="text-primary-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        {user?.email_verified_at && (
                          <img
                            src={theme === 'dark' ? "/verification-dark.png" : "/verification.png"}
                            alt="Verified"
                            className="absolute top-1 right-1 w-4 h-4"
                          />
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-semibold text-foreground">{user.first_name} {user.last_name}</span>
                      </div>
                    </div>
                    
                    {/* Profile sidebar menu items for mobile */}
                    <div className="space-y-3 mb-4">
                      {isAdmin ? (
                        <>
                          <h3 className="text-primary font-medium text-sm px-2">Admin Dashboard</h3>
                          <div className="space-y-2">
                            <Link href="/admin" onClick={closeMobileMenu} className="flex items-center gap-2 text-foreground hover:text-red-500 py-2">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Dashboard</span>
                            </Link>
                            <Link href="/admin/blogs" onClick={closeMobileMenu} className="flex items-center gap-2 text-foreground hover:text-red-500 py-2">
                              <FileText className="h-4 w-4" />
                              <span>Manage Blogs</span>
                            </Link>
                            <Link href="/admin/locations" onClick={closeMobileMenu} className="flex items-center gap-2 text-foreground hover:text-red-500 py-2">
                              <MapPin className="h-4 w-4" />
                              <span>Manage Locations</span>
                            </Link>
                            <Link href="/admin/users" onClick={closeMobileMenu} className="flex items-center gap-2 text-foreground hover:text-red-500 py-2">
                              <Users className="h-4 w-4" />
                              <span>All Users</span>
                            </Link>
                            <Link href="/admin/users?tab=verification" onClick={closeMobileMenu} className="flex items-center gap-2 text-foreground hover:text-red-500 py-2 pl-6">
                              <FileText className="h-4 w-4" />
                              <span>Verification Requests</span>
                            </Link>
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-primary font-medium text-sm px-2">Profile Menu</h3>
                          
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full text-center py-2 px-4 rounded-md flex items-center justify-start gap-2",
                              pathname === '/profile' && (!searchParams || searchParams.get('view') === 'profile')
                                ? `bg-[${COLORS.primary}] text-white hover:bg-[#d90404]`
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                            onClick={handleProfileNavigation}
                          >
                            <User size={16} />
                            Profile
                          </Button>
                          
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full text-center py-2 px-4 rounded-md flex items-center justify-start gap-2",
                              searchParams && searchParams.get('view') === 'notifications'
                                ? `bg-[${COLORS.primary}] text-white hover:bg-[#d90404]`
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                            )}
                            onClick={handleNotificationsNavigation}
                          >
                            <Bell size={16} />
                            Notifications
                          </Button>
                        </>
                      )}
                      
                      {isAdmin && (
                        <Link href="/admin/dashboard" onClick={closeMobileMenu} className="block mb-3">
                          <Button
                            className="w-full text-center py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600"
                          >
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      
                      <Button
                        variant="ghost"
                        className="w-full text-center py-2 px-4 rounded-md flex items-center justify-start gap-2 hover:bg-accent hover:text-accent-foreground"
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        Log out
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="default"
                      style={{
                        backgroundColor: COLORS.primary,
                        color: "#fff",
                      }}
                      className="w-full text-center py-2 px-4 rounded-full hover:bg-[#d90404]"
                      onClick={() => {
                        closeMobileMenu()
                        openModal('signIn')
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-center py-2 px-4 rounded-full"
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