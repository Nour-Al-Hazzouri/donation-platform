"use client"

import { Calendar, ArrowRight, BookOpen, Heart, Globe, Users, Droplets, School, Home, MessageCircle, Award } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MOCK_BLOG_POSTS } from "../../../data/blog-posts"
import BlogPostDetail from "./BlogPostDetail"

export default function NewsBlogSection() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const blogPosts = MOCK_BLOG_POSTS

  const handlePostClick = (postId: number) => {
    // First scroll to top to ensure consistent starting position
    window.scrollTo(0, 0)
    // Then set the selected post which will render the detail view
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
          {blogPosts.map((post) => (
            <Card 
              key={post.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => handlePostClick(post.id)}
            >
              {/* Icon */}
              <div className="flex items-center justify-center h-64 w-full bg-muted">
                {post.id === 1 && <Heart className="w-24 h-24 text-primary" />}
                {post.id === 2 && <BookOpen className="w-24 h-24 text-primary" />}
                {post.id === 3 && <Award className="w-24 h-24 text-primary" />}
                {post.id === 4 && <Home className="w-24 h-24 text-primary" />}
                {post.id === 5 && <School className="w-24 h-24 text-primary" />}
                {post.id === 6 && <Droplets className="w-24 h-24 text-primary" />}
                {post.id === 7 && <Users className="w-24 h-24 text-primary" />}
                {post.id === 8 && <Globe className="w-24 h-24 text-primary" />}
                {post.id === 9 && <MessageCircle className="w-24 h-24 text-primary" />}
              </div>

              <CardContent className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>

                {/* Title and Tag */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground mb-2">{post.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${post.tagColor}`}>
                    {post.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{post.description}</p>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-primary font-semibold text-sm hover:no-underline flex items-center gap-2 group"
                >
                  READ MORE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}