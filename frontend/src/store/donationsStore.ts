'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import donationsService from '@/lib/api/donations' // adjust if your barrel export differs
import { DonationEvent } from '@/lib/api/donations'

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
  addDonation: (donation: Omit<DonationData, 'id'>) => Promise<void>
  getDonations: () => Promise<DonationData[]>
  getDonationById: (id: number) => Promise<DonationData | undefined>
  getUserDonations: (userId: number) => Promise<DonationData[]>
  getDonationRequests: () => Promise<DonationData[]>
  getDonationOffers: () => Promise<DonationData[]>
  initializeDonations: (force?: boolean) => Promise<void>
  createTransaction: (eventId: number, amount: number) => Promise<any>
  getTransaction: (transactionId: number) => Promise<any>
}

// Helper function to convert API DonationEvent to DonationData
const mapEventToDonationData = (event: DonationEvent): DonationData => ({
  id: event.id,
  name: `${event.user.first_name} ${event.user.last_name}`,
  title: event.title,
  description: event.description,
  imageUrl: event.image_urls?.[0] || undefined,
  avatarUrl: event.user.avatar_url || undefined,
  initials: `${event.user.first_name[0]}${event.user.last_name[0]}`,
  isVerified: true,
  createdAt: event.created_at,
  goalAmount: event.goal_amount,
  currentAmount: event.current_amount,
  possibleAmount: event.possible_amount,
  unit: event.unit,
  type: event.type,
  status: event.status,
  userId: event.user.id,
  locationId: event.location?.id,
  location: event.location
})

export const useDonationsStore = create<DonationsState>()(
  persist(
    (set, get) => ({
      donations: [],
      isLoading: false,
      error: null,

      // Replaced initializeDonations with force flag
  initializeDonations: async (force = false) => {
    set({ isLoading: true, error: null })
    try {
      // fetch always (or short-circuit if you want)
      const response = await donationsService.getAllEvents()
      const mappedDonations = response.data.map(mapEventToDonationData)
      set({ donations: mappedDonations, isLoading: false })
    } catch (err: any) {
      console.error('Error initializing donations:', err)
      set({ error: err?.response?.data?.message || 'Failed to load donations', isLoading: false })
    }
  },

      addDonation: async (newDonation) => {
        set({ isLoading: true, error: null })
        try {
          interface CreateDonationEventData {
            title: string;
            description: string;
            type: 'request' | 'offer';
            goal_amount: number;
            unit: string;
            end_date: string;
            location_id: number;
            image_urls: File[];
          }
          
          const eventData: CreateDonationEventData = {
            title: newDonation.title,
            description: newDonation.description,
            type: newDonation.type || 'request',
            goal_amount: newDonation.goalAmount || 0,
            unit: newDonation.unit || 'LBP',
            end_date: newDonation.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            location_id: newDonation.locationId || 1,
            image_urls: []
          }

          // If callers pass a real File, prefer that (make sure your form passes imageFile)
          if ((newDonation as any).imageFile) {
            eventData.image_urls.push((newDonation as any).imageFile)
          } else if (newDonation.imageUrl) {
            // backward-compatible fallback: try fetching blob from a blob: or data: URL
            try {
              const response = await fetch(newDonation.imageUrl)
              const blob = await response.blob()
              const fileName = 'donation-image.jpg'
              const mimeType = blob.type || 'image/jpeg'
              const file = new File([blob], fileName, { type: mimeType })
              eventData.image_urls.push(file)
            } catch (err) {
              console.error('Error processing image:', err)
            }
          }

          const response = await donationsService.createEvent(eventData)
          const mappedDonation = mapEventToDonationData(response.data)
          
          const currentDonations = get().donations
          set({ 
            donations: [mappedDonation, ...currentDonations],
            isLoading: false 
          })
        } catch (error: any) {
          console.error('Error adding donation:', error)
          set({ 
            error: error.response?.data?.message || 'Failed to add donation', 
            isLoading: false 
          })
          throw error
        }
      },

      getDonations: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getAllEvents()
          const mappedDonations = response.data.map(mapEventToDonationData)
          set({ donations: mappedDonations, isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donations:', error)
          set({ 
            error: error.response?.data?.message || 'Failed to load donations', 
            isLoading: false 
          })
          return []
        }
      },

      getDonationById: async (id: number) => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getEvent(id)
          const mappedDonation = mapEventToDonationData(response.data)
          return mappedDonation
        } catch (error: any) {
          console.error(`Error getting donation with ID ${id}:`, error)
          set({ 
            error: error.response?.data?.message || `Failed to load donation with ID ${id}`, 
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
          const mappedDonations = response.data.map(mapEventToDonationData)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error(`Error getting donations for user ${userId}:`, error)
          set({ 
            error: error.response?.data?.message || `Failed to load donations for user ${userId}`, 
            isLoading: false 
          })
          return []
        }
      },

      getDonationRequests: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getRequests()
          const mappedDonations = response.data.map(mapEventToDonationData)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donation requests:', error)
          set({ 
            error: error.response?.data?.message || 'Failed to load donation requests', 
            isLoading: false 
          })
          return []
        }
      },

      getDonationOffers: async () => {
        set({ isLoading: true, error: null })
        try {
          const response = await donationsService.getOffers()
          const mappedDonations = response.data.map(mapEventToDonationData)
          set({ isLoading: false })
          return mappedDonations
        } catch (error: any) {
          console.error('Error getting donation offers:', error)
          set({ 
            error: error.response?.data?.message || 'Failed to load donation offers', 
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
          return response.data
        } catch (error: any) {
          console.error('Error creating transaction:', error)
          set({ 
            error: error.response?.data?.message || 'Failed to create transaction', 
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
          return response.data
        } catch (error: any) {
          console.error(`Error getting transaction with ID ${transactionId}:`, error)
          set({ 
            error: error.response?.data?.message || `Failed to load transaction with ID ${transactionId}`, 
            isLoading: false 
          })
          return null
        }
      }
    }),
    {
      // Bump the key when you want to invalidate old persisted state in users' browsers
      name: 'donations-storage-v2'
    }
  )
)
