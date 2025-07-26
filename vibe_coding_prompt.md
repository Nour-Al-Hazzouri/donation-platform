# Lebanon Donation Platform - Frontend AI Development Prompt

## Project Overview
You are working exclusively on the **frontend** of a comprehensive donation platform specifically designed for Lebanon. This is a Next.js 15+ frontend application that will connect to a PHP Laravel backend API with MySQL database (handled by a separate backend team). The platform facilitates transparent donation requests and contributions through a social media-like interface.

**Important**: This prompt is focused solely on frontend development. The backend API is developed separately by another team.

## Core Technology Stack Requirements

### Framework & Language
- **Framework**: Next.js 15+ with App Router (mandatory)
- **Language**: TypeScript (strictly enforced - no plain JavaScript)
- **Package Manager**: pnpm (use pnpm commands, not npm/yarn)
- **Bundler**: Turbopack (significantly improved in Next.js 15+)

### UI & Styling
- **UI Library**: ShadCN UI components (primary choice for all UI elements)
- **Styling**: Tailwind CSS v4 (latest version with improved performance and features)
- **Design System**: Follow ShadCN UI patterns and conventions
- **Responsive Design**: Mobile-first approach, ensure cross-device compatibility

### State & Data Management
- **State Management**: Zustand (lightweight, flexible state management)
- **HTTP Client**: Axios integrated with React Query for data fetching
- **Form Handling**: React Hook Form with Zod validation (mandatory for all forms)
- **Caching**: React Query for API response caching and synchronization

## Project Structure Adherence

### Directory Structure (Strict Adherence Required)
```
frontend/
├── app/                    # App Router directory
│   ├── api/               # Next.js API routes (proxy to PHP backend)
│   ├── auth/              # Authentication pages
│   ├── donations/         # Donation-related pages
│   ├── profile/           # User profile pages
│   ├── admin/             # Admin/moderation pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # ShadCN UI components
│   ├── common/           # General-purpose components
│   ├── forms/            # Form-specific components
│   └── modals/           # Modal components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

### File Naming Conventions
- **Components**: PascalCase (e.g., `DonationForm.tsx`, `VerificationBadge.tsx`)
- **Pages**: `page.tsx` for App Router pages
- **Layouts**: `layout.tsx` for App Router layouts
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`, `useVoting.ts`)
- **Types**: camelCase files with descriptive names (e.g., `donation.ts`, `user.ts`)
- **Utils**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)

### TypeScript Requirements
- **Strict Mode**: Always use strict TypeScript settings
- **Type Safety**: Define proper interfaces and types for all data structures
- **No `any` Types**: Avoid using `any` - define proper types
- **Path Mapping**: Use `@/*` imports for cleaner import paths

### Component Development Standards
- **React 19 Features**: Utilize React 19's improved Suspense, concurrent features, and React Compiler optimizations
- **Server Components**: Use React Server Components by default where possible (enhanced in React 19)
- **Client Components**: Use `'use client'` directive only when necessary (interactivity, hooks, browser APIs)
- **React Compiler**: Take advantage of automatic optimizations from React Compiler (no manual memoization needed in most cases)
- **Suspense**: Use React 19's enhanced Suspense for better loading states and streaming
- **Props Interface**: Always define TypeScript interfaces for component props
- **Default Exports**: Use default exports for page components and layouts
- **Named Exports**: Use named exports for reusable components and utilities

## Code Quality Standards
### Form Handling Requirements
- **React Hook Form**: Mandatory for complex forms, but consider React 19 Actions for simpler forms
- **React 19 Actions**: Use for straightforward form submissions with server actions
- **Zod Validation**: All form schemas must use Zod for validation
- **useFormStatus**: Utilize React 19's useFormStatus hook for form state management
- **useOptimistic**: Use React 19's useOptimistic for optimistic UI updates
- **Error Handling**: Implement proper form error states and messages
- **Loading States**: Include loading indicators during form submission (useFormStatus)
- **Accessibility**: Ensure forms are accessible with proper labels and ARIA attributes

