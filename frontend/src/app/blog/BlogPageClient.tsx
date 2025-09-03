'use client'

import { MainLayout } from "@/components/layouts/MainLayout";
import NewsBlogSection from "@/components/blog/NewsBlogSection";

export function BlogPageClient() {
  return (
    <MainLayout>
      <NewsBlogSection />
    </MainLayout>
  );
}
