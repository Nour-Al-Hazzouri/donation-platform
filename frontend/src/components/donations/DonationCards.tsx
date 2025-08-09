import { DonationCard } from "@/components/donations/DonationCard"

export interface DonationData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
}

export const donationsData: DonationData[] = [
  {
    id: 1,
    name: "Rahul Kadam",
    title: "Offering help for cancer treatment",
    description: "I want to support families battling cancer. My donation will help cover treatment costs for those in need. Together we can make a difference in their fight against this disease.",
    imageUrl: "/cancer.jpg", // Added image for first card
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RK",
    isVerified: true
  },
  {
    id: 2,
    name: "Rahul Kadam",
    title: "Funding for heart surgeries",
    description: "I'm committing funds to help cover heart surgeries for those who can't afford them. Your matching donations can help us save more lives. Let's work together to give the gift of health.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RK",
    isVerified: true
  },
  {
    id: 3,
    name: "Rajesh Joy",
    title: "Supporting lifelong medical care",
    description: "I'm establishing a fund to support individuals needing lifelong medical care. Your contributions will help provide consistent care for those with chronic conditions. Every bit helps create a better quality of life.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RJ",
    isVerified: true
  },
  {
    id: 4,
    name: "Sarah Ahmed",
    title: "Emergency medical fund",
    description: "I've created an emergency medical fund to help families in crisis situations. Your matching donations will allow us to respond quickly when urgent needs arise. Together we can be there when it matters most.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "SA",
    isVerified: true
  },
  {
    id: 5,
    name: "Michael Chen",
    title: "Disaster relief fund",
    description: "I'm offering support for families affected by disasters like fires or floods. Your contributions will help provide temporary housing and basic necessities. Let's help rebuild lives together.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "MC",
    isVerified: false
  },
  {
    id: 6,
    name: "Priya Sharma",
    title: "Education support fund",
    description: "I'm funding education for underprivileged children in our community. Your matching donations will help provide school supplies and tuition assistance. Education is the key to breaking the cycle of poverty.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "PS",
    isVerified: true
  }
]

interface DonationCardsProps {
  donations: DonationData[]
  searchTerm: string
}

export function DonationCards({ donations, searchTerm }: DonationCardsProps) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No donations available</div>
        <p className="text-gray-400">
          {searchTerm 
            ? `Try adjusting your search term "${searchTerm}" or browse all donations.`
            : "There are no donation offers available at the moment."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donations.map((donation) => (
        <DonationCard
          key={donation.id}
          id={donation.id}
          name={donation.name}
          title={donation.title}
          description={donation.description}
          imageUrl={donation.imageUrl} // Uncommented to show images
          avatarUrl={donation.avatarUrl}
          initials={donation.initials}
          isVerified={donation.isVerified}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}