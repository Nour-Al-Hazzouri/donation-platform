# Frontend Project Structure Summary (Next.js 15+ with App Router)

This document provides a concise yet thorough overview of the frontend project structure for the Donation Platform, built with Next.js 15+ using the App Router with a feature-based component organization system.

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

The `client/` directory follows Next.js 15+ App Router conventions with a feature-based component organization for better maintainability and scalability:

```
client/
├── public/                       # Static assets served directly by Next.js
│   └── [images, icons, manifest files, robots.txt]
├── src/                         # Source code directory
│   ├── app/                     # App Router directory (Next.js 13+ routing system)
│   │   ├── api/                 # Next.js API routes (optional, for client-side API endpoints)
│   │   ├── [routable-folders]/  # Each directory represents a route in the application
│   │   │   └── [Each route folder contains: page.tsx, layout.tsx (optional), loading.tsx (optional), error.tsx (optional)]
│   │   └── [global files: layout.tsx, page.tsx, globals.css, loading.tsx, error.tsx, not-found.tsx]
│   ├── components/              # Feature-based component organization
│   │   ├── ui/                  # shadcn/ui base components
│   │   │   └── [buttons, inputs, cards, dialogs, forms, navigation elements]
│   │   ├── common/              # Shared components used across multiple pages
│   │   │   └── [header, footer, navbar, search bar, loading spinners, verification badges, vote buttons]
│   │   ├── [feature-folders]/   # Feature-specific components (named after app routes or logical groupings)
│   │   │   └── [Each feature folder contains components specific to that functionality/page]
│   │   ├── modals/              # Modal components (shared across features)
│   │   │   └── [confirmation dialogs, image previews, share modals, report forms, generic popup containers]
│   │   └── layouts/             # Layout components
│   │       └── [main layout, auth layout, admin layout, dashboard layout]
│   ├── hooks/                   # Custom React hooks for reusable logic
│   │   └── [authentication, voting, permissions, data fetching, form handling, local storage]
│   ├── lib/                     # Utility functions and configurations
│   │   └── [API client, authentication utilities, validation schemas, configuration files]
│   ├── styles/                  # Additional styles (beyond Tailwind)
│   │   └── [component-specific CSS, custom animations, theme overrides]
│   ├── types/                   # TypeScript type definitions and interfaces
│   │   └── [auth types, donation types, user types, API response types, component prop types]
│   └── utils/                   # Utility functions and helpers
│       └── [date formatting, validation, image processing, text utilities, constants]
├── [configuration files: .env, .eslintrc.json, .gitignore, next.config.js, package.json, etc.]
```

## 🎯 Component Organization Philosophy

### Feature-Based Structure Benefits:
- **Logical Grouping**: Components are organized by the features/pages they serve
- **Easy Navigation**: Developers can quickly find components related to specific functionality
- **Scalability**: New features can be added without restructuring existing components
- **Maintainability**: Changes to a feature are contained within its component folder
- **Team Collaboration**: Different team members can work on different features without conflicts

### Folder Structure Guidelines:

#### App Router (`app/` directory):
- **Route Folders**: Each directory represents a URL route in the application
- **Dynamic Routes**: Use `[param]` syntax for dynamic segments (e.g., `[id]`, `[slug]`)
- **Route Groups**: Use `(group)` syntax to organize routes without affecting URL structure
- **Special Files**: Each route can contain:
  - `page.tsx` (required) - The UI for the route
  - `layout.tsx` (optional) - Shared UI for route and its children
  - `loading.tsx` (optional) - Loading UI
  - `error.tsx` (optional) - Error UI
  - `not-found.tsx` (optional) - 404 UI

#### Component Organization (`components/` directory):
1. **`ui/`**: Base shadcn/ui components (buttons, inputs, cards, etc.)
2. **`common/`**: Shared components used across multiple pages (header, footer, navigation)
3. **`[feature-folders]/`**: Components specific to each feature/functionality
   - Should generally mirror the route structure from `app/` directory
   - Can also include logical groupings that don't directly correspond to routes
4. **`modals/`**: Reusable modal components that can be used across features
5. **`layouts/`**: Layout components for different sections of the application

### Component Folder Naming:
- **Match Route Names**: Component folders should generally match the route names from `app/` directory
- **Logical Groupings**: When components serve multiple routes or cross-cutting concerns, use descriptive names
- **Consistency**: Maintain consistent naming patterns across the application

## ⚙ Key Configuration Files

- **`next.config.js`**: Configures Next.js with App Router enabled, Turbopack settings, image optimization, and API proxy to the PHP backend (`/api` routes proxy to `http://localhost:8000/api`)
- **`tsconfig.json`**: Defines TypeScript compiler options with strict type checking, JSX support, and path mapping for easier imports (using `@/*` for src-level imports)
- **`tailwind.config.ts`**: Customizes Tailwind CSS with shadcn/ui theme variables, extending colors, defining CSS custom properties, and configuring content paths for purging unused styles
- **`.eslintrc.json`**: Sets up ESLint with Next.js recommended rules, TypeScript support, and custom rules for code quality and consistency
- **`.env.example`**: Provides a template for environment variables, such as `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_APP_NAME`, and feature flags for AI matching or geolocation
- **`package.json`**: Lists all project dependencies (Next.js, React, shadcn/ui, Axios, Zustand, etc.) and defines scripts for development (`pnpm dev` with Turbopack), building, linting, and testing

## 🎯 Integration Points for Core Features

- **Route-Based Features**: Each route in `app/` directory has corresponding components in `components/[route-name]/`
- **Shared Functionality**: Common features like voting, search, and navigation are in `components/common/`
- **Cross-Route Features**: Features that span multiple routes (like comments, moderation) have their own component folders
- **Authentication & Authorization**: Auth-related components and route protection logic
- **Role-Based Access Control**: Permission-based component rendering and route access

## 🚀 Development Workflow

- **Development Server**: `pnpm dev` starts the development server with Turbopack enabled by default for faster builds and hot reloading
- **Component Development**: Create feature-specific components in their respective folders
- **Shared Components**: Place reusable components in `components/common/` or `components/ui/`
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

## 📝 Component Naming Conventions

- **PascalCase**: All component files use PascalCase (e.g., `DonationForm.tsx`, `UserProfile.tsx`)
- **Descriptive Names**: Component names should clearly indicate their purpose and functionality
- **Feature Prefixes**: When needed, use feature prefixes for clarity (e.g., `DonationCard.tsx`, `ProfileEditForm.tsx`)
- **Consistency**: Maintain consistent naming patterns within each feature folder

This feature-based Next.js 15+ App Router structure provides a modern, organized, and scalable foundation for the donation platform frontend, making it easier for teams to collaborate and maintain the codebase as it grows.