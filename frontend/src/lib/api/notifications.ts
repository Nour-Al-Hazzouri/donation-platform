// frontend/src/lib/api/notifications.ts
import { authApi } from './auth';

export interface Notification {
  id: string;
  title: string;
  message: string;
  data?: {
    amount?: number;
    currency?: string;
    user_id?: number;
    event_id?: number;
    event_type?: string;
    post_id?: number;
    comment_id?: number;
    isAdmin?: boolean;
  };
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  type: {
    id: number;
    name: string;
    description: string;
  };
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    isAdmin?: boolean;
  };
  related_user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    isAdmin?: boolean;
  };
}

export interface NotificationType {
  id: number;
  name: string;
  description: string;
}

export interface NotificationsResponse {
  success?: boolean;
  data: Notification[];
  links?: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  message?: string;
}

export interface UnreadCountResponse {
  unread_count: number;
}

const notificationService = {
  list: async (params?: {
    type?: string;
    unread_only?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<NotificationsResponse> => {
    try {
      const response = await authApi.get('/notifications', { params });
      
      // Normalize the response data structure
      let normalizedData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      
      // Process each notification
      normalizedData = normalizedData.map((notif: Notification) => {
        // Ensure related_user exists
        if (!notif.related_user && notif.data?.user_id) {
          notif.related_user = {
            id: notif.data.user_id,
            username: '',
            first_name: '',
            last_name: '',
            avatar: null
          };
        }

        // Set isAdmin flags
        if (notif.related_user) {
          notif.related_user.isAdmin = notif.related_user.isAdmin || 
            notif.related_user.username?.toLowerCase() === "admin" || 
            notif.related_user.first_name?.toLowerCase() === "admin";
        }
        
        if (notif.user) {
          notif.user.isAdmin = notif.user.isAdmin || 
            notif.user.username?.toLowerCase() === "admin" || 
            notif.user.first_name?.toLowerCase() === "admin";
        }

        // Normalize type names for donations/requests
        if (notif.type) {
          if (['donation', 'contribution'].some(t => notif.type.name.toLowerCase().includes(t))) {
            notif.type.name = 'donation_contribution';
          } else if (['request', 'claim'].some(t => notif.type.name.toLowerCase().includes(t))) {
            notif.type.name = 'donation_claim';
          }
        }

        return notif;
      });

      // Return consistent response structure
      return {
        data: normalizedData,
        meta: response.data?.meta || {
          current_page: 1,
          last_page: 1,
          per_page: params?.per_page || 10,
          total: normalizedData.length
        }
      };
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return { data: [], message: 'Failed to fetch notifications' };
    }
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      const response = await authApi.get('/notifications/unread-count');
      return { unread_count: response.data?.unread_count || 0 };
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return { unread_count: 0 };
    }
  },

  getTypes: async (): Promise<{ data: NotificationType[] }> => {
    const response = await authApi.get('/notifications/types');
    return { data: response.data || [] };
  },

  markAsRead: async (notificationId: string): Promise<{ message: string; data: Notification }> => {
    const response = await authApi.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<{ message: string }> => {
    const response = await authApi.put('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (notificationId: string): Promise<{ message: string }> => {
    const response = await authApi.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  deleteAll: async (): Promise<{ message: string }> => {
    const response = await authApi.delete('/notifications');
    return response.data;
  },

  deleteRead: async (): Promise<{ message: string }> => {
    const response = await authApi.delete('/notifications/read');
    return response.data;
  },

  deleteUnread: async (): Promise<{ message: string }> => {
    const response = await authApi.delete('/notifications/unread');
    return response.data;
  },
};

export { notificationService };