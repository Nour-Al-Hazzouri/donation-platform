'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/donations/SearchSection"
import { DonationCards } from "@/components/donations/DonationCards"
import { useDonationsStore, initialDonationsData, DonationData } from "@/store/donationsStore"

function searchDonations(donations: DonationData[], searchTerm: string): DonationData[] {
  if (!searchTerm.trim()) return donations
  
  const term = searchTerm.toLowerCase().trim()
  
  return donations.filter(donation => {
    const titleMatch = donation.title.toLowerCase().includes(term)
    const nameMatch = donation.name.toLowerCase().includes(term)
    const descriptionMatch = donation.description.toLowerCase().includes(term)
    
    const titleWords = donation.title.toLowerCase().split(' ')
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
  const searchParams = useSearchParams()
  const { donations, initializeDonations } = useDonationsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  useEffect(() => {
    initializeDonations(initialDonationsData)
  }, [initializeDonations])

  const filteredDonations = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) {
      return donations
    }
    return searchDonations(donations, searchTerm)
  }, [donations, searchTerm, isSearchActive])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (value.trim()) {
      setIsSearchActive(true)
    } else {
      setIsSearchActive(false)
    }
  }

  const handleSearchSubmit = () => {
    setIsSearchActive(true)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setIsSearchActive(false)
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

        <DonationCards 
          donations={filteredDonations} 
          searchTerm={isSearchActive ? searchTerm : ''}
        />
      </main>
    </MainLayout>
  )
}
