// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\components\aboutUs\AboutStatsSection.tsx
import { Rocket, Building2, Globe, Gift } from 'lucide-react'

export default function AboutStatsSection() {
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
    <section className="bg-background py-12 sm:py-14 md:py-16 px-4 xs:px-6 sm:px-8 lg:px-10 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Statistics Section */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-3 sm:space-y-4 p-3 sm:p-4 rounded-xl hover:bg-muted transition-colors duration-200"
            >
              <div className="flex justify-center">
                <stat.icon 
                  size={40} 
                  className="text-red-500"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <div className="text-3xl xs:text-4xl sm:text-[2.5rem] md:text-5xl font-bold text-foreground">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-xs xs:text-sm sm:text-[0.9375rem] md:text-base font-medium leading-snug">
                  {stat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}