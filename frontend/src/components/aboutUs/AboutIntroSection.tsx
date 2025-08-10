'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Handshake, Users, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AboutIntroSectionProps {
  showButton?: boolean;
}

export default function AboutIntroSection({ showButton = true }: AboutIntroSectionProps) {
  const router = useRouter();
  
  return (
    <section className="w-full bg-background pt-2 pb-6 sm:pt-3 sm:pb-8 md:pt-4 md:pb-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16" id="about-us">
      <div className="max-w-7xl mx-auto">
        {/* Tightly spaced title and intro */}
        <div className="w-full text-center mb-1 sm:mb-2">
          <h2 className="text-2xl xs:text-2.5xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
            About us
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-0 sm:mt-1">
            In the heart of Lebanon&apos;s toughest times, we saw neighbors helping neighbors – sharing bread, medicine, and hope. GiveLeb was born from these everyday acts of courage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Text Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-5 order-2 md:order-1">
            <div>
              <h3 className="text-xl sm:text-1.5xl md:text-2xl font-semibold text-foreground mb-1 sm:mb-2">
                The Lebanese Way of Sharing
              </h3>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-2 sm:mb-3">
                At GiveLeb, we&apos;ve turned our tradition of neighborly care into a digital lifeline. Born in Lebanon during the darkest days of crisis, we connect those who can help with those who need it most – with dignity, speed, and zero bureaucracy.
              </p>
              <p className="text-xs sm:text-sm text-foreground font-semibold">What Makes Us Different</p>
              <ul className="mt-1 space-y-2 sm:space-y-3">
                <li className="flex items-start gap-2 sm:gap-3">
                  <Handshake className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">Direct Aid: Your donation reaches hands, not warehouses.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">Community-Powered: Every post and need is verified by locals.</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm sm:text-base">For All Lebanese: No sides, no sects, just humanity helping humanity.</span>
                </li>
              </ul>
            </div>

            {showButton && (
              <div className="flex justify-center sm:justify-start">
                <Button
                  className="mt-2 sm:mt-3 w-fit bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:text-primary-foreground hover:border-primary/90 transition-colors duration-200 rounded-full px-5 sm:px-6 text-sm sm:text-base"
                  onClick={() => router.push('/about')}
                >
                  Learn More
                </Button>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group w-full max-w-md sm:max-w-lg md:w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-foreground/30 z-10"></div>
              <Image
                src="/aboutUs1.png"
                alt="Lebanese community sharing aid"
                width={600}
                height={500}
                className="rounded-xl sm:rounded-2xl object-cover w-full h-auto transition-transform duration-500 group-hover:scale-105"
                priority
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}