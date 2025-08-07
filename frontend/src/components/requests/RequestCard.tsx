import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface RequestCardProps {
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

export function RequestCard({ 
  name, 
  title, 
  description, 
  imageUrl, 
  avatarUrl, 
  initials, 
  isVerified = true,
  searchTerm = ""
}: RequestCardProps) {
  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Avatar className="h-12 w-12 mr-3">
            <AvatarImage src={avatarUrl || "/placeholder.svg"} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">
              {highlightText(name, searchTerm)}
            </h3>
            {isVerified && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                ✓
              </Badge>
            )}
          </div>
        </div>
        
        <h4 className="font-semibold text-gray-900 mb-3">
          {highlightText(title, searchTerm)}
        </h4>
        
        {imageUrl && (
          <div className="mb-4">
            <img 
              src={imageUrl || "/placeholder.svg"} 
              alt={title} 
              className="w-full h-32 object-cover rounded-md"
            />
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-4">
          {highlightText(description, searchTerm)}
        </p>
        
        <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
          Donate Now
        </Button>
      </CardContent>
    </Card>
  )
}
