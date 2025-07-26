# Frontend Project Structure Summary (Next.js 15+ with App Router)

This document provides a concise yet thorough overview of the frontend project structure for the Donation Platform, built with Next.js 15+ using the App Router.

## 🚀 Tech Stack Overview

- **Framework**: Next.js 15+ (React framework with App Router for file-based routing)
- **Language**: TypeScript (strongly typed JavaScript for better development experience)
- **Package Manager**: pnpm (efficient and fast package management)
- **UI Library**: shadcn/ui (reusable, accessible UI components built on Radix UI)
- **Styling**: Tailwind CSS (utility-first CSS framework for rapid UI development)
- **Bundler**: Turbopack (next-generation bundler for faster builds, enabled by default)
- **Linter**: ESLint (code quality and consistency enforcement)
- **State Management**: Zustand (lightweight, flexible state management solution)
- **HTTP Client**: Axios (promise-based HTTP client) integrated with React Query (data fetching, caching, and synchronization)
- **Form Handling**: React Hook Form (performant and flexible forms) with Zod (TypeScript-first schema validation)

## 📁 Directory Structure

The `client/` directory follows Next.js 15+ App Router conventions for optimal performance and developer experience:

```
client/
├── public/                        # Static assets served directly by Next.js
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── app/                          # App Router directory (Next.js 13+ routing system)
│   ├── api/                      # Next.js API routes (optional, for client-side API endpoints)
│   │   ├── auth/                 # Authentication API routes
│   │   └── donations/            # Donations API routes
│   ├── auth/                     # Authentication pages and layouts
│   │   ├── login/                # Login page directory
│   │   │   └── page.tsx          # Login page component
│   │   ├── register/             # Registration page directory
│   │   │   └── page.tsx          # Registration page component
│   │   └── layout.tsx            # Auth-specific layout (optional)
│   ├── donations/                # Donation-related pages
│   │   ├── create/               # Create donation page
│   │   │   └── page.tsx
│   │   ├── [id]/                 # Dynamic route for individual donations
│   │   │   └── page.tsx          # Donation detail page
│   │   ├── page.tsx              # Donations list page
│   │   └── layout.tsx            # Donations-specific layout (optional)
│   ├── profile/                  # User profile pages
│   │   ├── edit/                 # Edit profile page
│   │   │   └── page.tsx
│   │   ├── verify/               # Verification upload page
│   │   │   └── page.tsx
│   │   └── page.tsx              # Profile display page
│   ├── admin/                    # Admin/moderator pages
│   │   ├── moderation/           # Moderation dashboard
│   │   │   └── page.tsx
│   │   ├── users/                # User management
│   │   │   └── page.tsx
│   │   └── layout.tsx            # Admin-specific layout
│   ├── layout.tsx                # Root layout component (wraps all pages)
│   ├── page.tsx                  # Root page component (homepage)
│   ├── globals.css               # Global CSS styles with Tailwind imports
│   ├── loading.tsx               # Global loading UI (optional)
│   ├── error.tsx                 # Global error UI (optional)
│   └── not-found.tsx             # 404 page (optional)
├── components/                   # Reusable UI components
│   ├── ui/                       # shadcn/ui components (Button, Card, Dialog, etc.)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...                   # (other shadcn/ui components)
│   ├── common/                   # General-purpose components
│   │   ├── Header.tsx            # Site header/navigation
│   │   ├── Footer.tsx            # Site footer
│   │   ├── Navbar.tsx            # Navigation component
│   │   ├── VerificationBadge.tsx # User verification indicator
│   │   └── VoteButtons.tsx       # Voting interface
│   ├── forms/                    # Form-specific components
│   │   ├── DonationForm.tsx      # Donation creation/editing form
│   │   ├── LoginForm.tsx         # Login form
│   │   └── RegisterForm.tsx      # Registration form
│   └── modals/                   # Modal components
│       ├── ConfirmationModal.tsx
│       └── ImagePreviewModal.tsx
├── hooks/                        # Custom React hooks for reusable logic
│   ├── useAuth.ts                # Authentication state and actions
│   ├── useVoting.ts              # Voting functionality
│   ├── usePermissions.ts         # Permission checking
│   └── useLocalStorage.ts        # Local storage management
├── lib/                          # Utility functions and configurations
│   ├── utils.ts                  # General utility functions
│   ├── api.ts                    # API client configuration
│   ├── auth.ts                   # Authentication utilities
│   └── validations.ts            # Zod validation schemas
├── styles/                       # Additional styles (if needed beyond Tailwind)
│   └── components.css            # Component-specific styles
├── types/                        # TypeScript type definitions and interfaces
│   ├── auth.ts                   # Authentication-related types
│   ├── donation.ts               # Donation-related types
│   ├── user.ts                   # User-related types
│   └── api.ts                    # API response types
├── utils/                        # Utility functions and helpers
│   ├── formatDate.ts             # Date formatting utilities
│   ├── validateEmail.ts          # Email validation
│   └── constants.ts              # Application constants
├── .env.example                  # Example environment variables
├── .env.local                    # Local environment variables (not committed)
├── .eslintrc.json                # ESLint configuration
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── package.json                  # Project metadata, scripts, and dependencies
├── pnpm-lock.yaml               # pnpm lock file for reproducible installations
├── tailwind.config.ts            # Tailwind CSS configuration (TypeScript)
├── tsconfig.json                 # TypeScript compiler configuration
└── postcss.config.js             # PostCSS configuration (for Tailwind)
```

