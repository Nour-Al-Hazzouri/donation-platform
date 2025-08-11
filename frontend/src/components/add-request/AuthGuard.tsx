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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4 text-foreground">Login Required</h2>
            <p className="text-muted-foreground mb-6">You need to be logged in to create a request.</p>
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/login')} 
                className="w-full bg-red-500 hover:bg-red-600 text-white"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push('/')} 
                variant="outline" 
                className="w-full border-border hover:bg-accent hover:text-accent-foreground"
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
