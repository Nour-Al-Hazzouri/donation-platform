"use client"

import { ArrowLeft, Heart, BookOpen, Award, Home, School, Droplets, Users, Globe, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MOCK_BLOG_POSTS } from "../../../data/blog-posts"
import { DETAILED_BLOG_CONTENT } from "../../../data/blog-content"
import ReactMarkdown from "react-markdown"

interface BlogPostDetailProps {
  postId: number
  onClose: () => void
}

export default function BlogPostDetail({ postId, onClose }: BlogPostDetailProps) {
  const post = MOCK_BLOG_POSTS.find((p) => p.id === postId)
  const detailedContent = DETAILED_BLOG_CONTENT[postId as keyof typeof DETAILED_BLOG_CONTENT]

  if (!post || !detailedContent) return null

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={onClose}
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
          <ReactMarkdown components={{
            p: ({children}) => <p className="text-gray-700 leading-relaxed">{children}</p>
          }}>
            {detailedContent.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}