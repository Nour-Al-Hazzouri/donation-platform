"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS } from "@/lib/constants"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, FileText, Users, MapPin } from "lucide-react"
import Image from "next/image"
import { ThemeToggleProvider } from "./ThemeToggleProvider"

export function AdminHeader() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const renderNavLink = (item: (typeof NAV_ITEMS)[0], isMobile = false) => {
    const isActive = pathname === item.href
    const mobileClasses = `px-3 py-2 rounded-md text-base font-medium ${
      isActive
        ? `text-primary bg-secondary`
        : `text-muted-foreground hover:text-red-500 hover:bg-secondary/50`
    }`

    const desktopClasses = `${
      isActive
        ? `text-primary font-medium border-b-2 border-primary pb-1`
        : `text-muted-foreground hover:text-red-500 hover:border-b-2 hover:border-red-500 hover:pb-1 transition-all duration-200`
    } text-sm lg:text-base whitespace-nowrap`

    return (
      <Link
        key={item.name}
        href={item.href}
        className={isMobile ? mobileClasses : desktopClasses}
        onClick={closeMobileMenu}
      >
        {item.name}
      </Link>
    )
  }

  return (
    <>
      <header className="w-full px-3 md:px-4 py-1 shadow-sm sticky top-0 bg-background z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-transform duration-200 hover:scale-105 active:scale-95"
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
                        ? `text-primary font-medium border-b-2 border-primary pb-1`
                        : `text-muted-foreground hover:text-red-500 hover:border-b-2 hover:border-red-500 hover:pb-1 transition-all duration-200`
                    } text-sm lg:text-base whitespace-nowrap`}
                  >
                    {item.name}
                  </Link>
                )
              }
              return renderNavLink(item)
            })}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggleProvider />
            
            {/* Dashboard Button */}
            <Link href="/admin/dashboard">
              <Button
                className="bg-red-500 text-white hover:bg-red-600 transition-colors duration-200 rounded-md px-4 py-2 text-sm font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background overflow-y-auto">
          <div className="p-4">
            <nav className="flex flex-col space-y-4">
              {NAV_ITEMS.map((item) => renderNavLink(item, true))}

              <div className="pt-4 border-t border-border">
                {/* Mobile Admin Profile */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Admin Profile"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-base font-medium text-foreground">Admin</span>
                  </div>
                  
                  {/* Theme Toggle in Mobile Menu */}
                  <ThemeToggleProvider />
                </div>
                
                {/* Dashboard Sidebar Links for Mobile */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Dashboard Menu</h3>
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
                </div>

                {/* Mobile Dashboard Button */}
                <Link href="/admin/dashboard" onClick={closeMobileMenu}>
                  <Button
                    className="w-full text-center py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-600"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
