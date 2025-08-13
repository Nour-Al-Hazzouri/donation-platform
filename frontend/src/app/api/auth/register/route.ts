import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/api/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await authService.register(body);
    
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error.response?.data?.message || 'Failed to register user' },
      { status: error.response?.status || 500 }
    );
  }
}