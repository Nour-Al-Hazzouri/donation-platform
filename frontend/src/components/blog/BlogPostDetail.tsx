"use client"

import React, { useEffect, useState } from "react";
import { ArrowLeft, Heart, BookOpen, Award, Home, School, Droplets, Users, Globe, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import { blogService, Announcement } from "@/lib/api/blogs";

interface BlogPostDetailProps {
  postId: number;
  onClose: () => void;
}

export default function BlogPostDetail({ postId, onClose }: BlogPostDetailProps) {
  const [post, setPost] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPost = await blogService.getById(postId);
        setPost(fetchedPost);
      } catch (err) {
        setError("Failed to fetch blog post details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [postId]);

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return null;

  return (
    <div className="bg-background" id="blog-post-top">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-muted z-10 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{post.title}</h1>
                <div className="flex items-center gap-4 text-muted-foreground text-sm mt-1">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <span className={`px-4 py-2 rounded-full text-lg font-bold ${getPriorityStyle(post.priority)}`}>
              {post.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Icon */}
        <div className="flex items-center justify-center h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden bg-muted">
          {post.image_full_urls && post.image_full_urls.length > 0 ? (
            <img src={post.image_full_urls[0]} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <Heart className="w-32 h-32 text-red-500" />
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown components={{
            p: ({ children }) => <p className="text-muted-foreground leading-relaxed">{children}</p>
          }}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}