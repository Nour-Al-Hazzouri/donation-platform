import { DonationCard } from "@/components/donations/DonationCard"

// This interface is now imported from donationsStore.ts
// Keeping this here for backward compatibility
import type { DonationData } from "@/store/donationsStore"


interface DonationCardsProps {
  donations: DonationData[]
  searchTerm: string
}

export function DonationCards({ donations, searchTerm }: DonationCardsProps) {
  if (donations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">No donations available</div>
        <p className="text-gray-400">
          {searchTerm 
            ? `Try adjusting your search term "${searchTerm}" or browse all donations.`
            : "There are no donation offers available at the moment."
          }
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {donations.map((donation) => (
        <DonationCard
          key={donation.id}
          id={donation.id}
          name={donation.name}
          title={donation.title}
          description={donation.description}
          imageUrl={donation.imageUrl} // Uncommented to show images
          avatarUrl={donation.avatarUrl}
          initials={donation.initials}
          isVerified={donation.isVerified}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  )
}