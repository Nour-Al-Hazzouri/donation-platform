// frontend/src/lib/api/admin.ts
import { authApi } from '@/lib/api/auth'; // adjust path if needed

export type RecentTransaction = {
  id: number;
  amount: number;
  user: string;
  event: string;
  transaction_type: string;
  status: string;
  created_at: string;
};

export type StatisticsData = {
  total_users: number;
  total_donation_events: number;
  total_donation_requests: number;
  total_donation_offers: number;
  total_transactions: number;
  total_transaction_contributions: number;
  total_transaction_claims: number;
  total_amount_donated: number;
  active_donation_events: number;
  recent_transactions: RecentTransaction[];
};

export const adminApi = {
  async getStatistics(): Promise<StatisticsData> {
    // authApi.baseURL already points to .../api
    const res = await authApi.get<{ success: boolean; data: StatisticsData }>('/statistics');
    if (!res.data || !res.data.success) {
      throw new Error('Invalid statistics response from server');
    }
    return res.data.data;
  },

  // add other admin endpoints here
};
