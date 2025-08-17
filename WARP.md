# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**GiveLeb** is a full-stack donation platform built with Laravel 12 (backend) and Next.js 15 (frontend). It's a comprehensive community-driven platform that enables users to post donation requests, offer donations, manage community posts with voting/commenting systems, and includes admin features for verification, user management, and moderation.

## Architecture

### Backend (Laravel 12 + SQLite)
- **API-First Architecture**: RESTful API with Laravel Sanctum authentication
- **Role-Based Permissions**: Uses Spatie Laravel Permission with Admin/Moderator/User roles
- **Image Handling**: Intervention/Image package for image processing and storage
- **Database**: SQLite for development, supports MySQL/PostgreSQL for production

### Frontend (Next.js 15 + TypeScript)
- **Server Components**: Utilizes Next.js 15 features with Turbopack
- **State Management**: Zustand for state, TanStack Query for API state
- **UI Library**: Radix UI components with Tailwind CSS v4
- **Form Handling**: React Hook Form with Zod validation

### Key Domain Models
- **Users**: Authentication with verification system, role-based permissions, location-based filtering
- **Donation Events**: Dual-type system (requests/offers) with goal tracking and status management
- **Community System**: Posts with image uploads, voting (upvote/downvote), nested comments
- **Verification**: Document upload system for user verification with admin approval
- **Notifications**: Type-based notification system with read/unread states
- **Admin Features**: Announcements, user management, content moderation

## Development Commands

### Backend (Laravel)
```bash
# Development server with all services (from backend/)
composer run dev

# Individual services
php artisan serve                    # API server (port 8000)
php artisan queue:listen --tries=1   # Queue worker
php artisan pail --timeout=0         # Log viewer

# Database operations
php artisan migrate                   # Run migrations
php artisan migrate:fresh --seed     # Fresh database with seeders
php artisan db:seed                   # Run seeders only

# Testing
composer test                         # Run PHPUnit tests
php artisan test                      # Alternative test runner
php artisan test --filter AuthTest    # Run specific test

# Code quality
./vendor/bin/pint                     # Laravel Pint (code formatter)
./vendor/bin/pint --test             # Check formatting without fixing

# Debugging/Maintenance
php artisan config:clear              # Clear config cache
php artisan storage:link              # Link storage for file uploads
php artisan queue:work                # Process queue jobs
php artisan tinker                    # Laravel REPL
```

### Frontend (Next.js)
```bash
# Development (from frontend/)
pnpm dev                             # Dev server with Turbopack
npm run dev                          # Alternative with npm

# Build and deployment
pnpm build                           # Production build
pnpm start                           # Start production server

# Code quality
pnpm lint                            # ESLint checking
pnpm lint --fix                      # Auto-fix linting issues
```

## Testing Strategy

### Backend Testing (PHPUnit/Pest)
- **Feature Tests**: API endpoint testing with authentication/authorization
- **Database Testing**: Uses SQLite in-memory database for fast tests
- **File Upload Testing**: Tests image upload functionality with temporary files

### Running Specific Tests
```bash
# Run all tests
php artisan test

# Run specific test files
php artisan test --filter AnnouncementTest
php artisan test --filter AuthControllerTest
php artisan test tests/Feature/CommunityPostTest.php

# Run with coverage (if configured)
php artisan test --coverage
```

## Database Architecture

### Core Tables
- `users` - User accounts with roles and verification status
- `locations` - Governorate/district locations for Lebanon
- `donation_events` - Both donation requests and offers
- `donation_transactions` - Pledges and confirmations for events
- `community_posts` - User-generated content with image support
- `comments` - Nested comments on community posts
- `votes` - Upvote/downvote system for posts
- `verifications` - Document upload system for user verification
- `announcements` - Admin announcements with priority levels
- `notifications` - User notification system

### Key Relationships
- Users have many donation events, posts, and transactions
- Donation events belong to users and locations
- Community posts have many comments and votes
- Verification requests link users to uploaded documents

## API Authentication

The API uses Laravel Sanctum with Bearer tokens:
```bash
# Login and get token
curl -X POST /api/auth/login \
  -d "email=user@example.com&password=password"

# Use token in requests
curl -H "Authorization: Bearer {token}" /api/donation-events
```

## File Uploads & Storage

### Image Processing
- Max 5MB per image file
- Automatic resizing (max 1200px width)
- Quality optimization (85%)
- Supports: JPEG, PNG, JPG, GIF, WebP

### Storage Locations
- **Avatars**: `storage/app/public/avatars/`
- **Announcements**: `storage/app/public/announcements/`
- **Community Posts**: `storage/app/public/community/posts/`
- **Donation Events**: `storage/app/public/donation-events/`
- **Verifications**: `storage/app/private/verifications/` (private)

## Environment Setup

### Backend Requirements
- PHP 8.2+
- Composer
- SQLite (default) or MySQL/PostgreSQL
- Required PHP extensions: gd, sqlite3, mbstring

### Frontend Requirements
- Node.js 18+
- pnpm (preferred) or npm

### Development Setup
1. **Backend**: Copy `.env.example` to `.env`, run `php artisan key:generate`
2. **Database**: Run `php artisan migrate --seed` for sample data
3. **Storage**: Run `php artisan storage:link` for file uploads
4. **Frontend**: Run `pnpm install` for dependencies

## Permission System

### Roles
- **Admin**: Full system access, user management, content moderation
- **Moderator**: Content management, announcement creation
- **User**: Basic access, must be verified to create donation events

### Key Permissions
- User management: `view users`, `create users`, `edit users`, `delete users`
- Content moderation: `manage posts`, `moderate content`
- Donation events: Requires user verification (approved verification request)

## Development Notes

### API Rate Limiting
- Authentication endpoints may have rate limiting
- File upload endpoints have size and type restrictions

### Queue System
- Uses database queue driver by default
- Email notifications and file processing use queues
- Run `php artisan queue:listen` for development

### Caching
- Uses database cache driver
- User permissions are cached via Spatie package
- Clear cache with `php artisan cache:clear`

## Frontend State Management

### Zustand Stores
- Authentication state and user data
- UI state (modals, themes)
- Form state management

### TanStack Query
- API data fetching and caching
- Optimistic updates for votes/comments
- Background refetching

### API Integration
- Axios for HTTP requests
- Cookie-based auth token storage
- Automatic token refresh handling
