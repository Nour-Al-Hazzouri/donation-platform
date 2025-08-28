import { authApi } from './auth';
import { PaginatedResponse } from '@/types';

export interface RequestEvent {
  id: number;
  title: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  possible_amount: number;
  type: 'request';
  status: 'active' | 'fulfilled' | 'expired' | 'cancelled';
  image_urls: string[];
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

export interface CreateRequestData {
  title: string;
  description: string;
  goal_amount: number;
  unit: string;
  end_date: string;
  location_id: number;
  image_urls?: File[];
}

const requestsService = {
  // List all active donation requests with pagination support
  getAllRequests: async (page: number = 1, perPage: number = 9): Promise<PaginatedResponse<RequestEvent>> => {
    const response = await authApi.get('/donation-events/requests', {
      params: { page, per_page: perPage }
    });
    return response.data;
  },

  // Get a specific request by ID
  getRequestById: async (requestId: number): Promise<{ data: RequestEvent }> => {
    const response = await authApi.get(`/donation-events/${requestId}`);
    return response.data;
  },

  // Create a new donation request
  createRequest: async (data: CreateRequestData): Promise<{ data: RequestEvent }> => {
    const formData = new FormData();
    
    // Append fields except images
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image_urls') formData.append(key, String(value));
    });

    // Append images if any
    if (data.image_urls && data.image_urls.length > 0) {
      data.image_urls.forEach((file, index) => {
        formData.append(`image_urls[${index}]`, file);
      });
    }

    const response = await authApi.post('/donation-events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
  },

  // Update an existing request
  updateRequest: async (
    requestId: number,
    data: Partial<CreateRequestData>
  ): Promise<{ data: RequestEvent }> => {
    const response = await authApi.put(`/donation-events/${requestId}`, data);
    return response.data;
  },

  // List transactions for a specific request
  getRequestTransactions: async (
    requestId: number
  ): Promise<{ data: any[]; meta: any }> => {
    const response = await authApi.get(`/donation-events/${requestId}/transactions`);
    return response.data;
  },

  // Create a transaction for a request
  createTransaction: async (requestId: number, amount: number) => {
    const response = await authApi.post(`/donation-events/${requestId}/transactions`, { amount });
    return response.data;
  },

  // Get a specific transaction
  getTransaction: async (transactionId: number) => {
    const response = await authApi.get(`/donation-transactions/${transactionId}`);
    return response.data;
  },

  // Update transaction status
  updateTransactionStatus: async (transactionId: number, status: 'approved' | 'declined') => {
    const response = await authApi.put(`/donation-transactions/${transactionId}/status`, { status });
    return response.data;
  },
};

export default requestsService;
