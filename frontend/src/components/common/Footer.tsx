'use client'

import Link from "next/link"
import { NAV_ITEMS, COLORS } from "@/lib/constants"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={`w-full px-6 py-8 bg-[${COLORS.text.primary}] text-white`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-8 h-8 bg-[${COLORS.primary}] rounded-sm flex items-center justify-center`}>
                <span className="text-white text-lg font-bold">♥</span>
              </div>
              <span className="text-white text-xl font-semibold">GiveLeb</span>
            </div>
            <p className="text-black max-w-md font-medium">
              A platform dedicated to connecting Lebanese people in need with those who can help.
              Give what you can, take what you need.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Quick Links</h3>
            <ul className="space-y-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-black hover:underline transition-all font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-black">Contact Us</h3>
            <ul className="space-y-2 text-black font-medium">
              <li>Email: info@giveleb.org</li>
              <li>Phone: +961 1 234 567</li>
              <li>Beirut, Lebanon</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center text-black">
          <p>© {currentYear} GiveLeb. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}