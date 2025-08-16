// Type definitions for the application

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Donation types
export interface DonationRequest {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string[];
  priority: 'urgent' | 'medium' | 'low';
  createdBy: string;
  createdAt: string;
  images: string[];
  verified: boolean;
  location?: string;
  contactInfo?: string;
}

// Vote types
export interface Vote {
  id: string;
  userId: string;
  donationId: string;
  type: 'upvote' | 'downvote';
  createdAt: string;
}

// Comment types
export interface Comment {
  id: string;
  content: string;
  userId: string;
  donationId: string;
  createdAt: string;
  updatedAt?: string;
}

// Community Post types
export interface CommunityPost {
  id: number;
  user_id: number;
  title: string;
  content: string;
  image_urls?: string[];
  image_full_urls?: string[];
  tags?: string[];
  created_at: string;
  updated_at: string;
  votes?: {
    upvotes: number;
    downvotes: number;
    total: number;
    user_vote?: 'upvote' | 'downvote' | null;
  };
  user?: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  comments_count?: number;
  comments?: CommentResource[];
}

// Comment Resource type (as returned by API)
export interface CommentResource {
  id: number;
  content: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

// API Response Wrappers
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  message: string;
  success: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
