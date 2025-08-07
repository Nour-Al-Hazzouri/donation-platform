'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/requests/SearchSection"
import { RequestCards, requestsData, type RequestData } from "@/components/requests/RequestCards"

// Search function that filters requests based on multiple criteria
function searchRequests(requests: RequestData[], searchTerm: string): RequestData[] {
  if (!searchTerm.trim()) return requests
  
  const term = searchTerm.toLowerCase().trim()
  
  return requests.filter(request => {
    // Search in title
    const titleMatch = request.title.toLowerCase().includes(term)
    
    // Search in name
    const nameMatch = request.name.toLowerCase().includes(term)
    
    // Search in description
    const descriptionMatch = request.description.toLowerCase().includes(term)
    
    // Search for individual words in title (for partial matches)
    const titleWords = request.title.toLowerCase().split(' ')
    const searchWords = term.split(' ')
    const wordMatch = searchWords.some(searchWord => 
      titleWords.some(titleWord => 
        titleWord.includes(searchWord) || searchWord.includes(titleWord)
      )
    )
    
    return titleMatch || nameMatch || descriptionMatch || wordMatch
  })
}

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) {
      return requestsData
    }
    return searchRequests(requestsData, searchTerm)
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
          resultsCount={filteredRequests.length}
        />

        {/* Clear Search Button */}
        {(searchTerm || isSearchActive) && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear search and show all requests
            </button>
          </div>
        )}

        <RequestCards 
          requests={filteredRequests} 
          searchTerm={isSearchActive ? searchTerm : ''}
        />
      </main>
    </MainLayout>
  )
}
