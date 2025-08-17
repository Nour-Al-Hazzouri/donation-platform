export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

import { MainLayout } from "@/components/layouts/MainLayout";
import CommunityPageClient from "@/components/community/CommunityPageClient";

export default function CommunityPage() {
  return (
    <MainLayout>
      <CommunityPageClient />
    </MainLayout>
  );
}