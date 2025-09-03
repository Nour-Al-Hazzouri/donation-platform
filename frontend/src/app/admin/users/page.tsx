import { Suspense } from 'react';
import { UsersManagementPageClient } from './UsersManagementPageClient';

export default function UsersManagementPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UsersManagementPageClient />
    </Suspense>
  );
}