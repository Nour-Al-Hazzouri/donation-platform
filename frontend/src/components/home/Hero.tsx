'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { COLORS } from "@/lib/constants"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter();
  
  return (
    <section className="container mx-auto px-4 py-8"> {/* Reduced py-12 to py-8 */}
      {/* Hero Text and Email Signup */}
      <div className="text-center mb-5 px-4"> {/* Reduced mb-16 to mb-12 */}
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"> {/* Reduced mb-8 to mb-6 */}
          Give What You Can, Take What You Need – Lebanon Rises
          <br />
          When We Stand Together{" "}
          <span className="inline-block align-middle ml-2">
            <Image 
              src="/leb-heart.png" 
              alt="Lebanon Heart" 
              width={56} 
              height={56}
              className="inline-block hover:scale-110 transition-transform duration-300"
            />
          </span>
        </h1>

        {/* Email Signup */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <div className="relative w-full sm:flex-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="email"
              placeholder="Enter email address"
              className="pl-10 py-3 rounded-full border border-input focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 w-full shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                boxShadow: `0 0 0 1px ${COLORS.primary}20`
              }}
            />
          </div>
          <Button 
            className="bg-primary hover:bg-primaryHover text-white rounded-full px-8 py-3 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: COLORS.primary,
              '--tw-shadow-color': `${COLORS.primary}80`,
              '--tw-shadow': 'var(--tw-shadow-colored)'
            } as React.CSSProperties}
          >
            Join Community
          </Button>
        </div>
      </div>

      {/* Image Collage */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div className="transform sm:rotate-[-8deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105 h-full w-full">
          <Image
            src="/donation1.png"
            alt="Community sharing books"
            width={300}
            height={400}
            className="rounded-xl shadow-md hover:shadow-lg object-cover w-full h-full transition-all duration-300"
          />
        </div>
        <div className="transform sm:rotate-[4deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105 h-full w-full sm:mt-6">
          <Image
            src="/donation2.jpg"
            alt="Clothing donations"
            width={300}
            height={400}
            className="rounded-xl shadow-md hover:shadow-lg object-cover w-full h-full transition-all duration-300"
          />
        </div>
        <div className="transform sm:rotate-[-6deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105 h-full w-full">
          <Image
            src="/donation3.jpg"
            alt="Food donations"
            width={300}
            height={400}
            className="rounded-xl shadow-md hover:shadow-lg object-cover w-full h-full transition-all duration-300"
          />
        </div>
        <div className="transform sm:rotate-[8deg] hover:rotate-0 transition-all duration-500 ease-out hover:scale-105 h-full w-full sm:mt-6">
          <Image
            src="/donation4.jpg"
            alt="Donation box"
            width={300}
            height={400}
            className="rounded-xl shadow-md hover:shadow-lg object-cover w-full h-full transition-all duration-300"
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-background/80 p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-center md:text-left w-full md:w-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            "Hope grows when we give
            <br className="hidden sm:block" />
            <span className="sm:ml-16 block sm:inline">as one."</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Button 
            className="bg-primary hover:bg-primaryHover text-white rounded-full px-8 py-3 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: COLORS.primary,
              '--tw-shadow-color': `${COLORS.primary}80`
            } as React.CSSProperties}
            onClick={() => router.push('/add-request')}
          >
            Add Request
          </Button>
          <Button 
            className="bg-primary hover:bg-primaryHover text-white rounded-full px-8 py-3 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-300"
            style={{
              backgroundColor: COLORS.primary,
              '--tw-shadow-color': `${COLORS.primary}80`
            } as React.CSSProperties}
            onClick={() => router.push('/add-donation')}
          >
            Donate Now
          </Button>
        </div>
      </div>
    </section>
  )
}