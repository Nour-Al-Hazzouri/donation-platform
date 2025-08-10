import { RequestCard } from "./RequestCard"
import { useRequestsStore, type RequestData } from "@/store/requestsStore"
import { useEffect, useState } from "react"
import { initialRequestsData } from "@/store/requestsStore"

interface RequestCardsProps {
  requests: RequestData[]
  searchTerm: string
}

export function RequestCards({ requests, searchTerm }: RequestCardsProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No requests found</div>
        <p className="text-gray-400">
          {searchTerm 
            ? `Try adjusting your search term "${searchTerm}" or browse all requests.`
            : "There are no donation requests available at the moment."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {requests.map((request) => (
        <RequestCard
          key={request.id}
          id={request.id}
          name={request.name}
          title={request.title}
          description={request.description}
          imageUrl={request.imageUrl}
          avatarUrl={request.avatarUrl}
          initials={request.initials}
          isVerified={request.isVerified}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}

// Export the RequestData type and initial data for backward compatibility
export type { RequestData }
export { initialRequestsData as requestsData }
