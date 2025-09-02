// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\lib\api\blogs.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Create a basic axios instance without auth interceptors for public requests
const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Create an authenticated axios instance for protected requests
const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth interceptor only to the authenticated instance
authApi.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.state?.user?.token) {
          config.headers['Authorization'] = `Bearer ${parsedToken.state.user.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  image_urls?: string[];
  image_full_urls?: string[];
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  image_urls?: File[];
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  priority?: 'low' | 'medium' | 'high';
  image_urls?: File[];
  remove_image_urls?: string[];
}

const blogService = {
  // Get all announcements (blogs) - public access
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    priority?: string;
  }): Promise<{ data: Announcement[] }> => {
    try {
      // First try with public API
      const response = await publicApi.get('/announcements', { params });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // If public access fails with 401, try with authenticated API
        try {
          const authResponse = await authApi.get('/announcements', { params });
          return authResponse.data;
        } catch (authError) {
          console.error('Error fetching announcements:', authError);
          throw authError;
        }
      }
      console.error('Error fetching announcements:', error);
      throw error;
    }
  },

  // Get a single announcement (blog) - public access
  getById: async (id: number): Promise<Announcement> => {
    try {
      // First try with public API
      const response = await publicApi.get(`/announcements/${id}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // If public access fails with 401, try with authenticated API
        try {
          const authResponse = await authApi.get(`/announcements/${id}`);
          return authResponse.data.data;
        } catch (authError) {
          console.error('Error fetching announcement:', authError);
          throw authError;
        }
      }
      console.error('Error fetching announcement:', error);
      throw error;
    }
  },

  // Create/Update/Delete operations remain authenticated-only
  create: async (data: CreateAnnouncementData): Promise<Announcement> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('priority', data.priority);
    
    if (data.image_urls) {
      data.image_urls.forEach((file) => {
        formData.append('image_urls[]', file);
      });
    }

    try {
      const response = await authApi.post('/announcements', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating announcement:', error);
      throw error;
    }
  },

  update: async (id: number, data: UpdateAnnouncementData): Promise<Announcement> => {
    const formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.content) formData.append('content', data.content);
    if (data.priority) formData.append('priority', data.priority);
    
    if (data.image_urls) {
      data.image_urls.forEach((file) => {
        formData.append('image_urls[]', file);
      });
    }

    if (data.remove_image_urls) {
      data.remove_image_urls.forEach((url) => {
        formData.append('remove_image_urls[]', url);
      });
    }

    try {
      const response = await authApi.post(`/announcements/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-HTTP-Method-Override': 'PUT',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating announcement:', error);
      throw error;
    }
  },

  delete: async (id: number): Promise<void> => {
    try {
      await authApi.delete(`/announcements/${id}`);
    } catch (error) {
      console.error('Error deleting announcement:', error);
      throw error;
    }
  },
};

export { blogService };