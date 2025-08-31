'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import donationsService, { DonationEvent } from '@/lib/api/donations' // adjust path if needed

export interface DonationData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
  donationAmount?: string
  createdAt?: string
  goalAmount?: number
  currentAmount?: number
  possibleAmount?: number
  unit?: string
  type?: 'request' | 'offer'
  status?: 'active' | 'fulfilled' | 'expired' | 'cancelled'
  userId?: number
  locationId?: number
  endDate?: string
  location?: {
    id: number
    governorate: string
    district: string
  } | null
}

interface DonationsState {
  donations: DonationData[]
  isLoading: boolean
  error: string | null

  // API-based methods (from new store)
  addDonation: (donation: Omit<DonationData, 'id'>) => Promise<void>
  getDonations: () => Promise<DonationData[]>
  getDonationById: (id: number) => Promise<DonationData | undefined>
  getUserDonations: (userId: number) => Promise<DonationData[]>
  getDonationRequests: () => Promise<DonationData[]>
  getDonationOffers: () => Promise<DonationData[]>
  initializeDonations: (initialDonationsOrForce?: DonationData[] | boolean) => Promise<void>
  createTransaction: (eventId: number, amount: number) => Promise<any>
  getTransaction: (transactionId: number) => Promise<any>
  replaceDonation: (event: DonationEvent) => void

  // Legacy methods for backward compatibility
  addDonationLegacy: (donation: Omit<DonationData, 'id'>) => void
  getDonationsLegacy: () => DonationData[]
  initializeDonationsLegacy: (initialDonations: DonationData[]) => void
}

// Initial mock data (from legacy store)
export const initialDonationsData: DonationData[] = [
  {
    id: 1,
    name: "Rahul Kadam",
    title: "Offering help for cancer treatment",
    description:
      "I want to support families battling cancer. My donation will help cover treatment costs for those in need.",
    imageUrl: "/cancer.jpg",
    avatarUrl: "/admin.jpg",
    initials: "RK",
    isVerified: true,
    donationAmount: "50000",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    goalAmount: 100000,
    currentAmount: 50000
  },
  {
    id: 2,
    name: "Rahul Kadam",
    title: "Funding for heart surgeries",
    description:
      "I'm committing funds to help cover heart surgeries for those who can't afford them.",
    avatarUrl: "/placeholder.svg",
    initials: "RK",
    isVerified: true,
    donationAmount: "75000",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    goalAmount: 150000,
    currentAmount: 75000
  },
  {
    id: 3,
    name: "Rajesh Joy",
    title: "Supporting lifelong medical care",
    description:
      "I'm establishing a fund to support individuals needing lifelong medical care.",
    avatarUrl: "/placeholder.svg",
    initials: "RJ",
    isVerified: true,
    donationAmount: "25000",
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    goalAmount: 50000,
    currentAmount: 25000
  }
]

// Helper function to convert API DonationEvent to DonationData
const mapEventToDonationData = (event: DonationEvent | null): DonationData | undefined => {
  // Guard against null or undefined events
  if (!event) {
    console.warn('Attempted to map null or undefined event to DonationData');
    return undefined;
  }
  
  // Guard against missing user data
  if (!event.user) {
    console.warn(`Event ID ${event.id} has missing user data`);
    return {
      id: event.id,
      name: 'Unknown User',
      title: event.title || 'Untitled Donation',
      description: event.description || '',
      initials: 'UN',
      isVerified: false,
      goalAmount: typeof event.goal_amount === 'string' ? parseFloat(event.goal_amount) : (event as any).goal_amount,
      currentAmount: typeof event.current_amount === 'string' ? parseFloat(event.current_amount) : (event as any).current_amount,
      possibleAmount: typeof event.possible_amount === 'string' ? parseFloat(event.possible_amount) : (event as any).possible_amount,
      type: event.type,
      status: event.status,
      createdAt: event.created_at,
      unit: (event as any).unit,
      location: event.location ?? null,
      endDate: (event as any).end_date
    };
  }
  
  return {
    id: event.id,
    name: `${event.user.first_name || ''} ${event.user.last_name || ''}`.trim() || 'Unknown User',
    title: event.title || 'Untitled Donation',
    description: event.description || '',
    imageUrl: event.image_full_urls?.[0] || event.image_urls?.[0] || undefined,
    avatarUrl: (event.user as any).avatar || (event.user as any).avatar_url || undefined,
    initials: `${event.user.first_name?.[0] ?? ''}${event.user.last_name?.[0] ?? ''}` || 'UN',
    isVerified: true, // assume donation creators are verified; adjust as needed
    createdAt: event.created_at,
    goalAmount: typeof event.goal_amount === 'string' ? parseFloat(event.goal_amount) : (event as any).goal_amount,
    currentAmount: typeof event.current_amount === 'string' ? parseFloat(event.current_amount) : (event as any).current_amount,
    possibleAmount: typeof event.possible_amount === 'string' ? parseFloat(event.possible_amount) : (event as any).possible_amount,
    unit: (event as any).unit,
    type: event.type,
    status: event.status,
    userId: event.user.id,
    locationId: event.location?.id,
    location: event.location ?? null,
    endDate: (event as any).end_date
  };
}

