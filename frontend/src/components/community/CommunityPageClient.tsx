"use client"

import { useState } from 'react';
import { CommunityPost } from '@/types';
import CommunityFeed from "@/components/community/communityFeed";
import CommunityWritePost from "@/components/community/communityWritePost";

export default function CommunityPageClient() {
  const [isWritingPost, setIsWritingPost] = useState(false);
  const [newPost, setNewPost] = useState<CommunityPost | null>(null);

  const handlePostSubmit = (createdPost: CommunityPost) => {
    setNewPost(createdPost);
    setIsWritingPost(false);
  };

  return (
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
  );
}