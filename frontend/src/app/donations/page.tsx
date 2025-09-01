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
    imageUrl: event.image_full_urls?.[0] || undefined,
    avatarUrl: event.user?.avatar_url_full || event.user?.avatar_url || undefined,
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

export default function DonationsPage() {
  const [donations, setDonations] = useState<DonationData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Fetch directly from API - only get donation offers (type='offer')
  useEffect(() => {
    let mounted = true
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Only fetch donation offers (type='offer')
        const res = await donationsService.getOffers()
        // res.data is expected to be DonationEvent[]
        console.log(res.data)
        const mapped = (res.data || []).map((ev: any) => mapEventToDonationData(ev))
        console.log(mapped)
        if (!mounted) return
        setDonations(mapped)
      } catch (err: any) {
        console.error('Error fetching donations:', err)
        if (mounted) setError(err?.response?.data?.message ?? 'Failed to load donations')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [])

  const filteredDonations = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) return donations
    return searchDonations(donations, searchTerm)
  }, [donations, searchTerm, isSearchActive])
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredDonations.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = filteredDonations.slice(indexOfFirstPost, indexOfLastPost)
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsSearchActive(value.trim().length > 0)
    setCurrentPage(1) // Reset to first page on new search
  }

  const handleSearchSubmit = () => setIsSearchActive(true)
  const clearSearch = () => { 
    setSearchTerm('') 
    setIsSearchActive(false)
    setCurrentPage(1) // Reset to first page when clearing search
  }

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchSection
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          resultsCount={filteredDonations.length}
        />

        {(searchTerm || isSearchActive) && (
          <div className="flex justify-center mb-6">
            <button
              onClick={clearSearch}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Clear search and show all donations
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading donations…</div>
        ) : error ? (
          <div className="text-center py-12 text-destructive">{error}</div>
        ) : (
          <>
            <DonationCards donations={currentPosts} searchTerm={isSearchActive ? searchTerm : ''} />
            
            {/* Pagination */}
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </>
        )}
      </main>
    </MainLayout>
  )
}
