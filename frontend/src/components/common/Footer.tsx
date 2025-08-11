'use client'

import Link from "next/link"
import { Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NAV_ITEMS } from "@/utils/constants"
import { useTheme } from "next-themes"
import Image from "next/image"
import { COLORS } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { theme } = useTheme()

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
          
          {/* Logo and Stats Section */}
          <div className="space-y-4">
            <div className="flex flex-col items-start space-y-4">
              <Link 
                href="/" 
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <div className="w-36 h-10 relative -ml-6">
                  <Image 
                    src="/logo.png" 
                    alt="GiveLeb Logo" 
                    fill
                    sizes="(max-width: 768px) 144px, 180px"
                    className="object-contain dark:hidden"
                    priority
                  />
                  <Image 
                    src="/logo-dark-removebg-preview.png" 
                    alt="GiveLeb Logo" 
                    fill
                    sizes="(max-width: 768px) 144px, 180px"
                    className="object-contain hidden dark:block"
                    priority
                  />
                </div>
              </Link>
              <div className="space-y-1 pl-[2px]">
                <div className="text-2xl font-bold text-foreground">10k</div>
                <div className="text-muted-foreground text-sm leading-tight">
                  Worldwide Client
                  <br />
                  Already Connected
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="#" 
                  className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-red-500 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-3">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  className="block text-muted-foreground hover:text-red-500 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Get In Touch Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-lg">Get In Touch</h3>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: info@giveleb.org</p>
              <p>Phone: +961 1 234 567</p>
              <p>Beirut, Lebanon</p>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-foreground font-semibold text-lg">Newsletter</h3>
            <div className="flex flex-col md:flex-row gap-2 max-w-full">
              <Input
                type="email"
                placeholder="Enter Your Email"
                className="w-full border-input focus:border-red-500 focus:ring-red-500"
              />
              <Button className="bg-red-500 hover:bg-red-600 text-white px-4 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © {currentYear} GiveLeb. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}