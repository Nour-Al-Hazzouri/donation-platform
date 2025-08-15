'use client'

import { useEffect } from 'react';
import { Calendar, ArrowRight, BookOpen, Heart, Globe, Users, Droplets, School, Home, MessageCircle, Award } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MOCK_BLOG_POSTS } from "../../../data/blog-posts"
import BlogPostDetail from "./BlogPostDetail"
import { blogService } from '@/lib/api/blogs';

export default function NewsBlogSection() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await blogService.getAll();
        setBlogPosts(posts.data);
      } catch (err) {
        setError('Failed to load announcements');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    window.scrollTo(0, 0)
    setSelectedPost(postId)
  }

  const handleClosePost = () => {
    setSelectedPost(null)
  }

  if (selectedPost) {
    return (
      <div className="fixed inset-0 z-50 bg-background overflow-y-auto" style={{ top: 0 }}>
        <BlogPostDetail postId={selectedPost} onClose={handleClosePost} />
      </div>
    )
  }

  return (
    <section className="bg-background py-8 px-4" id="blog">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">Latest News and Blog</h2>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : error ? (
            <div className="col-span-full text-center py-12 text-red-500">{error}</div>
          ) : (
            blogPosts.map((post) => (
              <Card 
                key={post.id}
                className="flex flex-col h-full cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                onClick={() => handlePostClick(post.id)}
              >
                {/* Image Container */}
                <div className="flex items-center justify-center h-64 w-full bg-muted overflow-hidden">
                  {post.image_full_urls && post.image_full_urls.length > 0 ? (
                    <img
                      src={post.image_full_urls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : post.image_urls && post.image_urls.length > 0 ? (
                    <img
                      src={post.image_urls[0]}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                      <Heart className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <CardContent className="p-6 flex-grow">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Invalid Date'}</span>
                  </div>

                  {/* Title and Tag */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-foreground mb-2">{post.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${post.tagColor}`}>
                      {post.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">{post.content}</p>
                </CardContent>

                <CardFooter className="px-6 pb-6">
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-red-500 font-semibold text-sm hover:no-underline flex items-center gap-2 group w-full justify-start"
                  >
                    READ MORE
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}