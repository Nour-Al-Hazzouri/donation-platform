"use client"

import { MainLayout } from "@/components/layouts/MainLayout";
import CommunityFeed from "@/components/community/communityFeed";
import CommunityWritePost from "@/components/community/communityWritePost";
import { useState } from 'react';

export default function CommunityPage() {
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [newPost, setNewPost] = useState<CommunityPost | null>(null);

  const handlePostSubmit = (createdPost: CommunityPost) => {
    setNewPost(createdPost);
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
          <CommunityFeed 
            onWritePost={() => setIsWritingPost(true)} 
            newPost={newPost}
          />
        )}
      </div>
    </MainLayout>
  );
}

interface CommunityPost {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    verified: boolean;
  };
  images?: string[];
  likes: number;
  dislikes: number;
  comments: string[];
  createdAt: string;
  tags: string[];
}