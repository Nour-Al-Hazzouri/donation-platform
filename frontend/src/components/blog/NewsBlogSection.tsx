"use client"

import { Calendar, ArrowRight, ArrowLeft, BookOpen, Heart, Globe, Users, Droplets, School, Home, MessageCircle, Award } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { MOCK_BLOG_POSTS } from "../../../data/blog-posts"
import { DETAILED_BLOG_CONTENT } from "../../../data/blog-content"

export default function NewsBlogSection() {
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const blogPosts = MOCK_BLOG_POSTS

  const handlePostClick = (postId: number) => {
    setSelectedPost(postId)
  }

  const handleClosePost = () => {
    setSelectedPost(null)
  }

  if (selectedPost) {
    const post = blogPosts.find((p) => p.id === selectedPost)
    const detailedContent = DETAILED_BLOG_CONTENT[selectedPost as keyof typeof DETAILED_BLOG_CONTENT]

    if (!post || !detailedContent) return null

    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleClosePost}
                  variant="destructive"
                  size="icon"
                  className="rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-black">{post.title}</h1>
                  <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{detailedContent.readTime}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${post.tagColor}`}>{post.tag}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Hero Icon */}
          <div className="flex items-center justify-center h-64 md:h-96 w-full mb-8 rounded-2xl overflow-hidden bg-gray-100">
            {post.id === 1 && <Heart className="w-32 h-32 text-pink-500" />}
            {post.id === 2 && <BookOpen className="w-32 h-32 text-pink-500" />}
            {post.id === 3 && <Award className="w-32 h-32 text-pink-500" />}
            {post.id === 4 && <Home className="w-32 h-32 text-blue-500" />}
            {post.id === 5 && <School className="w-32 h-32 text-blue-500" />}
            {post.id === 6 && <Droplets className="w-32 h-32 text-blue-500" />}
            {post.id === 7 && <Users className="w-32 h-32 text-green-500" />}
            {post.id === 8 && <Globe className="w-32 h-32 text-green-500" />}
            {post.id === 9 && <MessageCircle className="w-32 h-32 text-green-500" />}
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">{detailedContent.content}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="bg-white py-8 px-4" id="blog">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl md:text-5xl font-bold text-black text-center mb-8">Latest News and Blog</h2>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Card 
              key={post.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePostClick(post.id)}
            >
              {/* Icon */}
              <div className="flex items-center justify-center h-64 w-full bg-gray-100">
                {post.id === 1 && <Heart className="w-24 h-24 text-pink-500" />}
                {post.id === 2 && <BookOpen className="w-24 h-24 text-pink-500" />}
                {post.id === 3 && <Award className="w-24 h-24 text-pink-500" />}
                {post.id === 4 && <Home className="w-24 h-24 text-blue-500" />}
                {post.id === 5 && <School className="w-24 h-24 text-blue-500" />}
                {post.id === 6 && <Droplets className="w-24 h-24 text-blue-500" />}
                {post.id === 7 && <Users className="w-24 h-24 text-green-500" />}
                {post.id === 8 && <Globe className="w-24 h-24 text-green-500" />}
                {post.id === 9 && <MessageCircle className="w-24 h-24 text-green-500" />}
              </div>

              <CardContent className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>

                {/* Title and Tag */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-2">{post.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${post.tagColor}`}>
                    {post.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{post.description}</p>
              </CardContent>

              <CardFooter className="px-6 pb-6 pt-0">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-[#ee201c] font-semibold text-sm hover:no-underline flex items-center gap-2 group"
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