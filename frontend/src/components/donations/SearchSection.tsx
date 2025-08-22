'use client'

import { useRouter } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'

interface SearchSectionProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  resultsCount: number
}

export function SearchSection({ 
  searchTerm, 
  onSearchChange, 
  onSearchSubmit, 
  resultsCount 
}: SearchSectionProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchSubmit()
  }

  const handleAddDonation = () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    router.push('/add-donation')
  }

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-2">Latest Donations</h1>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-6">Browse available medication donations or add your own to help those in need</p>
      
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="flex justify-center items-center max-w-md mx-auto mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search Donations..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border-border focus:border-primary focus:ring-primary"
          />
        </div>
        <Button 
          type="submit"
          className="ml-3 bg-red-500 hover:bg-red-600 text-white px-6"
        >
          Search
        </Button>
      </form>
      
      {/* Add Donation Button */}
      <div className="flex justify-end mb-8">
        <Button 
          onClick={handleAddDonation}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Donation
        </Button>
      </div>

      {searchTerm && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {resultsCount > 0 
              ? `Found ${resultsCount} donation${resultsCount !== 1 ? 's' : ''} for "${searchTerm}"`
              : `No results found for "${searchTerm}"`
            }
          </p>
        </div>
      )}
    </div>
  )
}