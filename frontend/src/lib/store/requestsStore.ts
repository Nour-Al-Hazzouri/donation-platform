'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RequestData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
  goalAmount?: string
  createdAt?: string
}

interface RequestsState {
  requests: RequestData[]
  addRequest: (request: Omit<RequestData, 'id'>) => void
  getRequests: () => RequestData[]
  initializeRequests: (initialRequests: RequestData[]) => void
}

// Initial mock data
const initialRequestsData: RequestData[] = [
  {
    id: 1,
    name: "Rahul Kadam",
    title: "Need help for treatment of cancer",
    description: "We are facing an incredibly difficult battle as our son fights cancer. His strength gives us hope, but we cannot do it alone. We humbly ask for your support during this challenging time. Every donation, no matter the amount, brings us closer to the treatment he desperately needs.",
    imageUrl: "/pills.jpg?height=120&width=280",
    avatarUrl: "/admin.jpg?height=48&width=48",
    initials: "RK",
    isVerified: true,
    goalAmount: "50000",
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  },
  {
    id: 2,
    name: "Rahul Kadam",
    title: "Need help for heart surgery",
    description: "Our loved one urgently needs heart surgery, and we can't cover the medical costs alone. Any donation, big or small, brings us hope. Please consider contributing and sharing our story—your support means everything.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RK",
    isVerified: true,
    goalAmount: "75000",
    createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
  },
  {
    id: 3,
    name: "Rajesh Joy",
    title: "Need help to survive the whole life",
    description: "We are facing a life-threatening situation and urgently need financial support to survive. Medical costs are overwhelming, and without help, we can't afford the care required. Every donation, no matter the amount, brings us hope for a better future. Please consider contributing—your generosity can make a life-saving difference.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "RJ",
    isVerified: true,
    goalAmount: "25000",
    createdAt: new Date(Date.now() - 259200000).toISOString() // 3 days ago
  },
  {
    id: 4,
    name: "Sarah Ahmed",
    title: "Emergency medical treatment needed",
    description: "My daughter needs urgent medical treatment that we cannot afford. The doctors say time is critical, and we are running out of options. Please help us save her life. Any contribution will make a difference in our fight against time.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "SA",
    isVerified: true,
    goalAmount: "30000",
    createdAt: new Date(Date.now() - 345600000).toISOString() // 4 days ago
  },
  {
    id: 5,
    name: "Michael Chen",
    title: "Help rebuild after house fire",
    description: "Our family lost everything in a devastating house fire last week. We are grateful to be alive, but now we need help rebuilding our lives. Any support for temporary housing, clothing, and basic necessities would mean the world to us.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "MC",
    isVerified: false,
    goalAmount: "15000",
    createdAt: new Date(Date.now() - 432000000).toISOString() // 5 days ago
  },
  {
    id: 6,
    name: "Priya Sharma",
    title: "Education fund for underprivileged children",
    description: "We are raising funds to provide education and school supplies for children in our community who cannot afford them. Education is the key to breaking the cycle of poverty. Help us give these children a brighter future.",
    avatarUrl: "/placeholder.svg?height=48&width=48",
    initials: "PS",
    isVerified: true,
    goalAmount: "10000",
    createdAt: new Date(Date.now() - 518400000).toISOString() // 6 days ago
  }
]

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      
      initializeRequests: (initialRequests) => {
        const currentRequests = get().requests
        if (currentRequests.length === 0) {
          set({ requests: initialRequests })
        }
      },
      
      addRequest: (newRequest) => {
        const currentRequests = get().requests
        const newId = Math.max(...currentRequests.map(r => r.id), 0) + 1
        
        const requestWithId: RequestData = {
          ...newRequest,
          id: newId,
          createdAt: new Date().toISOString()
        }
        
        // Add new request at the beginning (most recent first)
        set({ requests: [requestWithId, ...currentRequests] })
      },
      
      getRequests: () => {
        return get().requests
      }
    }),
    {
      name: 'requests-storage',
      partialize: (state) => ({ requests: state.requests })
    }
  )
)

// Export the initial data for backward compatibility
export { initialRequestsData }
