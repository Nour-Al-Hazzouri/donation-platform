'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { COLORS } from '@/lib/constants'
import { MapPinIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import React from 'react'

export default function ContactUs() {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <div className="w-full py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Contact Us</h1>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Lebanon Map - Left Side */}
        <div className="h-full order-2 lg:order-1">
          <Card className="h-full border-0 shadow-sm lg:shadow-none">
            <CardContent className="p-4 sm:p-6 h-full flex flex-col">
              <div className="flex-1 rounded-lg overflow-hidden bg-gray-50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435518.6817837845!2d35.26724929999999!3d33.854720999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151f17215880a78f%3A0x729182bae99836b4!2sLebanon!5e0!3m2!1sen!2slb!4v1712345678901"
                  width="100%"
                  height="100%"
                  className="min-h-[300px] sm:min-h-[400px]"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lebanon Map"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form - Right Side */}
        <div className="h-full order-1 lg:order-2">
          <Card className="h-full border-0 shadow-sm lg:shadow-none">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <UserIcon className="h-4 w-4" />
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <MailIcon className="h-4 w-4" />
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium">
                    <PhoneIcon className="h-4 w-4" />
                    Phone
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+961 XX XXX XXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="text-base sm:text-sm"
                  />
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium">
                    <MapPinIcon className="h-4 w-4" />
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    placeholder="Your message..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className={`
                    w-full mt-4 sm:mt-6
                    bg-[${COLORS.primary}] text-white border-[${COLORS.primary}]
                    hover:bg-[${COLORS.primaryHover}] hover:text-white hover:border-[${COLORS.primaryHover}]
                    transition-colors duration-200 rounded-full py-4 sm:py-6 text-base
                  `}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}