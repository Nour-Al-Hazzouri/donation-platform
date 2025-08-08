'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface AuthGuardProps {
  isLoggedIn: boolean
  children: React.ReactNode
}

export function AuthGuard({ isLoggedIn, children }: AuthGuardProps) {
  const router = useRouter()

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Login Required</h2>
            <p className="text-gray-600 mb-6">You need to be logged in to create a request.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full bg-red-500 hover:bg-red-600"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/')} 
                variant="outline" 
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
