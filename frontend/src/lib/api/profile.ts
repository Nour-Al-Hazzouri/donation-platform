// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\lib\api\profile.ts
import { authApi } from './auth';

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
  phone?: string | null;
  location_id?: number | null;
  avatar_url?: File | null;
  delete_avatar?: boolean;
}

export interface UserProfile {
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

const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const response = await authApi.get('/user/profile');
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<UserProfile> => {
    const formData = new FormData();

    // Append only the fields that are provided
    if (data.first_name) formData.append('first_name', data.first_name);
    if (data.last_name) formData.append('last_name', data.last_name);
    if (data.username) formData.append('username', data.username);
    if (data.email) formData.append('email', data.email);
    if (data.phone !== undefined) formData.append('phone', data.phone || '');
    if (data.location_id !== undefined) {
      formData.append('location_id', data.location_id?.toString() || '');
    }
    if (data.avatar_url) formData.append('avatar_url', data.avatar_url);
    if (data.delete_avatar) formData.append('delete_avatar', 'true');

    console.log("updating profile...")    
    const response = await authApi.put('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("updated profile:", response.data.data)
    return response.data.data;
  },
};

export { profileService };