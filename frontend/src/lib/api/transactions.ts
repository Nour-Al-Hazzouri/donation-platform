// src/lib/api/transactions.ts
import { authApi } from './auth';

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

export interface CreateTransactionPayload {
  amount: number;
}

/**
 * Helper to unwrap server responses that may be either:
 * - { data: {...}, message?: '...' }
 * - {...} (already the object)
 */
function unwrap<T>(res: any): T {
  if (!res) throw new Error('Empty response');
  if (typeof res === 'object' && 'data' in res && res.data !== undefined) {
    return res.data as T;
  }
  // fallback: assume res is already the object
  return res as T;
}

const transactionsApi = {
  /**
   * Create a transaction for a donation event and return the created DonationTransaction.
   * Accepts server shapes and unwraps them to return DonationTransaction.
   */
  async createTransaction(eventId: number, payload: CreateTransactionPayload): Promise<DonationTransaction> {
    const res = await authApi.post(`/donation-events/${eventId}/transactions`, payload);
    return unwrap<DonationTransaction>(res.data ?? res);
  },

  /**
   * List transactions for an event — returns the unwrapped array and optional meta
   */
  async getEventTransactions(
    eventId: number,
    params?: { page?: number; status?: 'pending' | 'approved' | 'declined'; type?: 'contribution' | 'claim' }
  ): Promise<{ data: DonationTransaction[]; meta?: any }> {
    const res = await authApi.get(`/donation-events/${eventId}/transactions`, { params });
    // server likely returns { data: [...], meta: {...} }
    const payload = res.data ?? res;
    return {
      data: (payload.data ?? payload) as DonationTransaction[],
      meta: payload.meta,
    };
  },

  /**
   * Get a single transaction (returns DonationTransaction)
   */
  async getTransaction(transactionId: number): Promise<DonationTransaction> {
    const res = await authApi.get(`/donation-transactions/${transactionId}`);
    return unwrap<DonationTransaction>(res.data ?? res);
  },

  /**
   * Update transaction status (returns DonationTransaction)
   */
  async updateTransactionStatus(transactionId: number, status: 'approved' | 'declined'): Promise<DonationTransaction> {
    const res = await authApi.put(`/donation-transactions/${transactionId}/status`, { status });
    return unwrap<DonationTransaction>(res.data ?? res);
  },
};

export default transactionsApi;
