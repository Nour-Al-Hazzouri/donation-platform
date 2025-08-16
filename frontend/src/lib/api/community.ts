import axios from 'axios';
import { CommunityPost, CommentResource, PaginatedResponse, ApiResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

const communityApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
communityApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null;
    
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken.state?.user?.token) {
          config.headers['Authorization'] = `Bearer ${parsedToken.state.user.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth token:', error);
        
        // Try to get token from cookies as fallback
        if (typeof window !== 'undefined' && document.cookie) {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-storage='));
          
          if (authCookie) {
            try {
              const cookieValue = decodeURIComponent(authCookie.split('=')[1]);
              const parsedCookie = JSON.parse(cookieValue);
              
              if (parsedCookie.state?.user?.token) {
                config.headers['Authorization'] = `Bearer ${parsedCookie.state.user.token}`;
              }
            } catch (cookieError) {
              console.error('Error parsing auth cookie:', cookieError);
            }
          }
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface for creating a community post
export interface CreateCommunityPostData {
  content: string;
  title: string; // Used for display in the UI
  event_id?: string | null; // Optional event ID to associate with the post
  image_urls?: File[];
  tags?: string[];
}

// Interface for updating a community post
export interface UpdateCommunityPostData {
  content?: string;
  image_urls?: File[];
  remove_image_urls?: string[];
  tags?: string[];
}

// Interface for creating a comment
export interface CreateCommentData {
  content: string;
}

const communityService = {
  // Get all community posts with pagination
  getAllPosts: async (query?: string, page: number = 1, perPage: number = 10): Promise<PaginatedResponse<CommunityPost>> => {
    const params: Record<string, any> = { page, per_page: perPage };
    if (query) params.query = query;
    
    const response = await communityApi.get('/community-posts', { params });
    return response.data;
  },
  
  // Get a specific community post by ID
  getPost: async (postId: number): Promise<ApiResponse<CommunityPost>> => {
    const response = await communityApi.get(`/community-posts/${postId}`);
    return response.data;
  },
  
  // Create a new community post
  createPost: async (data: CreateCommunityPostData): Promise<ApiResponse<CommunityPost>> => {
    // Create FormData for file uploads
    const formData = new FormData();
    formData.append('content', data.content);
    
    // Add title for display purposes
    if (data.title) {
      formData.append('title', data.title);
    }
    
    // Add event_id if provided
    if (data.event_id) {
      formData.append('event_id', data.event_id);
    }
    
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    
    if (data.image_urls && data.image_urls.length > 0) {
      data.image_urls.forEach((file, index) => {
        formData.append(`image_urls[${index}]`, file);
      });
    }
    
    const response = await communityApi.post('/community-posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  // Update an existing community post
  updatePost: async (postId: number, data: UpdateCommunityPostData): Promise<ApiResponse<CommunityPost>> => {
    // Create FormData for file uploads
    const formData = new FormData();
    
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    
    if (data.tags && data.tags.length > 0) {
      data.tags.forEach((tag, index) => {
        formData.append(`tags[${index}]`, tag);
      });
    }
    
    if (data.image_urls && data.image_urls.length > 0) {
      data.image_urls.forEach((file, index) => {
        formData.append(`image_urls[${index}]`, file);
      });
    }
    
    if (data.remove_image_urls && data.remove_image_urls.length > 0) {
      data.remove_image_urls.forEach((url, index) => {
        formData.append(`remove_image_urls[${index}]`, url);
      });
    }
    
    // Add method override header for servers that don't support PUT with FormData
    const response = await communityApi.post(`/community-posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-HTTP-Method-Override': 'PUT',
      },
    });
    
    return response.data;
  },
  
  // Delete a community post
  deletePost: async (postId: number): Promise<ApiResponse<null>> => {
    const response = await communityApi.delete(`/community-posts/${postId}`);
    return response.data;
  },
  
  // Vote on a community post (upvote or downvote)
  votePost: async (postId: number, voteType: 'upvote' | 'downvote'): Promise<ApiResponse<{ upvotes: number, downvotes: number, total_votes: number }>> => {
    const response = await communityApi.post(`/community-posts/${postId}/vote`, { type: voteType });
    return response.data;
  },
  
  // Remove vote from a community post
  removeVote: async (postId: number): Promise<ApiResponse<{ upvotes: number, downvotes: number, total_votes: number }>> => {
    const response = await communityApi.delete(`/community-posts/${postId}/vote`);
    return response.data;
  },
  
  // Get comments for a community post
  getComments: async (postId: number): Promise<ApiResponse<CommentResource[]>> => {
    const response = await communityApi.get(`/community-posts/${postId}/comments`);
    return response.data;
  },
  
  // Add a comment to a community post
  addComment: async (postId: number, data: CreateCommentData): Promise<ApiResponse<CommentResource>> => {
    const response = await communityApi.post(`/community-posts/${postId}/comments`, data);
    return response.data;
  },
  
  // Delete a comment
  deleteComment: async (commentId: number): Promise<ApiResponse<null>> => {
    const response = await communityApi.delete(`/comments/${commentId}`);
    return response.data;
  },
};

export { communityService, communityApi };