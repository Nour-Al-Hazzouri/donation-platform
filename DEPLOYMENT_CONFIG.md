# Deployment Configuration Guide

## Environment Variables Setup

### Frontend (Vercel)
Set these environment variables in your Vercel dashboard:

```
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app
NEXT_PUBLIC_APP_NAME=GiveLeb
```

### Backend (Railway)
Set these environment variables in your Railway dashboard:

```
APP_NAME=GiveLeb
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-app-name.railway.app

# Database (Supabase)
DB_CONNECTION=pgsql
DB_HOST=db.your-project.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your-supabase-password

# Session & Cache
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# CORS
SANCTUM_STATEFUL_DOMAINS=your-frontend-domain.vercel.app
SESSION_DOMAIN=.railway.app

# Mail (optional - configure if needed)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

## Deployment Steps

### 1. Supabase Setup
1. Create new project at https://supabase.com
2. Go to Settings > Database
3. Copy connection details
4. Run migrations: `php artisan migrate --force`

### 2. Railway Backend Deployment
1. Connect GitHub repository
2. Select backend folder as root directory
3. Add environment variables from above
4. Deploy automatically triggers

### 3. Vercel Frontend Deployment  
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy automatically triggers

## Configuration Files Status
✅ `frontend/vercel.json` - Complete
✅ `frontend/next.config.ts` - Updated for production
✅ `backend/railway.json` - Complete  
✅ `backend/nixpacks.toml` - Complete
✅ `backend/Procfile` - Complete
✅ Health check endpoint added to API routes
