'use client'

import { useState, useMemo, useEffect } from 'react'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/donations/SearchSection"
import { DonationCards } from "@/components/donations/DonationCards"
import { Pagination } from "@/components/ui/Pagination"
import donationsService from '@/lib/api/donations' // direct API service

// Minimal local Donation type (matches your UI's needs)
type DonationData = {
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
  location?: { id: number; governorate: string; district: string } | null
}

function mapEventToDonationData(event: any): DonationData {
  return {
    id: event.id,
    name: `${event.user?.first_name ?? ''} ${event.user?.last_name ?? ''}`.trim(),
    title: event.title,
    description: event.description,
    imageUrl: event.image_urls?.[0] || undefined,
    avatarUrl: event.user?.avatar_url || undefined,
    initials: (event.user?.first_name?.[0] ?? '?') + (event.user?.last_name?.[0] ?? '?'),
    isVerified: true,
    createdAt: event.created_at,
    goalAmount: Number(event.goal_amount) || 0,
    currentAmount: Number(event.current_amount) || 0,
    possibleAmount: Number(event.possible_amount) || 0,
    unit: event.unit,
    type: event.type,
    status: event.status,
    userId: event.user?.id,
    locationId: event.location?.id,
    location: event.location ?? null
  }
}

function searchDonations(donations: DonationData[], searchTerm: string): DonationData[] {
  if (!searchTerm.trim()) return donations

  const term = searchTerm.toLowerCase().trim()

  return donations.filter(donation => {
    const title = donation.title ?? ''
    const name = donation.name ?? ''
    const description = donation.description ?? ''

    const titleMatch = title.toLowerCase().includes(term)
    const nameMatch = name.toLowerCase().includes(term)
    const descriptionMatch = description.toLowerCase().includes(term)

    const titleWords = title.toLowerCase().split(' ')
    const searchWords = term.split(' ')
    const wordMatch = searchWords.some(searchWord =>
      titleWords.some(titleWord =>
        titleWord.includes(searchWord) || searchWord.includes(titleWord)
      )
    )

    return titleMatch || nameMatch || descriptionMatch || wordMatch
  })
}

export default function DonationsClient() {
  const [donations, setDonations] = useState<DonationData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Fetch directly from API
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await donationsService.getAllEvents()
        // res.data is expected to be DonationEvent[]
        if (mounted) {
          const mappedDonations = res.data.map(mapEventToDonationData)
          setDonations(mappedDonations)
        }
      } catch (err) {
        console.error('Failed to fetch donations:', err)
        if (mounted) {
          setError('Failed to load donations. Please try again later.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  // Filter donations based on search term
  const filteredDonations = useMemo(() => {
    return searchDonations(donations, searchTerm)
  }, [donations, searchTerm])

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredDonations.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(filteredDonations.length / postsPerPage)

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setIsSearchActive(!!term)
    setCurrentPage(1) // Reset to first page on new search
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Donations</h1>
          <p className="text-muted-foreground">
            Browse through donation requests and offers from our community
          </p>
        </div>

        <SearchSection 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={() => setIsSearchActive(true)}
          resultsCount={filteredDonations.length}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <DonationCards donations={currentPosts} searchTerm={searchTerm} />

            {filteredDonations.length > 0 ? (
              <div className="mt-8 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-lg">
                  {isSearchActive
                    ? "No donations match your search criteria."
                    : "No donations available at the moment."}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  )
}