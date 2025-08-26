'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from "@/components/layouts/MainLayout"
import { SearchSection } from "@/components/requests/SearchSection"
import { RequestCards } from "@/components/requests/RequestCards"
import { Pagination } from "@/components/ui/Pagination"
import requestsService, { RequestEvent } from '@/lib/api/requests'

function searchRequests(requests: RequestEvent[], searchTerm: string): RequestEvent[] {
  if (!searchTerm.trim()) return requests
  
  const term = searchTerm.toLowerCase().trim()
  
  return requests.filter(request => {
    const titleMatch = request.title.toLowerCase().includes(term)
    const nameMatch = request.user.username.toLowerCase().includes(term)
    const descriptionMatch = request.description.toLowerCase().includes(term)
    
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
  const [requests, setRequests] = useState<RequestEvent[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  // Load requests from API with pagination
  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true)
      try {
        const res = await requestsService.getAllRequests(currentPage, postsPerPage)
        setRequests(res.data)
        setTotalPages(res.meta.last_page)
      } catch (error) {
        console.error('Error loading requests:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadRequests()
  }, [currentPage, postsPerPage])

  // Show success message if request just created
  useEffect(() => {
    if (searchParams.get('success') === 'request-created') {
      setShowSuccessMessage(true)
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const filteredRequests = useMemo(() => {
    if (!isSearchActive && !searchTerm.trim()) return requests
    return searchRequests(requests, searchTerm)
  }, [requests, searchTerm, isSearchActive])
  
  // State for total pages from API
  const [totalPages, setTotalPages] = useState(1)
  
  // Get current posts based on pagination and search
  const currentPosts = useMemo(() => {
    if (isSearchActive || searchTerm.trim()) {
      // If searching, use client-side pagination on filtered results
      const indexOfLastPost = currentPage * postsPerPage
      const indexOfFirstPost = indexOfLastPost - postsPerPage
      return filteredRequests.slice(indexOfFirstPost, indexOfLastPost)
    }
    // Otherwise use the server-paginated results directly
    return requests
  }, [requests, filteredRequests, currentPage, postsPerPage, isSearchActive, searchTerm])
  
  const handlePageChange = (pageNumber: number) => {
    // If searching, just update the page locally
    // If not searching, this will trigger a new API call via the useEffect
    setCurrentPage(pageNumber)
    
    // Clear search when changing pages if not in search mode
    if (!isSearchActive && !searchTerm) {
      setSearchTerm('')
      setIsSearchActive(false)
    }
    
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setIsSearchActive(value.trim().length > 0)
    setCurrentPage(1)
  }

  const handleSearchSubmit = () => setIsSearchActive(true)

  const clearSearch = () => {
    setSearchTerm('')
    setIsSearchActive(false)
  }

  if (isLoading) {
    return (
      <MainLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading requests...</p>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {showSuccessMessage && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded mx-4 mt-4">
          <div className="flex">
            <div className="py-1">
              <svg 
                className="fill-current h-6 w-6 text-green-500 mr-4" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20"
              >
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        <SearchSection 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          resultsCount={filteredRequests.length}
        />

        {(searchTerm || isSearchActive) && (
          <div className="flex justify-center mb-6">
            <button 
              onClick={clearSearch}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Clear search and show all requests
            </button>
          </div>
        )}

        {/* Request Cards */}
        <RequestCards 
          requests={currentPosts.map(r => ({
            id: r.id,
            name: `${r.user.first_name} ${r.user.last_name}`,
            title: r.title,
            description: r.description,
            imageUrl: r.image_urls?.[0] ?? undefined,
            avatarUrl: r.user.avatar_url ?? undefined,
            initials: r.user.first_name.charAt(0) + r.user.last_name.charAt(0),
            isVerified: false,
            goalAmount: r.goal_amount.toString(),
            currentAmount: r.current_amount
          }))}
          searchTerm={isSearchActive ? searchTerm : ''}
        />
        
        {/* Pagination */}
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      </main>
    </MainLayout>
  )
}
