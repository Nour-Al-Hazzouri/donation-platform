"use client"

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DonationEvent } from '@/lib/api/donations'
import donationsService from '@/lib/api/donations'

interface EventSelectorProps {
  onSelect: (eventId: string | null) => void
  selectedEventId?: string | null
  placeholder?: string
}

export function EventSelector({ 
  onSelect, 
  selectedEventId = null,
  placeholder = "Select an event..."
}: EventSelectorProps) {
  const [open, setOpen] = useState(false)
  const [events, setEvents] = useState<DonationEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<DonationEvent | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const response = await donationsService.getAllEvents({
          status: 'active' // Only show active events
        })
        setEvents(response.data)
        
        // If there's a selectedEventId, find and set the selected event
        if (selectedEventId) {
          const event = response.data.find(e => e.id.toString() === selectedEventId)
          if (event) setSelectedEvent(event)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [selectedEventId])

  return (
    <div className="relative">
      <div className="w-full">
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={loading}
          onClick={() => setOpen(!open)}
        >
          {selectedEvent ? selectedEvent.title : placeholder}
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </div>
      
      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            <input
              className="w-full rounded-md border border-gray-300 px-3 py-2 mb-2"
              placeholder="Search events..."
              onChange={(e) => {
                // Implement search filtering if needed
              }}
            />
            
            {events.length === 0 && (
              <div className="py-2 px-3 text-center text-sm text-gray-500">
                No events found.
              </div>
            )}
            
            {events.map((event) => (
              <div
                key={event.id}
                className={`flex items-start px-3 py-2 rounded-md cursor-pointer ${selectedEvent?.id === event.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => {
                  setSelectedEvent(event)
                  onSelect(event.id.toString())
                  setOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span className="font-medium">{event.title}</span>
                  <span className="text-xs text-gray-500">
                    {event.type === 'request' ? 'Request' : 'Offer'} • 
                    {event.goal_amount} {event.unit}
                  </span>
                </div>
              </div>
            ))}
            
            <div 
              className="border-t mt-1 py-2 text-center text-sm font-medium text-gray-500 cursor-pointer hover:bg-gray-50 rounded-md"
              onClick={() => {
                setSelectedEvent(null)
                onSelect(null)
                setOpen(false)
              }}
            >
              Clear selection
            </div>
          </div>
        </div>
      )}
    </div>
  )
}