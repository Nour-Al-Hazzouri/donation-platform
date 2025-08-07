'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/donations/SearchSection"
import { DonationCards, donationsData, type DonationData } from "@/components/donations/DonationCards"

// Search function that filters donations based on multiple criteria
function searchDonations(donations: DonationData[], searchTerm: string): DonationData[] {
  if (!searchTerm.trim()) return donations
  
  const term = searchTerm.toLowerCase().trim()
  
  return donations.filter(donation => {
    // Search in title
    const titleMatch = donation.title.toLowerCase().includes(term)
    
    // Search in name
    const nameMatch = donation.name.toLowerCase().includes(term)
    
    // Search in description
    const descriptionMatch = donation.description.toLowerCase().includes(term)
    
    // Search for individual words in title (for partial matches)
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
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Filter donations based on search term
  const filteredDonations = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) {
      return donationsData
    }
    return searchDonations(donationsData, searchTerm)
  }, [searchTerm, isSearchActive])

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    // Auto-search as user types (debounced effect)
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
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchSection 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          resultsCount={filteredDonations.length}
        />

        {/* Clear Search Button */}
        {(searchTerm || isSearchActive) && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
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