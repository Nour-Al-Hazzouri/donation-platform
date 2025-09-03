import { Suspense } from 'react';
import { CommunityPageClient } from './CommunityPageClient';

export default function CommunityPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CommunityPageClient />
    </Suspense>
  );
}