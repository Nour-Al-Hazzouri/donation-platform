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
  };
  related_user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
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
  // List notifications for both admin and normal users
  list: async (params?: {
    type?: string;
    unread_only?: boolean;
    per_page?: number;
    page?: number;
  }): Promise<NotificationsResponse> => {
    const response = await authApi.get('/notifications', { params });
    // Always return an object with data array for consistency
    if (Array.isArray(response.data)) {
      return { data: response.data };
    }
    return response.data;
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await authApi.get('/notifications/unread-count');
    return response.data;
  },

  getTypes: async (): Promise<{ data: NotificationType[] }> => {
    const response = await authApi.get('/notifications/types');
    return response.data;
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