'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/requests/SearchSection"
import { RequestCards } from "@/components/requests/RequestCards"
import { useRequestsStore, initialRequestsData, type RequestData } from "@/lib/store/requestsStore"

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
  const searchParams = useSearchParams()
  const { requests, initializeRequests } = useRequestsStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Initialize requests store with initial data on first load
  useEffect(() => {
    initializeRequests(initialRequestsData)
  }, [initializeRequests])

  // Check for success message
  useEffect(() => {
    if (searchParams.get('success') === 'request-created') {
      setShowSuccessMessage(true)
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Filter requests based on search term
  const filteredRequests = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) {
      return requests
    }
    return searchRequests(requests, searchTerm)
  }, [requests, searchTerm, isSearchActive])

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
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mx-4 mt-4">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Request Created Successfully!</p>
              <p className="text-sm">Your donation request has been published and is now visible to potential donors.</p>
            </div>
          </div>
        </div>
      )}

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
