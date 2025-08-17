import { Suspense } from 'react';
import HomeClient from '@/components/home/HomeClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}