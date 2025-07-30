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
      description: "We envision a Lebanon where no one struggles alone, powered by technology and unity to build resilient, self-sustaining communities...."
    },
    {
      icon: Shield,
      title: "Our Values",
      description: "We prioritize speed with dignity, because urgent aid should never come at the cost of respect. Every donation is verified and tracked, ensuring complete transparency in our work. United by our shared humanity, we serve all Lebanese equally, empowering local communities to lead their own recovery."
    }
  ]

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#000000] leading-tight">
              About our Organization
            </h2>
            
            <div className="space-y-8">
              {organizationInfo.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#f90404] rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon 
                        size={24} 
                        className="text-white" 
                        strokeWidth={2}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-[#000000]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[#5a5a5a] text-base md:text-lg leading-relaxed ml-16">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="order-first lg:order-last flex justify-center lg:justify-end">
            <div className="relative rounded-2xl overflow-hidden shadow-lg w-full sm:w-3/4 md:w-4/5 lg:w-full">
              <Image
                src="/donation2.jpg"
                alt="Hands coming together holding donation bags, symbolizing community support and giving"
                width={600}
                height={500}
                className="w-full h-auto object-cover object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}