import Image from "next/image"
import { Heart, Diamond, Shield } from 'lucide-react'

export default function AboutOrganizationSection() {
  const organizationInfo = [
    {
      icon: Heart,
      title: "Our Mission",
      description: "GiveLeb transforms generosity into direct action, connecting urgent needs with compassionate aid—swiftly, transparently, and without barriers."
    },
    {
      icon: Diamond,
      title: "Our Vision", 
      description: "We envision a Lebanon where no one struggles alone, powered by technology and unity to build resilient, self-sustaining communities."
    },
    {
      icon: Shield,
      title: "Our Values",
      description: "We prioritize speed with dignity, because urgent aid should never come at the cost of respect. Every donation is verified and tracked, ensuring complete transparency in our work. United by our shared humanity, we serve all Lebanese equally, empowering local communities to lead their own recovery."
    }
  ]

  return (
    <section className="bg-background py-12 sm:py-16 px-4 xs:px-6 sm:px-8 lg:px-12 xl:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
          {/* Text Content - Order changes on lg screens */}
          <div className="order-2 lg:order-1 space-y-6 sm:space-y-8">
            <h2 className="text-3xl xs:text-3.5xl sm:text-4xl md:text-4.5xl font-bold text-foreground leading-tight">
              About our Organization
            </h2>
            
            <div className="space-y-6 sm:space-y-8">
              {organizationInfo.map((item, index) => (
                <div key={index} className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon 
                        size={20} 
                        className="text-primary-foreground" 
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base md:text-[1.0625rem] leading-relaxed ml-14 sm:ml-16">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image - Order changes on lg screens */}
          <div className="order-1 lg:order-2 h-full flex items-center">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg w-full h-full min-h-[320px]">
              <Image
                src="/aboutUs3.png"
                alt="Hands coming together holding donation bags, symbolizing community support and giving"
                fill
                className="object-cover object-center"
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