## Data Types & Backend Integration

### Core Data Interfaces (Frontend Consumption)
**Note**: These interfaces define how the frontend will consume data from the backend API. The actual backend implementation is handled by a separate team.

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface DonationRequest {
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

interface Vote {
  id: string;
  userId: string;
  donationId: string;
  type: 'upvote' | 'downvote';
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  donationId: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Backend Integration Standards (Frontend Perspective)
**Note**: The backend API is developed by a separate team. These are the integration requirements from the frontend side.

#### Production API Configuration
- **Base URL**: `http://localhost:8000/api` (configurable via environment variables)
- **Backend**: PHP Laravel framework with MySQL database (separate team responsibility)
- **Authentication**: Send Bearer token in Authorization header for protected routes
- **Request Format**: Send JSON payloads for POST/PUT requests
- **Response Format**: Expect JSON responses from all API endpoints

#### Mock Data Testing Strategy
**Important**: Since frontend development may complete before backend APIs are ready, implement a seamless mock-to-production API transition strategy.

- **Mock Service**: Use MockFast.io (https://mockfast.io/) for unlimited free mock API endpoints
- **Environment-Based Switching**: Use environment variables to toggle between mock and production APIs
- **Data Consistency**: Ensure mock data structure matches the defined TypeScript interfaces exactly
- **Realistic Mock Data**: Create realistic Lebanese donation platform data for thorough testing
- **Easy Migration**: Design API calls to easily switch from mock endpoints to production endpoints

#### API Integration Requirements
- **Error Handling**: Implement robust error handling for API responses using React Query error boundaries
- **Loading States**: Always implement loading states for API calls to improve UX
- **Optimistic Updates**: Use React Query's optimistic updates where appropriate for better user experience
- **Retry Logic**: Implement appropriate retry logic for failed API calls
- **Mock Testing**: Test all API scenarios with mock data before backend integration

## Frontend-Specific Requirements

**IMPORTANT**: These requirements are feature-specific and should ONLY be applied when creating code directly related to each specific feature. Do not mix requirements from different sections or apply unrelated feature logic to avoid code collisions and errors.

### Authentication System (Frontend Implementation)
- **Pages**: Login, Register, Password Reset, Email Verification
- **Client-Side Security**: Implement proper form validation and error handling
- **State Management**: Use Zustand for auth state management across the application
- **Protected Routes**: Implement middleware for frontend route protection
- **Token Management**: Handle token storage, refresh, and expiration
- **Persistent Login**: Manage user sessions and persistent authentication state

### Donation Management (Frontend Features)
- **UI Components**: Create, display, and interact with donation requests
- **Image Handling**: Frontend image upload with preview, validation, and optimization
- **Search & Filter**: Implement client-side and API-integrated search and filtering
- **Voting Interface**: Interactive upvote/downvote buttons with optimistic updates
- **Comments UI**: Threaded commenting interface with real-time updates

### User Profiles (Frontend Interface)
- **Profile Display**: Render user information, verification badges, donation history
- **Profile Forms**: Editable profile forms with validation and state management
- **Verification Interface**: File upload interface for ID/Passport verification
- **Settings UI**: Frontend interface for user privacy and notification settings

### Admin/Moderation (Frontend Dashboard)
- **Moderation Interface**: Dashboard for reviewing and moderating content
- **User Management UI**: Admin interface for user actions and management
- **Reporting Interface**: Forms and interfaces for handling user reports
- **Analytics Dashboard**: Frontend visualization of analytics data

## UI/UX Requirements

### Design Principles
- **Lebanon-Focused**: Consider local cultural sensitivities and preferences
- **Accessibility**: WCAG 2.1 AA compliance minimum
- **Performance**: Optimize for slower internet connections common in the region
- **Mobile-First**: Prioritize mobile experience (primary usage pattern)
- **RTL Support**: Prepare for Arabic language support (future requirement)

### Component Standards
- **ShadCN UI**: Always use ShadCN UI components as base
- **Consistent Styling**: Follow the established design system
- **Loading States**: Implement skeleton loading for better UX
- **Error States**: User-friendly error messages and recovery options
- **Empty States**: Meaningful empty state designs

### Responsive Design
- **Breakpoints**: Follow Tailwind's default breakpoints
- **Mobile Navigation**: Implement appropriate mobile navigation patterns
- **Touch Interactions**: Optimize for touch interfaces
- **Performance**: Optimize images and assets for mobile

## Development Workflow

### Code Review Checklist
- [ ] TypeScript strict mode compliance
- [ ] Component follows ShadCN UI patterns
- [ ] Proper error handling implemented
- [ ] Loading states included
- [ ] Mobile-responsive design
- [ ] Accessibility considerations addressed
- [ ] Performance optimizations applied
- [ ] Tests written (where applicable)

## Frontend Environment Configuration

### Frontend Environment Variables
```bash
# API Configuration (Backend Integration)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_MOCK_API_BASE_URL=https://api.mockfast.io/your-project-id
NEXT_PUBLIC_USE_MOCK_API=true  # Toggle between mock and production APIs
NEXT_PUBLIC_APP_NAME="Lebanon Donations"

# Frontend Feature Flags
NEXT_PUBLIC_ENABLE_AI_MATCHING=false
NEXT_PUBLIC_ENABLE_GEOLOCATION=true
NEXT_PUBLIC_REACT_COMPILER=true  # Enable React 19 Compiler optimizations

# Frontend Upload Configuration
NEXT_PUBLIC_MAX_FILE_SIZE=5242880  # 5MB
NEXT_PUBLIC_ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp"

# Frontend Performance & Development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_TURBOPACK=true  # Enable Next.js 15 Turbopack
```

## Frontend Performance & Security

### Frontend Performance Requirements
- **React 19 Compiler**: Leverage automatic optimizations, avoid manual memoization unless necessary
- **Next.js 15 Optimizations**: Utilize partial prerendering and enhanced caching strategies
- **Core Web Vitals**: Maintain excellent scores across all metrics
- **Image Optimization**: Use Next.js 15's enhanced Image component
- **Code Splitting**: Implement proper code splitting with React 19's improved lazy loading
- **Bundle Size**: Keep frontend bundle size optimized with Turbopack improvements
- **Client-Side Caching**: Optimize React Query cache strategies with React 19 concurrent features

### Frontend Security Considerations
- **Input Validation**: Client-side validation (server validation handled by backend team)
- **XSS Prevention**: Sanitize user inputs and outputs in frontend components
- **Token Security**: Secure handling and storage of authentication tokens
- **Environment Variables**: Proper handling of public vs private environment variables

## Frontend Testing Requirements

### Frontend Testing Strategy
- **Component Testing**: Test React components and their interactions
- **Form Testing**: Validate form behavior, validation, and submission
- **API Integration Testing**: Mock API responses and test error handling
- **User Interaction Testing**: Test user flows and interface interactions
- **Accessibility Testing**: Ensure components meet accessibility standards

## Localization Considerations

### Lebanon-Specific Features
- **Currency**: Lebanese Pound (LBP) and USD support
- **Location**: Implement Lebanon-specific location features
- **Cultural Sensitivity**: Consider local customs and sensitivities
- **Language**: Prepare for Arabic RTL support (future)

## AI Assistant Guidelines

**CRITICAL IMPORTANCE**: It is essential that you strictly follow all requirements outlined in this prompt. However, when it comes to the "Frontend-Specific Requirements" section, only apply the requirements that are directly related to the specific feature or component you are being asked to create. 

For example:
- If asked to create a login form, follow the Authentication System requirements
- If asked to create a donation card component, follow the Donation Management requirements  
- If asked to create a generic button component, do NOT apply feature-specific requirements

This prevents code collisions, unnecessary complexity, and ensures components remain focused and reusable.

### When Creating Components:
1. Always use ShadCN UI components as the foundation
2. Implement proper TypeScript interfaces
3. Leverage React 19 features (Suspense, Actions, new hooks) when appropriate
4. Use React Compiler optimizations (avoid manual memoization unless specifically needed)
5. Include loading and error states with React 19's enhanced Suspense
6. Follow the established project structure
7. Ensure mobile responsiveness with Tailwind CSS v4
8. Add proper accessibility attributes
9. Use React Hook Form + Zod for complex forms, React 19 Actions for simple forms
10. Take advantage of Next.js 15's improved developer experience and performance

### When Working with Backend APIs:
1. Use React Query for all API calls to the Laravel backend
2. **Mock-First Development**: Start with MockFast.io endpoints that match production API structure
3. **Environment Switching**: Use `NEXT_PUBLIC_USE_MOCK_API` to toggle between mock and production APIs
4. Implement comprehensive error boundaries with React 19's enhanced error handling
5. Handle loading states gracefully with React 19's improved Suspense
6. Use useOptimistic for optimistic updates and better UX
7. Use React 19 Actions for server-side form submissions when appropriate
8. Follow the defined data interfaces for API responses
9. **API Abstraction**: Create API service layers that work seamlessly with both mock and production endpoints
10. **Mock Data Quality**: Ensure mock data represents realistic Lebanese donation scenarios
11. Never assume backend implementation details - focus on API contracts
12. Leverage React 19's concurrent features for non-blocking API calls

### When Writing Code:
1. Prioritize type safety and clear interfaces
2. Write self-documenting code with clear variable names
3. Follow the established patterns and conventions
4. Consider performance implications
5. Ensure code is maintainable and scalable

## Frontend Quality Assurance

### Zustand State Management Patterns

**The AI must generate Zustand stores following these patterns for consistent state management:**

```typescript
// stores/authStore.ts - Authentication state management
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => {
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// stores/uiStore.ts - UI state management
interface UiState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  currentModal: string | null;
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  
  // Actions
  toggleTheme: () => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<UiState['notifications'][0], 'id'>) => void;
  removeNotification: (id: string) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: 'light',
  sidebarOpen: false,
  currentModal: null,
  notifications: [],

  toggleTheme: () => set((state) => ({ 
    theme: state.theme === 'light' ? 'dark' : 'light' 
  })),

  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),

  openModal: (modalId) => set({ currentModal: modalId }),
  closeModal: () => set({ currentModal: null }),

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }]
    }));
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 5000);
  },

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
}));
```

**Standard Zustand Store Pattern:**
- Use TypeScript interfaces for type safety
- Implement `persist` middleware for data that should survive page reloads
- Include both state and actions in the same store
- Use `set` for state updates and `get` for accessing current state
- Follow immutable update patterns
- [ ] Code compiles without TypeScript errors
- [ ] Components render correctly on mobile and desktop
- [ ] Forms include proper validation and error handling
- [ ] API integration handles error scenarios gracefully
- [ ] **Mock API testing completed** with realistic Lebanese donation data
- [ ] **API switching mechanism** works seamlessly between mock and production
- [ ] Accessibility requirements are met
- [ ] Frontend performance is optimized
- [ ] Code follows frontend project conventions
- [ ] No hardcoded backend logic or assumptions

## Mock Data Development Guidelines

### Mock Data Best Practices
1. **Realistic Lebanese Context**: Create mock donation requests with real Lebanese locations, currency (LBP/USD), and culturally appropriate scenarios
2. **Complete Data Sets**: Include all required fields as defined in TypeScript interfaces
3. **Edge Cases**: Mock various scenarios including successful/failed donations, different user verification states, etc.
4. **Consistent Structure**: Ensure mock API responses exactly match the expected production API structure
5. **Dynamic Responses**: Use MockFast.io features to simulate different response states (loading, success, error)

### API Service Architecture
Create API service files that abstract the endpoint switching logic:

```typescript
// lib/api.ts - Complete API Service Architecture
import axios, { AxiosResponse } from 'axios';
import { User, DonationRequest, Vote, Comment } from '@/types';

// Dynamic API base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' 
  ? process.env.NEXT_PUBLIC_MOCK_API_BASE_URL
  : process.env.NEXT_PUBLIC_API_BASE_URL;

// Generic API response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

// Authentication token management
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Complete API service implementation
export const apiService = {
  // Authentication endpoints
  auth: {
    login: async (credentials: { email: string; password: string }) => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    },
    register: async (userData: { name: string; email: string; password: string }) => {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    },
    logout: async () => {
      const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    refreshToken: async () => {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    }
  },

  // User management endpoints
  users: {
    getProfile: async () => {
      const response = await axios.get(`${API_BASE_URL}/users/profile`, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    updateProfile: async (userData: Partial<User>) => {
      const response = await axios.put(`${API_BASE_URL}/users/profile`, userData, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    uploadVerification: async (files: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/users/verify`, files, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  // Donation management endpoints
  donations: {
    getAll: async (params?: { page?: number; category?: string; priority?: string }) => {
      const response = await axios.get(`${API_BASE_URL}/donations`, { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axios.get(`${API_BASE_URL}/donations/${id}`);
      return response.data;
    },
    create: async (donationData: Omit<DonationRequest, 'id' | 'createdAt' | 'currentAmount' | 'verified' | 'createdBy'>) => {
      const response = await axios.post(`${API_BASE_URL}/donations`, donationData, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    update: async (id: string, donationData: Partial<DonationRequest>) => {
      const response = await axios.put(`${API_BASE_URL}/donations/${id}`, donationData, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    delete: async (id: string) => {
      const response = await axios.delete(`${API_BASE_URL}/donations/${id}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    uploadImages: async (id: string, images: FormData) => {
      const response = await axios.post(`${API_BASE_URL}/donations/${id}/images`, images, {
        headers: { ...getAuthHeaders(), 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
  },

  // Voting system endpoints
  votes: {
    create: async (voteData: { donationId: string; type: 'upvote' | 'downvote' }) => {
      const response = await axios.post(`${API_BASE_URL}/votes`, voteData, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    update: async (voteId: string, type: 'upvote' | 'downvote') => {
      const response = await axios.put(`${API_BASE_URL}/votes/${voteId}`, { type }, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    delete: async (voteId: string) => {
      const response = await axios.delete(`${API_BASE_URL}/votes/${voteId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    getByDonation: async (donationId: string) => {
      const response = await axios.get(`${API_BASE_URL}/donations/${donationId}/votes`);
      return response.data;
    }
  },

  // Comments system endpoints
  comments: {
    getByDonation: async (donationId: string) => {
      const response = await axios.get(`${API_BASE_URL}/donations/${donationId}/comments`);
      return response.data;
    },
    create: async (commentData: { donationId: string; content: string }) => {
      const response = await axios.post(`${API_BASE_URL}/comments`, commentData, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    update: async (commentId: string, content: string) => {
      const response = await axios.put(`${API_BASE_URL}/comments/${commentId}`, { content }, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    delete: async (commentId: string) => {
      const response = await axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    }
  },

  // Admin/Moderation endpoints
  admin: {
    getDashboardStats: async () => {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      return response.data;
    },
    moderateDonation: async (donationId: string, action: 'approve' | 'reject', reason?: string) => {
      const response = await axios.post(`${API_BASE_URL}/admin/donations/${donationId}/moderate`, 
        { action, reason }, 
        { headers: getAuthHeaders() }
      );
      return response.data;
    },
    getUsers: async (params?: { page?: number; role?: string }) => {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, { 
        params,
        headers: getAuthHeaders() 
      });
      return response.data;
    },
    updateUserRole: async (userId: string, role: 'user' | 'moderator' | 'admin') => {
      const response = await axios.put(`${API_BASE_URL}/admin/users/${userId}/role`, 
        { role }, 
        { headers: getAuthHeaders() }
      );
      return response.data;
    }
  }
};

// Error interceptor for consistent error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);
```

Remember: This prompt is exclusively for frontend development of a donation platform for Lebanon. The backend API is handled by a separate team. Focus on creating an excellent user experience while maintaining clean integration points with the backend API. Every component should be built with care, considering the real-world impact and the users who will depend on this platform.