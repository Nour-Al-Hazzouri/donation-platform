'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { RequestEvent } from '@/lib/api/requests'

export interface RequestData {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified: boolean
  goalAmount: string
  currentAmount: number
  possibleAmount: number
  unit?: string
  type: 'request'
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled'
  userId?: number
  locationId?: number
  createdAt?: string
  endDate?: string
  location?: {
    id: number
    governorate: string
    district: string
  } | null
}

// Helper function to convert API RequestEvent to RequestData
const mapEventToRequestData = (event: RequestEvent | null): RequestData | undefined => {
  if (!event) {
    console.warn('Attempted to map null or undefined event to RequestData');
    return undefined;
  }

  if (!event.user) {
    console.warn(`Event ID ${event.id} has missing user data`);
    return {
      id: event.id,
      name: 'Unknown User',
      title: event.title || 'Untitled Request',
      description: event.description || '',
      initials: 'UN',
      isVerified: false,
      goalAmount: event.goal_amount?.toString() || '0',
      currentAmount: event.current_amount || 0,
      possibleAmount: event.possible_amount || 0,
      type: 'request',
      status: event.status,
      createdAt: event.created_at
    };
  }

  return {
    id: event.id,
    name: `${event.user.first_name || ''} ${event.user.last_name || ''}`.trim() || 'Unknown User',
    title: event.title || 'Untitled Request',
    description: event.description || '',
    imageUrl: event.image_full_urls?.[0] || event.image_urls?.[0],
    avatarUrl: event.user.avatar_url || undefined,
    initials: `${event.user.first_name?.[0] ?? ''}${event.user.last_name?.[0] ?? ''}` || 'UN',
    isVerified: true,
    goalAmount: event.goal_amount?.toString() || '0',
    currentAmount: event.current_amount || 0,
    possibleAmount: event.possible_amount || 0,
    type: 'request',
    status: event.status,
    userId: event.user.id,
    locationId: event.location?.id,
    location: event.location || null,
    createdAt: event.created_at
  };
}

interface RequestsState {
  requests: RequestData[]
  isLoading: boolean
  error: string | null
  addRequest: (request: Omit<RequestData, 'id' | 'currentAmount' | 'possibleAmount' | 'status' | 'type'>) => void
  updateRequestCurrentAmount: (requestId: number, amount: number) => void
  getRequests: () => RequestData[]
  initializeRequests: (initialRequests: RequestData[]) => void
  replaceRequest: (event: RequestEvent) => void
}

// Initial mock data (from legacy store) - REMOVED FOR API-ONLY VERSION

export const useRequestsStore = create<RequestsState>()(
  persist(
    (set, get) => ({
      requests: [],
      isLoading: false,
      error: null,
      
      addRequest: (newRequest) => {
        set((state) => ({
          requests: [
            ...state.requests,
            {
              ...newRequest,
              id: Math.max(0, ...state.requests.map((r) => r.id)) + 1,
              currentAmount: 0,
              possibleAmount: 0,
              type: 'request',
              status: 'active',
            } as RequestData,
          ],
        }))
      },

      updateRequestCurrentAmount: (requestId, amount) => {
        set((state) => ({
          requests: state.requests.map((request) =>
            request.id === requestId ? { ...request, currentAmount: amount } : request
          ),
        }))
      },
      
      getRequests: () => {
        return get().requests
      },

      initializeRequests: (initialRequests) => {
        set({ requests: initialRequests })
      },

      replaceRequest: (event) => {
        const mappedRequest = mapEventToRequestData(event);
        if (!mappedRequest) return;

        set((state) => {
          const exists = state.requests.some(r => r.id === event.id);
          if (exists) {
            return {
              requests: state.requests.map(r => 
                r.id === event.id ? { ...mappedRequest } : r
              )
            };
          } else {
            return {
              requests: [...state.requests, mappedRequest]
            };
          }
        });
      }
    }),
    {
      name: 'requests-storage'
    }
  )
)