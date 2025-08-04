"use client"

import { MainLayout } from "@/components/layouts/MainLayout";
import CommunityFeed from "@/components/community/communityFeed";
import CommunityWritePost from "@/components/community/communityWritePost";
import { useState } from 'react';

export default function CommunityPage() {
  const [isWritingPost, setIsWritingPost] = useState(false);

  const handlePostSubmit = () => {
    // Handle any post-submission logic if needed
    setIsWritingPost(false);
  };

  return (
    <MainLayout>
      <div className="container py-8">
        {isWritingPost ? (
          <CommunityWritePost 
            onCancel={() => setIsWritingPost(false)}
            onSubmitSuccess={handlePostSubmit}
          />
        ) : (
          <CommunityFeed onWritePost={() => setIsWritingPost(true)} />
        )}
      </div>
    </MainLayout>
  );
}