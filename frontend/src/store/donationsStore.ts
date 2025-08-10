'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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
  goalAmount?: number       // Added
  currentAmount?: number    // Added
}

interface DonationsState {
  donations: DonationData[]
  addDonation: (donation: Omit<DonationData, 'id'>) => void
  getDonations: () => DonationData[]
  initializeDonations: (initialDonations: DonationData[]) => void
}

// Initial mock data
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

export const useDonationsStore = create<DonationsState>()(
  persist(
    (set, get) => ({
      donations: [],

      initializeDonations: (initialDonations) => {
        const currentDonations = get().donations
        if (currentDonations.length === 0) {
          set({ donations: initialDonations })
        }
      },

      addDonation: (newDonation) => {
        const currentDonations = get().donations
        const newId =
          Math.max(...currentDonations.map((d) => d.id), 0) + 1

        const donationWithId: DonationData = {
          ...newDonation,
          id: newId,
          createdAt: new Date().toISOString()
        }

        set({ donations: [donationWithId, ...currentDonations] })
      },

      getDonations: () => {
        const currentDonations = get().donations
        return currentDonations.length > 0 ? currentDonations : initialDonationsData
      }
    }),
    {
      name: 'donations-storage'
    }
  )
)