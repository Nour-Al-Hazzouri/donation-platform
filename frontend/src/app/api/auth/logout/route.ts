import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    await authService.logout();
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to logout' },
      { status: error.response?.status || 500 }
    );
  }
}