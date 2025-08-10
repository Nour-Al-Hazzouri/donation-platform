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