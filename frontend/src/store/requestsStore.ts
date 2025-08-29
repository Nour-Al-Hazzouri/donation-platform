'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RequestEvent } from '@/lib/api/requests'

export interface RequestData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
  goalAmount: string
  currentAmount: number
  possibleAmount: number
  unit?: string
  type: 'request'
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
  userId?: number
  locationId?: number
  createdAt?: string
  endDate?: string
  location?: {
    id: number
    governorate: string
    district: string
  } | null
}

const mapEventToRequestData = (event: RequestEvent | null): RequestData | undefined => {
  if (!event) {
    console.warn('Attempted to map null or undefined event to RequestData');
    return undefined;
  }

  if (!event.user) {
    console.warn(`Event ID ${event.id} has missing user data`);
    return {
      id: event.id,
      name: 'Unknown User',
      title: event.title || 'Untitled Request',
      description: event.description || '',
      initials: 'UN',
      isVerified: false,
      goalAmount: event.goal_amount?.toString() || '0',
      currentAmount: event.current_amount || 0,
      possibleAmount: event.possible_amount || 0,
      type: 'request',
      status: event.status,
      unit: event.unit,
      location: event.location,
      endDate: event.end_date,
      createdAt: event.created_at
    };
  }

  return {
    id: event.id,
    name: `${event.user.first_name || ''} ${event.user.last_name || ''}`.trim() || 'Unknown User',
    title: event.title || 'Untitled Request',
    description: event.description || '',
    imageUrl: event.image_full_urls?.[0] || event.image_urls?.[0],
    avatarUrl: event.user.avatar_url || undefined,
    initials: `${event.user.first_name?.[0] ?? ''}${event.user.last_name?.[0] ?? ''}` || 'UN',
    isVerified: true,
    goalAmount: event.goal_amount?.toString() || '0',
    currentAmount: event.current_amount || 0,
    possibleAmount: event.possible_amount || 0,
    unit: event.unit,
    type: 'request',
    status: event.status,
    userId: event.user.id,
    locationId: event.location?.id,
    location: event.location || null,
    endDate: event.end_date,
    createdAt: event.created_at
  };
}

interface RequestsState {
  requests: RequestData[]
  isLoading: boolean
  error: string | null
  addRequest: (request: Omit<RequestData, 'id' | 'currentAmount' | 'possibleAmount' | 'status' | 'type'>) => void
  updateRequestCurrentAmount: (requestId: number, amount: number) => void
  getRequests: () => RequestData[]
  initializeRequests: (initialRequests: RequestData[]) => void
  replaceRequest: (event: RequestEvent) => void
}

export const initialRequestsData: RequestData[] = [
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
    currentAmount: 12500,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 86400000).toISOString()
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
    currentAmount: 23000,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 172800000).toISOString()
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
    currentAmount: 8750,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 259200000).toISOString()
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
    currentAmount: 5200,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 345600000).toISOString()
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
    currentAmount: 3800,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 432000000).toISOString()
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
    currentAmount: 2100,
    possibleAmount: 0,
    type: 'request',
    status: 'active',
    createdAt: new Date(Date.now() - 518400000).toISOString()
  }
]

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      isLoading: false,
      error: null,
      addRequest: (newRequest) => {
        set((state) => ({
          requests: [
            ...state.requests,
            {
              ...newRequest,
              id: Math.max(0, ...state.requests.map((r) => r.id)) + 1,
              currentAmount: 0,
              possibleAmount: 0,
              type: 'request',
              status: 'active',
            } as RequestData,
          ],
        }))
      },
      updateRequestCurrentAmount: (requestId, amount) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId ? { ...request, currentAmount: amount } : request
          ),
        }))
      },
      getRequests: () => {
        return get().requests
      },
      initializeRequests: (initialRequests) => {
        set({ requests: initialRequests })
      },
      replaceRequest: (event) => {
        const mappedRequest = mapEventToRequestData(event);
        if (!mappedRequest) return;

        set((state) => {
          const exists = state.requests.some(r => r.id === event.id);
          if (exists) {
            return {
              requests: state.requests.map(r => 
                r.id === event.id ? { ...mappedRequest } : r
              )
            };
          } else {
            return {
              requests: [...state.requests, mappedRequest]
            };
          }
        });
      }
    }),
    {
      name: 'requests-storage'
    }
  )
)