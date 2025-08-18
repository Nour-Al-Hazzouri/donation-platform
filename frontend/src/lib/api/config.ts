/**
 * Central API configuration file
 * This file centralizes all API URL configuration to ensure consistency across the application
 */

// Get the API base URL from environment variables with a fallback
// Using the correct backend URL as specified: https://amusing-presence-production.up.railway.app
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://amusing-presence-production.up.railway.app/api';

// Create a standard API configuration object that can be imported by all API services
export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Export other API-related configuration as needed
export default apiConfig;