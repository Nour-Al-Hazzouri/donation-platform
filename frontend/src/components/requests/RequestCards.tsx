import { RequestCard } from "./RequestCard"

export interface RequestData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
}

export const requestsData: RequestData[] = [
  {
    id: 1,
    name: "Rahul Kadam",
    title: "Need help for treatment of cancer",
    description: "We are facing an incredibly difficult battle as our son fights cancer. His strength gives us hope, but we cannot do it alone. We humbly ask for your support during this challenging time. Every donation, no matter the amount, brings us closer to the treatment he desperately needs.",
    //imageUrl: "/placeholder.svg?height=120&width=280",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RK",
    isVerified: true
  },
  {
    id: 2,
    name: "Rahul Kadam",
    title: "Need help for heart surgery",
    description: "Our loved one urgently needs heart surgery, and we can't cover the medical costs alone. Any donation, big or small, brings us hope. Please consider contributing and sharing our story—your support means everything.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RK",
    isVerified: true
  },
  {
    id: 3,
    name: "Rajesh Joy",
    title: "Need help to survive the whole life",
    description: "We are facing a life-threatening situation and urgently need financial support to survive. Medical costs are overwhelming, and without help, we can't afford the care required. Every donation, no matter the amount, brings us hope for a better future. Please consider contributing—your generosity can make a life-saving difference.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RJ",
    isVerified: true
  },
  {
    id: 4,
    name: "Sarah Ahmed",
    title: "Emergency medical treatment needed",
    description: "My daughter needs urgent medical treatment that we cannot afford. The doctors say time is critical, and we are running out of options. Please help us save her life. Any contribution will make a difference in our fight against time.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "SA",
    isVerified: true
  },
  {
    id: 5,
    name: "Michael Chen",
    title: "Help rebuild after house fire",
    description: "Our family lost everything in a devastating house fire last week. We are grateful to be alive, but now we need help rebuilding our lives. Any support for temporary housing, clothing, and basic necessities would mean the world to us.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "MC",
    isVerified: false
  },
  {
    id: 6,
    name: "Priya Sharma",
    title: "Education fund for underprivileged children",
    description: "We are raising funds to provide education and school supplies for children in our community who cannot afford them. Education is the key to breaking the cycle of poverty. Help us give these children a brighter future.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "PS",
    isVerified: true
  }
]

interface RequestCardsProps {
  requests: RequestData[]
  searchTerm: string
}

export function RequestCards({ requests, searchTerm }: RequestCardsProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No requests found</div>
        <p className="text-gray-400">
          {searchTerm 
            ? `Try adjusting your search term "${searchTerm}" or browse all requests.`
            : "There are no donation requests available at the moment."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          name={request.name}
          title={request.title}
          description={request.description}
          //imageUrl={request.imageUrl}
          avatarUrl={request.avatarUrl}
          initials={request.initials}
          isVerified={request.isVerified}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}
