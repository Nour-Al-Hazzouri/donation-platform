// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\lib\api\locations.ts
import { authApi } from './auth';

export interface Location {
  id: number;
  governorate: string;
  district: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationData {
  governorate: string;
  district: string;
}

export interface UpdateLocationData extends CreateLocationData {}

const locationsService = {
  listLocations: async (): Promise<Location[]> => {
    const response = await authApi.get('/locations', {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data.data;
  },

  getLocation: async (id: number): Promise<Location> => {
    const response = await authApi.get(`/locations/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data.data;
  },

  createLocation: async (data: CreateLocationData): Promise<Location> => {
    const response = await authApi.post('/locations', data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data.data;
  },

  updateLocation: async (id: number, data: UpdateLocationData): Promise<Location> => {
    const response = await authApi.put(`/locations/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    return response.data.data;
  },

  deleteLocation: async (id: number): Promise<{ message: string }> => {
    const response = await authApi.delete(`/locations/${id}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    return response.data;
  },
};

export { locationsService };