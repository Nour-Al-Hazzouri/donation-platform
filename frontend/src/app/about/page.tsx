import { Suspense } from 'react';
import AboutClient from '@/components/about/AboutClient';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default function AboutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutClient />
    </Suspense>
  );
}