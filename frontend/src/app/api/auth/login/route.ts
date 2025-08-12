import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await authService.login(body);
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to login' },
      { status: error.response?.status || 500 }
    );
  }
}