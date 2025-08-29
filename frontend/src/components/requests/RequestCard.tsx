'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface RequestCardProps {
  id: number
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified?: boolean
  searchTerm?: string
}

function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function RequestCard({ 
  id,
  name, 
  title, 
  description, 
  imageUrl, 
  avatarUrl, 
  initials, 
  isVerified = true,
  searchTerm = ""
}: RequestCardProps) {
  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/requests/${id}`)
  }

  const handleDonateClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/donate/${id}`)
  }

  return (
    <Card 
      className="bg-background shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] flex flex-col h-full"
      onClick={handleCardClick}
    >
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4 gap-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {isVerified && (
              <div className="absolute -top-1 -right-1">
                <Image
                  src="/verification.png"
                  alt="Verified"
                  width={20}
                  height={20}
                  className="rounded-full border-2 border-background"
                />
              </div>
            )}
          </div>
          <h3 className="font-semibold text-foreground">
            {highlightText(name, searchTerm)}
          </h3>
        </div>
        
        <h4 className="font-semibold text-foreground mb-3">
          {highlightText(title, searchTerm)}
        </h4>
        
        {imageUrl && (
          <div className="mb-4">
            <Image 
              src={imageUrl || "/placeholder.svg"} 
              alt={title} 
              width={500}
              height={500}
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-4 flex-grow">
          {highlightText(description, searchTerm)}
        </p>
        
        <Button 
          onClick={handleDonateClick}
          className="w-full bg-red-500 hover:bg-red-600 text-white mt-auto"
        >
          Donate Now
        </Button>
      </CardContent>
    </Card>
  )
}
