import { Suspense } from 'react';
import { BlogPageClient } from './BlogPageClient';

export const metadata = {
  title: "Blog - Lebanon Donation Platform",
  description: "Latest news, updates, and stories from our donation platform.",
};

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageClient />
    </Suspense>
  );
}