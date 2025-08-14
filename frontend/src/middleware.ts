import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const adminRoutes = ['/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read cookie
  const authStorage = request.cookies.get('auth-storage')?.value;
  let isAuthenticated = false;
  let isAdmin = false;

  if (authStorage) {
    try {
      const parsedStorage = JSON.parse(authStorage);
      isAuthenticated = !!parsedStorage?.state?.user?.token;
      isAdmin = !!parsedStorage?.state?.user?.isAdmin;
    } catch (error) {
      console.error('Error parsing auth storage:', error);
    }
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect non-admin users away from admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.png$|.*\.jpg$|.*\.svg$).*)',
  ],
};