// Consolidated store exports - all stores are now in /src/store/
export * from './authStore';
export * from './donationsStore';
export * from './requestsStore';

// Re-export specific items for easier imports
export { useAuthStore } from './authStore';
export { useDonationsStore, initialDonationsData } from './donationsStore';
export { useRequestsStore } from './requestsStore';

// Type exports for external usage
export type { DonationData } from './donationsStore';
export type { RequestData } from './requestsStore';