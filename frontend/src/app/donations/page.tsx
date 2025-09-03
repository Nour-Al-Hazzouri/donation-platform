import { Suspense } from 'react';
import { DonationsPageClient } from './DonationsPageClient';

export default function DonationsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DonationsPageClient />
    </Suspense>
  );
}
