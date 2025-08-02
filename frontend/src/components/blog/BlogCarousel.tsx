'use client'

import React from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight, ChevronLeftIcon, ChevronRightIcon, BookOpen, Heart, Globe, Users, Droplets, School, Home, MessageCircle, Award } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COLORS } from '@/lib/constants'
import { MOCK_BLOG_POSTS } from '../../../data/blog-posts'
import { useState } from 'react'
import BlogPostDetail from './BlogPostDetail'
import Link from 'next/link'

interface BlogCarouselProps {
  className?: string
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [visibleCards, setVisibleCards] = React.useState(3)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  
  const blogPosts = MOCK_BLOG_POSTS
  
  // Clone the first few items to create infinite loop effect
  const extendedBlogPosts = [...blogPosts, ...blogPosts.slice(0, visibleCards)]

  React.useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) { // xs
        setVisibleCards(1)
      } else if (window.innerWidth < 768) { // sm
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) { // md
        setVisibleCards(2)
      } else { // lg+
        setVisibleCards(3)
      }
    }

    updateVisibleCards()
    window.addEventListener('resize', updateVisibleCards)
    return () => window.removeEventListener('resize', updateVisibleCards)
  }, [])

  const scrollLeft = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev - 1
      return newIndex < 0 ? blogPosts.length - 1 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  const scrollRight = () => {
    setIsTransitioning(true)
    setCurrentIndex(prev => {
      const newIndex = prev + 1
      return newIndex >= blogPosts.length ? 0 : newIndex
    })
    setTimeout(() => setIsTransitioning(false), 300)
  }

  // Auto-scroll every 5 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !selectedPost) {
        scrollRight()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning, selectedPost])

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
      <div className="fixed inset-0 z-50 bg-white overflow-y-auto" style={{ top: 0 }}>
        <BlogPostDetail postId={selectedPost} onClose={handleClosePost} />
      </div>
    )
  }

  return (
    <section className={cn("py-8 sm:py-12", className)} id="blog">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center">
            Latest News and Blog
          </h2>
        </div>

        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md mr-1 sm:mr-2 z-10"
              )}
              onClick={scrollLeft}
              aria-label="Previous blog posts"
              style={{ color: COLORS.primary }}
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="overflow-hidden w-full max-w-6xl" style={{ height: '360px' }}>
              <div
                className="flex transition-transform duration-300 ease-in-out h-full"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedBlogPosts.map((post, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2 h-full"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <Card 
                      className="flex-shrink-0 w-full h-full hover:shadow-lg transition-shadow duration-200 mx-1 sm:mx-2 flex flex-col bg-white cursor-pointer"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <CardContent className="p-5 sm:p-7 flex-1 flex flex-col">
                        {/* Icon */}
                        <div className="flex items-center justify-center h-32 w-full bg-gray-100 mb-4 rounded-md">
                          {post.id === 1 && <Heart className="w-16 h-16 text-pink-500" />}
                          {post.id === 2 && <BookOpen className="w-16 h-16 text-pink-500" />}
                          {post.id === 3 && <Award className="w-16 h-16 text-pink-500" />}
                          {post.id === 4 && <Home className="w-16 h-16 text-blue-500" />}
                          {post.id === 5 && <School className="w-16 h-16 text-blue-500" />}
                          {post.id === 6 && <Droplets className="w-16 h-16 text-blue-500" />}
                          {post.id === 7 && <Users className="w-16 h-16 text-green-500" />}
                          {post.id === 8 && <Globe className="w-16 h-16 text-green-500" />}
                          {post.id === 9 && <MessageCircle className="w-16 h-16 text-green-500" />}
                        </div>

                        {/* Date */}
                        <div className="flex items-center gap-2 text-gray-500 text-xs mb-2">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>

                        {/* Title and Tag */}
                        <div className="mb-2">
                          <h3 className="text-sm font-bold text-black mb-1 line-clamp-1">{post.title}</h3>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${post.tagColor}`}>
                            {post.tag}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">{post.description}</p>

                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-[#ee201c] font-semibold text-xs hover:no-underline flex items-center gap-1 group mt-auto mb-1"
                        >
                          READ MORE
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/80 hover:bg-white/90 shadow-md ml-1 sm:ml-2 z-10"
              )}
              onClick={scrollRight}
              aria-label="Next blog posts"
              style={{ color: COLORS.primary }}
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/blog">
            <Button 
              className="transition-colors duration-200 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm lg:text-base"
              style={{
                backgroundColor: COLORS.primary,
                color: 'white',
              }}
            >
              View All Blog Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogCarousel