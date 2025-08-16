// src/store/donationsStore.ts
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

  // existing methods
  addDonation: (donation: Omit<DonationData, 'id'>) => Promise<void>
  getDonations: () => Promise<DonationData[]>
  getDonationById: (id: number) => Promise<DonationData | undefined>
  getUserDonations: (userId: number) => Promise<DonationData[]>
  getDonationRequests: () => Promise<DonationData[]>
  getDonationOffers: () => Promise<DonationData[]>
  initializeDonations: (force?: boolean) => Promise<void>
  createTransaction: (eventId: number, amount: number) => Promise<any>
  getTransaction: (transactionId: number) => Promise<any>

  // NEW: replace or upsert a donation (after API updates like transaction create)
  replaceDonation: (event: DonationEvent) => void
}

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

      // Initialize donations from API. `force=true` can be used to always fetch
      initializeDonations: async (force = false): Promise<void> => {
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
          set({
            error: error?.response?.data?.message || 'Failed to load donations',
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

          const currentDonations = get().donations
          set({
            isLoading: false
          })
        } catch (error: any) {
          console.error('Error adding donation:', error)
          set({
            error: error?.response?.data?.message || 'Failed to add donation',
            isLoading: false
          })
          throw error
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
          return []
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
          return mappedDonation
        } catch (error: any) {
          console.error(`Error getting donation with ID ${id}:`, error)
          set({
            error: error?.response?.data?.message || `Failed to load donation with ID ${id}`,
            isLoading: false
          })
          return undefined
        } finally {
          set({ isLoading: false })
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

      // NEW: Replace or upsert a donation using the API DonationEvent object
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
      }
    }),
    {
      name: 'donations-storage'
    }
  )
)