## ⚙ Key Configuration Files

- **`next.config.js`**: Configures Next.js with App Router enabled, Turbopack settings, image optimization, and API proxy to the PHP backend (`/api` routes proxy to `http://localhost:8000/api`)
- **`tsconfig.json`**: Defines TypeScript compiler options with strict type checking, JSX support, and path mapping for easier imports (using `@/*` for root-level imports)
- **`tailwind.config.ts`**: Customizes Tailwind CSS with shadcn/ui theme variables, extending colors, defining CSS custom properties, and configuring content paths for purging unused styles
- **`.eslintrc.json`**: Sets up ESLint with Next.js recommended rules, TypeScript support, and custom rules for code quality and consistency
- **`.env.example`**: Provides a template for environment variables, such as `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_NAME`, and feature flags for AI matching or geolocation
- **`package.json`**: Lists all project dependencies (Next.js, React, shadcn/ui, Axios, Zustand, etc.) and defines scripts for development (`pnpm dev` with Turbopack), building, linting, and testing

## 🎯 App Router Features & Benefits

- **File-based Routing**: Pages are automatically routed based on file structure in the `app/` directory
- **Layouts**: Shared UI components that persist across route changes (e.g., `layout.tsx` files)
- **Server Components**: React Server Components by default for better performance
- **Streaming**: Built-in support for streaming UI updates
- **Loading & Error States**: Special files (`loading.tsx`, `error.tsx`) for handling loading and error states
- **Route Groups**: Organize routes without affecting URL structure using parentheses
- **Parallel Routes**: Render multiple pages simultaneously in the same layout
- **Enhanced Performance**: Next.js 15+ includes improved bundling and rendering optimizations

## 🎯 Integration Points for Core Features

- **User Onboarding & Profiles**: `app/auth/`, `app/profile/`, `components/common/VerificationBadge.tsx`
- **Donation Posts**: `app/donations/`, `components/forms/DonationForm.tsx`
- **Voting System**: `components/common/VoteButtons.tsx`, `hooks/useVoting.ts`
- **Commenting & Moderation**: `components/comments/`, `app/admin/moderation/`
- **Search & Filtering**: `components/search/`, `app/search/`
- **Role-Based Access Control**: `hooks/usePermissions.ts`, middleware in `app/` directory

## 🚀 Development Workflow

- **Development Server**: `pnpm dev` starts the development server with Turbopack enabled by default for faster builds and hot reloading
- **Type Checking**: TypeScript provides compile-time type checking and better IDE support
- **Linting**: ESLint ensures code quality and consistency across the project
- **Styling**: Tailwind CSS with shadcn/ui provides a consistent design system
- **State Management**: Zustand for lightweight, flexible state management
- **API Integration**: Axios with React Query for efficient data fetching and caching

## 🆕 Next.js 15+ Enhancements

- **Improved Turbopack**: Enhanced performance and stability for faster development builds
- **React 19 Compatibility**: Full support for React 19 features and optimizations
- **Better Caching**: Improved caching strategies for better performance
- **Enhanced Developer Experience**: Better error messages, improved debugging, and faster refresh
- **Optimized Bundle Splitting**: More efficient code splitting and loading strategies

This Next.js 15+ App Router structure provides a modern, performant, and scalable foundation for the donation platform frontend, leveraging the latest React and Next.js features for optimal developer experience and application performance.