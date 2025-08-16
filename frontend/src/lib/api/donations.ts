// src/lib/api/donations.ts
import axios from 'axios';
import { authApi } from './auth';

export interface DonationEvent {
  id: number;
  title: string;
  description: string;
  type: 'request' | 'offer';
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  goal_amount: number;
  current_amount: number;
  possible_amount: number;
  unit: string;
  start_date: string;
  end_date: string;
  image_urls: string[];
  image_full_urls?: string[]; // computed full urls
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  location: {
    id: number;
    governorate: string;
    district: string;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface DonationTransaction {
  id: number;
  transaction_type: 'contribution' | 'claim';
  amount: number;
  status: 'pending' | 'approved' | 'declined';
  transaction_at: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  };
  event?: {
    id: number;
    title: string;
    type: 'request' | 'offer';
  };
}

export interface CreateDonationEventData {
  title: string;
  description: string;
  type: 'request' | 'offer';
  goal_amount: number;
  unit: string;
  end_date: string;
  location_id: number;
  image_urls?: File[];
}

export interface CreateDonationTransactionData {
  amount: number;
}

const buildFullImageUrls = (imagePaths: string[] | undefined): string[] => {
  if (!imagePaths || imagePaths.length === 0) return [];
  // prefer axios instance baseURL, fallback to env var
  const base = authApi.defaults.baseURL || process.env.NEXT_PUBLIC_API_URL || '';
  return imagePaths.map((p) => {
    // if already absolute URL, return as-is
    try {
      const url = new URL(p);
      return url.href;
    } catch (e) {
      // relative path -> join with base (ensure no double slashes)
      if (!base) return p;
      return `${base.replace(/\/$/, '')}/${p.replace(/^\//, '')}`;
    }
  });
};

const handle404AsEmptyList = (err: any) => {
  if (err?.response?.status === 404) {
    return { data: [], meta: {} };
  }
  throw err;
};

const donationsService = {
  // Get all donation events with optional filters
  getAllEvents: async (params?: {
    type?: 'request' | 'offer';
    status?: 'active' | 'fulfilled' | 'expired' | 'cancelled';
    location_id?: number;
    page?: number;
  }): Promise<{ data: DonationEvent[]; meta: any }> => {
    try {
      const response = await authApi.get('/donation-events', { params });
      const payload = response.data;
      if (Array.isArray(payload?.data)) {
        payload.data = payload.data.map((ev: DonationEvent) => ({
          ...ev,
          image_full_urls: buildFullImageUrls(ev.image_urls),
        }));
      }
      return payload;
    } catch (err) {
      return handle404AsEmptyList(err);
    }
  },

  // Get donation requests
  getRequests: async (params?: { page?: number }): Promise<{ data: DonationEvent[]; meta: any }> => {
    try {
      const response = await authApi.get('/donation-events/requests', { params });
      const payload = response.data;
      if (Array.isArray(payload?.data)) {
        payload.data = payload.data.map((ev: DonationEvent) => ({
          ...ev,
          image_full_urls: buildFullImageUrls(ev.image_urls),
        }));
      }
      return payload;
    } catch (err) {
      return handle404AsEmptyList(err);
    }
  },

  // Get donation offers
  getOffers: async (params?: { page?: number }): Promise<{ data: DonationEvent[]; meta: any }> => {
    try {
      const response = await authApi.get('/donation-events/offers', { params });
      const payload = response.data;
      if (Array.isArray(payload?.data)) {
        payload.data = payload.data.map((ev: DonationEvent) => ({
          ...ev,
          image_full_urls: buildFullImageUrls(ev.image_urls),
        }));
      }
      return payload;
    } catch (err) {
      return handle404AsEmptyList(err);
    }
  },

  // Get donation events for a specific user
  getUserEvents: async (userId: number, params?: { page?: number }): Promise<{ data: DonationEvent[]; meta: any }> => {
    const response = await authApi.get(`/donation-events/user/${userId}`, { params });
    const payload = response.data;
    if (Array.isArray(payload?.data)) {
      payload.data = payload.data.map((ev: DonationEvent) => ({
        ...ev,
        image_full_urls: buildFullImageUrls(ev.image_urls),
      }));
    }
    return payload;
  },

  // Get a specific donation event by ID
  // NOTE: returns `null` when the API returns 404 (so UI can handle 'not found' gracefully)
  getEvent: async (eventId: number): Promise<{ data: DonationEvent } | null> => {
    try {
      const response = await authApi.get(`/donation-events/${eventId}`);
      const payload = response.data;
      if (payload?.data) {
        payload.data.image_full_urls = buildFullImageUrls(payload.data.image_urls);
      }
      return payload;
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // not found -> return null (safe for callers)
        return null;
      }
      // rethrow other errors
      throw err;
    }
  },

  // Create a new donation event
  createEvent: async (data: CreateDonationEventData): Promise<{ data: DonationEvent }> => {
    const formData = new FormData();

    // Add all text fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image_urls') {
        formData.append(key, String(value));
      }
    });

    // Add image files if any
    if (data.image_urls && data.image_urls.length > 0) {
      data.image_urls.forEach((file, index) => {
        formData.append(`image_urls[${index}]`, file);
      });
    }

    const response = await authApi.post('/donation-events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  // Get transactions for a specific donation event
  getEventTransactions: async (
    eventId: number,
    params?: {
      page?: number;
      status?: 'pending' | 'approved' | 'declined';
      type?: 'contribution' | 'claim';
    }
  ): Promise<{ data: DonationTransaction[]; meta: any }> => {
    const response = await authApi.get(`/donation-events/${eventId}/transactions`, { params });
    return response.data;
  },

  // Create a new transaction for a donation event
  createTransaction: async (
    eventId: number,
    data: CreateDonationTransactionData
  ): Promise<{ data: DonationTransaction }> => {
    const response = await authApi.post(`/donation-events/${eventId}/transactions`, data);
    return response.data;
  },

  // Get a specific transaction by ID
  getTransaction: async (transactionId: number): Promise<{ data: DonationTransaction }> => {
    const response = await authApi.get(`/donation-transactions/${transactionId}`);
    return response.data;
  },

  // Update a transaction status (for event owners)
  updateTransactionStatus: async (
    transactionId: number,
    status: 'approved' | 'declined'
  ): Promise<{ data: DonationTransaction }> => {
    const response = await authApi.put(`/donation-transactions/${transactionId}/status`, { status });
    return response.data;
  },
};

export default donationsService;
