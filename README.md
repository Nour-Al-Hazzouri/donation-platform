# GiveLeb - Donation Platform for Lebanon

<div align="center">
  <img src="frontend/public/logoooo-removebg-preview.png" alt="GiveLeb Logo" width="200"/>
  
  **A comprehensive donation platform connecting donors with those in need across Lebanon**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)](https://nextjs.org/)
  [![Laravel](https://img.shields.io/badge/Laravel-12+-red)](https://laravel.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
  [![PHP](https://img.shields.io/badge/PHP-8.2+-purple)](https://www.php.net/)
</div>

## 🌟 Overview

GiveLeb is a modern, full-stack donation platform that connects generous donors with individuals or organizations in need. The platform is designed with transparency, security, and community engagement at its core, creating a trusted ecosystem for giving and receiving support.

## ✨ Key Features

### 🎯 Core Functionality
- **Donation Management**: Users can create donations, request donations, and contribute to others
- **Request System**: Easily request support from the community
- **Contribution Tracking**: Follow your donations and requests

### 👥 User Features
- **Profile Management**: Create and edit user profiles
- **Account Verification**: Users can apply for verification, and admins can manage the process
- **Notifications**: Real-time updates for donations, requests, blogs, votes, comments, and verification status

### 🏘️ Community Features
- **Community Posts**: Users can share posts with the community
- **Engagement Tools**: Upvote, downvote, and comment on posts
- **Blog Platform**: Stay updated with blog posts and platform news

### 📊 Administrative Dashboard
- **Statistics & Analytics**: View platform metrics, including total users, donations, and contributions
- **User Management**: Admins can oversee and manage users
- **Verification Management**: Handle and review user verification requests
- **Location Management**: Admins can manage donation-related locations
- **Blog Management**: Full control over blogs posted on the platform

### 🔔 Communication
- **Notification System**: Users receive alerts related to donations, requests, community activity, blog posts, and account verification

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15.4.2 with React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom components
- **UI Components**: Radix UI primitives for accessibility
- **State Management**: Zustand for client state
- **Data Fetching**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion for smooth interactions
- **Theme**: Next-themes for dark/light mode support

### Backend Stack
- **Framework**: Laravel 12+ with PHP 8.2+
- **Authentication**: Laravel Sanctum for API authentication
- **Authorization**: Spatie Laravel Permission for role-based access
- **Database**: SQLite (development)
- **Image Processing**: Intervention Image for file handling
- **API**: RESTful API with comprehensive resource controllers

### Development Tools
- **Package Managers**: pnpm (frontend), Composer (backend)
- **Code Quality**: ESLint, Laravel Pint for code formatting
- **Testing**: PHPUnit for backend testing
- **Development**: Turbopack for fast development builds

## 📁 Project Structure

```
GiveLeb/
├── frontend/                 # Next.js Frontend Application
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── blog/        # Blog and content pages
│   │   │   ├── community/   # Community features
│   │   │   ├── donations/   # Donation management
│   │   │   └── profile/     # User profile pages
│   │   ├── components/      # Reusable React components
│   │   │   ├── ui/          # Base UI components (Radix UI)
│   │   │   ├── admin/       # Admin-specific components
│   │   │   ├── auth/        # Authentication components
│   │   │   └── common/      # Shared components
│   │   ├── contexts/        # React contexts for state management
│   │   ├── lib/            # Utility functions and API clients
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets and images
│   └── data/               # Mock data and content
├── backend/                # Laravel Backend API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/API/  # API controllers
│   │   │   ├── Requests/         # Form request validation
│   │   │   └── Resources/        # API resource transformers
│   │   ├── Models/              # Eloquent models
│   │   ├── Policies/            # Authorization policies
│   │   └── Services/            # Business logic services
│   ├── database/
│   │   ├── migrations/          # Database schema migrations
│   │   └── seeders/            # Database seeders
│   └── routes/                 # API route definitions
└── docs/                   # Documentation files
```

## Starting the development servers (localhost):

### backend:

** Make sure you have a server that can run php like laragon or xamp**

- **For laragon: install laragon and then set up environment variables (Press Win + S → Search "Edit environment variables" → Open):**
  
  - C:\laragon\bin\php\php-8.3.x-Win32-vs16-x64
    
  - C:\laragon\bin\composer
    
  - C:\laragon\bin\mysql\mysql-8.0.x-winx64\bin
    **(Replace x with your actual version numbers.)**
    
- The rest of the steps will be in the README.md file in the backend directory.
  

### frontend:

- cd frontend
  
- pnpm install (npm install -g pnpm - if you don't have pnpm)
  
- pnpm dev

## 👥 Team

Meet the talented team behind GiveLeb:

- **Nour Al Hazzouri** - Team Leader, Front-end Developer
- **Mariam Kanj** - UI/UX Designer, Front-end Developer  
- **Ali Atat** - Front-end Developer
- **Ayman Dandan** - Back-end Developer
- **Mouhamad Moussa** - Back-end Developer

---

<div align="center">
  <strong>Making a difference, one donation at a time 🇱🇧</strong>
</div>
