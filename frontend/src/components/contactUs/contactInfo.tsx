'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MailIcon, PhoneIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { COLORS } from '@/lib/constants'
import React from 'react'

export const ContactInfo = () => {
  const contactMethods = [
    {
      icon: <MailIcon className="h-6 w-6" />,
      title: "Email Us",
      description: "For general inquiries",
      details: "info@giveleb.org",
      link: "mailto:info@giveleb.org",
      bgColor: "bg-primary/10",
      iconColor: COLORS.primary
    },
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: "Call Us",
      description: "For urgent support",
      details: "+961 1 234 567",
      link: "tel:+9611234567",
      bgColor: "bg-gray-100",
      iconColor: COLORS.text.primary
    },
   {
  icon: <MapPinIcon className="h-6 w-6" />,
  title: "Our Location",
  description: "Originated in the heart of",
  details: "Beirut, Lebanon",
  link: "https://maps.google.com/?q=Beirut,Lebanon",
  bgColor: "bg-primary/10",
  iconColor: COLORS.primary
}
  ]

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: COLORS.background }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}> {/* Changed to black */}
            Get In Touch
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: COLORS.text.secondary }}>
            We're here to help you make a difference in Lebanon. Reach out through any of these channels.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300"
              style={{ 
                borderColor: COLORS.border
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <span 
                    className={`p-2 rounded-full ${method.bgColor}`}
                    style={{ color: method.iconColor }}
                  >
                    {method.icon}
                  </span>
                  <CardTitle 
                    className="text-lg"
                    style={{ color: COLORS.text.primary }}
                  >
                    {method.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p 
                  className="text-sm mb-2"
                  style={{ color: COLORS.text.secondary }}
                >
                  {method.description}
                </p>
                {method.link ? (
                  <a 
                    href={method.link} 
                    className="text-base font-medium hover:underline transition-colors"
                    style={{ 
                      color: COLORS.primary,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {method.details}
                  </a>
                ) : (
                  <p 
                    className="text-base font-medium"
                    style={{ color: COLORS.text.primary }}
                  >
                    {method.details}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full" 
            style={{ 
              backgroundColor: COLORS.primaryHover,
              color: 'white'
            }}
          >
            <ClockIcon className="h-5 w-5" />
            <span className="font-medium">
              Already Connected: Monday-Friday • 9:00AM - 5:00PM
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}