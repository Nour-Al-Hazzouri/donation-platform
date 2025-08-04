import { MainLayout } from "@/components/layouts/MainLayout";

import CommunityFeed from "@/components/community/communityFeed";
export const metadata = {
  title: "Community - Lebanon Donation Platform",
  description: "Connect with others and share donation-related posts in our community.",
};

export default function CommunityPage() {
  return (
    <MainLayout>
      <div className="container py-8">
        <CommunityFeed />
      </div>
    </MainLayout>
  );
}