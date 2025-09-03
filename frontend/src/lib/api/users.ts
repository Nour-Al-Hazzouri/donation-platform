import { authApi } from './auth';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  avatar_url_full?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
  location?: {
    id: number;
    governorate: string;
    district: string;
  } | null;
}

export interface UsersListResponse {
  data: User[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  message: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
  message: string;
}

const usersService = {
  // Get all users (Admin only)
  getAllUsers: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
  }): Promise<UsersListResponse> => {
    const response = await authApi.get('/users', {
      params: {
        page: params?.page || 1,
        per_page: params?.per_page || 15,
        search: params?.search
      }
    });
    return response.data;
  },

  // Get user by ID (Admin only)
  getUserById: async (userId: number): Promise<UserResponse> => {
    const response = await authApi.get(`/users/${userId}`);
    return response.data;
  },

  // Create user (Admin only)
  createUser: async (userData: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    location_id?: number;
  }): Promise<UserResponse> => {
    const response = await authApi.post('/users', userData);
    return response.data;
  },

  // Update user (Admin only)
  updateUser: async (userId: number, userData: {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    phone?: string;
    location_id?: number;
    avatar_url?: File;
  }): Promise<UserResponse> => {
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'avatar_url' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await authApi.put(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete user (Admin only)
  deleteUser: async (userId: number): Promise<{success: boolean; message: string}> => {
    const response = await authApi.delete(`/users/${userId}`);
    return response.data;
  },

  // Promote user to moderator (Admin only)
  promoteToModerator: async (userId: number): Promise<UserResponse> => {
    const response = await authApi.post(`/users/${userId}/promote-to-moderator`);
    return response.data;
  },
};

export default usersService;
