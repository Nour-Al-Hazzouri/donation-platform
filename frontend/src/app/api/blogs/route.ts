// C:\Users\MC\Desktop\Donation\donation-platform\frontend\src\app\api\blogs\route.ts
import { NextResponse } from 'next/server'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const headers: Record<string, string> = {}
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const response = await axios.get(`${API_BASE_URL}/announcements`, {
      params,
      headers
    })
    
    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch announcements' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data'
    }
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const response = await axios.post(`${API_BASE_URL}/announcements`, formData, {
      headers
    })
    
    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create announcement' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const formData = await request.formData()
    
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
      'X-HTTP-Method-Override': 'PUT'
    }
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const response = await axios.post(`${API_BASE_URL}/announcements/${id}`, formData, {
      headers
    })
    
    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to update announcement' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    const headers: Record<string, string> = {}
    const authHeader = request.headers.get('Authorization')
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const response = await axios.delete(`${API_BASE_URL}/announcements/${id}`, {
      headers
    })
    
    return NextResponse.json(response.data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to delete announcement' },
      { status: error.response?.status || 500 }
    )
  }
}