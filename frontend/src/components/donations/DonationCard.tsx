import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface DonationCardProps {
  name: string
  title: string
  description: string
  imageUrl?: string
  avatarUrl?: string
  initials: string
  isVerified?: boolean
  searchTerm?: string
}

// Helper function to highlight matching text
function highlightText(text: string, searchTerm: string) {
  if (!searchTerm) return text
  
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const parts = text.split(regex)
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

export function DonationCard({ 
  name, 
  title, 
  description, 
  imageUrl, 
  avatarUrl, 
  initials, 
  isVerified = true,
  searchTerm = ""
}: DonationCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <div className="relative mr-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {isVerified && (
              <div className="absolute -top-1 -right-1">
                <Image 
                  src="/verification.png" 
                  alt="Verified" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {highlightText(name, searchTerm)}
            </h3>
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-3">
          {highlightText(title, searchTerm)}
        </h4>
        
        {/* Added image under the title */}
        <div className="mb-4">
          <Image 
            src="/donation-banner.jpg" 
            alt="Donation" 
            width={400}
            height={200}
            className="w-full h-32 object-cover rounded-md"
          />
        </div>
        
        {imageUrl && (
          <div className="mb-4">
            <img 
              src={imageUrl || "/placeholder.svg"} 
              alt={title} 
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-4 flex-grow">
          {highlightText(description, searchTerm)}
        </p>
        
        <div className="mt-auto">
          <Button className="w-full bg-red-500 hover:bg-red-600 text-white h-10">
            Request Now
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}