export const useDonationsStore = create<DonationsState>()(
  persist(
    (set, get) => ({
      donations: [],
      isLoading: false,
      error: null,

      // API-based methods (from new store)
      initializeDonations: async (initialDonationsOrForce?: DonationData[] | boolean): Promise<void> => {
        // Handle legacy usage with initial donations array
        if (Array.isArray(initialDonationsOrForce)) {
          const currentDonations = get().donations
          if (currentDonations.length === 0) {
            set({ donations: initialDonationsOrForce })
          }
          return
        }

        // Handle new API-based initialization
        const force = initialDonationsOrForce === true
        set({ isLoading: true, error: null })
        try {
          // Always fetch fresh data from API (force param reserved for future logic)
          const response = await donationsService.getAllEvents()
          const payload = response?.data ?? response
          // Filter out any undefined values that might be returned by mapEventToDonationData
          const mappedDonations = (payload ?? [])
            .map(mapEventToDonationData)
            .filter((donation): donation is DonationData => donation !== undefined)
          set({ donations: mappedDonations, isLoading: false })
          return
        } catch (error: any) {
          console.error('Error initializing donations:', error)
          // Fall back to initial mock data if API fails
          const currentDonations = get().donations
          if (currentDonations.length === 0) {
            set({ donations: initialDonationsData })
          }
          set({
            error: error?.response?.data?.message || 'Failed to load donations, using cached data',
            isLoading: false
          })
          return
        }
      },

      addDonation: async (newDonation) => {
        set({ isLoading: true, error: null })
        try {
          // Build API payload (server expects snake_case fields)
          const eventData: any = {
            title: newDonation.title,
            description: newDonation.description,
            type: newDonation.type || 'request',
            goal_amount: newDonation.goalAmount || 0,
            unit: newDonation.unit || 'LBP',
            end_date: newDonation.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location_id: newDonation.locationId || 1,
            image_urls: []
          }

          // If imageUrl is a blob/URL we attempt to fetch and convert to File
          if (newDonation.imageUrl) {
            try {
              const resp = await fetch(newDonation.imageUrl)
              const blob = await resp.blob()
              const file = new File([blob], 'image.jpg', { type: blob.type || 'image/jpeg' })
              eventData.image_urls.push(file)
            } catch (error) {
              console.warn('Failed to attach image for event creation', error)
            }
          }

          const response = await donationsService.createEvent(eventData)
          const eventPayload = response?.data ?? response
          const mappedDonation = mapEventToDonationData(eventPayload)

          if (mappedDonation) {
            const currentDonations = get().donations
            set({
              donations: [mappedDonation, ...currentDonations],
              isLoading: false
            })
          }
        } catch (error: any) {
          console.error('Error adding donation:', error)
          // Fall back to legacy behavior if API fails
          const currentDonations = get().donations
          const newId = Math.max(...currentDonations.map((d) => d.id), 0) + 1

          const donationWithId: DonationData = {
            ...newDonation,
            id: newId,
            createdAt: new Date().toISOString()
          }

          set({ 
            donations: [donationWithId, ...currentDonations],
            error: error?.response?.data?.message || 'Failed to add donation via API, added locally',
            isLoading: false
          })
        }
      },

      getDonations: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getAllEvents()
          const payload = response?.data ?? response
          // Filter out any undefined values that might be returned by mapEventToDonationData
          const mappedDonations = (payload ?? [])
            .map(mapEventToDonationData)
            .filter((donation): donation is DonationData => donation !== undefined)
          set({ donations: mappedDonations, isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donations:', error)
          set({
            error: error?.response?.data?.message || 'Failed to load donations',
            isLoading: false
          })
          return get().donations // Return cached donations
        }
      },

      getDonationById: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getEvent(id)
          // Check if response is null (404 not found case)
          if (!response) {
            console.warn(`Donation with ID ${id} not found`)
            set({
              error: `Donation with ID ${id} not found`,
              isLoading: false
            })
            return undefined
          }
          const payload = response?.data ?? response
          const mappedDonation = mapEventToDonationData(payload)
          set({ isLoading: false })
          return mappedDonation
        } catch (error: any) {
          console.error(`Error getting donation with ID ${id}:`, error)
          set({
            error: error?.response?.data?.message || `Failed to load donation with ID ${id}`,
            isLoading: false
          })
          return undefined
        }
      },

      getUserDonations: async (userId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getUserEvents(userId)
          const payload = response?.data ?? response
          // Filter out any undefined values that might be returned by mapEventToDonationData
          const mappedDonations = (payload ?? [])
            .map(mapEventToDonationData)
            .filter((donation): donation is DonationData => donation !== undefined)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error(`Error getting donations for user ${userId}:`, error)
          set({
            error: error?.response?.data?.message || `Failed to load donations for user ${userId}`,
            isLoading: false
          })
          return []
        }
      },

      getDonationRequests: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getRequests()
          const payload = response?.data ?? response
          // Filter out any undefined values that might be returned by mapEventToDonationData
          const mappedDonations = (payload ?? [])
            .map(mapEventToDonationData)
            .filter((donation): donation is DonationData => donation !== undefined)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donation requests:', error)
          set({
            error: error?.response?.data?.message || 'Failed to load donation requests',
            isLoading: false
          })
          return []
        }
      },

      getDonationOffers: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getOffers()
          const payload = response?.data ?? response
          // Filter out any undefined values that might be returned by mapEventToDonationData
          const mappedDonations = (payload ?? [])
            .map(mapEventToDonationData)
            .filter((donation): donation is DonationData => donation !== undefined)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donation offers:', error)
          set({
            error: error?.response?.data?.message || 'Failed to load donation offers',
            isLoading: false
          })
          return []
        }
      },

      createTransaction: async (eventId: number, amount: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.createTransaction(eventId, { amount })
          set({ isLoading: false })
          return response?.data ?? response
        } catch (error: any) {
          console.error('Error creating transaction:', error)
          set({
            error: error?.response?.data?.message || 'Failed to create transaction',
            isLoading: false
          })
          throw error
        }
      },

      getTransaction: async (transactionId: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getTransaction(transactionId)
          set({ isLoading: false })
          return response?.data ?? response
        } catch (error: any) {
          console.error(`Error getting transaction with ID ${transactionId}:`, error)
          set({
            error: error?.response?.data?.message || `Failed to load transaction with ID ${transactionId}`,
            isLoading: false
          })
          return null
        }
      },

      // Replace or upsert a donation using the API DonationEvent object
      replaceDonation: (event: DonationEvent) => {
        try {
          const mapped = mapEventToDonationData(event)
          // If mapping failed, don't update the store
          if (!mapped) {
            console.warn('replaceDonation failed: could not map event to donation data', event)
            return;
          }
          
          set((state) => {
            const exists = state.donations.some(d => d.id === mapped.id)
            if (exists) {
              return {
                donations: state.donations.map(d => (d.id === mapped.id ? mapped : d))
              }
            } else {
              // Prepend the new/updated donation
              return { donations: [mapped, ...state.donations] }
            }
          })
        } catch (e) {
          console.warn('replaceDonation failed:', e)
        }
      },

      // Legacy methods for backward compatibility
      addDonationLegacy: (newDonation) => {
        const currentDonations = get().donations
        const newId = Math.max(...currentDonations.map((d) => d.id), 0) + 1

        const donationWithId: DonationData = {
          ...newDonation,
          id: newId,
          createdAt: new Date().toISOString()
        }

        set({ donations: [donationWithId, ...currentDonations] })
      },

      getDonationsLegacy: () => {
        return get().donations
      },

      initializeDonationsLegacy: (initialDonations) => {
        const currentDonations = get().donations
        if (currentDonations.length === 0) {
          set({ donations: initialDonations })
        }
      }
    }),
    {
      name: 'donations-storage',
      partialize: (state) => ({ donations: state.donations })
    }
  )
)