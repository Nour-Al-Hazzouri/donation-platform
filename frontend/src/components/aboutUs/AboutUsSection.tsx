import Image from "next/image"
import { Rocket, Building2, Globe, Gift } from 'lucide-react'

export default function AboutUsSection() {
  const stats = [
    {
      icon: Rocket,
      number: "1k+",
      description: "Active Community Members"
    },
    {
      icon: Building2,
      number: "250",
      description: "Monthly Donations"
    },
    {
      icon: Globe,
      number: "92",
      description: "Trusted Local Partners"
    },
    {
      icon: Gift,
      number: "1.4m",
      description: "Lives Impacted"
    }
  ]

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16 mt-12">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="flex justify-center">
                <stat.icon 
                  size={48} 
                  className="text-[#f90404]" 
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-[#000000]">
                  {stat.number}
                </div>
                <p className="text-[#5a5a5a] text-sm md:text-base font-medium leading-tight">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <div className="relative rounded-2xl overflow-hidden shadow-lg w-full sm:w-4/5 md:w-full">
              <Image
                src="/donation1.png"
                alt="Community volunteers helping those in need"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#000000] leading-tight">
              Make a Difference,
              <br />
              Support Those in Need.
            </h2>
            
            <p className="text-[#5a5a5a] text-base md:text-lg leading-relaxed">
              At GiveLeb, your generosity—whether a donation, a shared post, or an hour of your time—becomes a lifeline for families in Lebanon. Together, we transform compassion into real change, ensuring no one struggles alone. Because in our darkest moments, it's the light we create together that guides us forward. Join the movement. Be the hope.
            </p>

            {/* Signature */}
            <div className="pt-4">
              <div className="space-y-1">
                <p className="text-[#5a5a5a] text-sm font-medium">
                  GiveLeb
                </p>
                <p className="text-[#5a5a5a] text-sm">
                  Team
                </p>
                <div className="pt-2">
                  <div className="text-2xl font-bold text-[#000000] italic">
                    GiveLeb
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}