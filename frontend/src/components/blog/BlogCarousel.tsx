'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, ArrowRight, ChevronLeftIcon, ChevronRightIcon, BookOpen, Heart, Globe, Users, Droplets, School, Home, MessageCircle, Award } from 'lucide-react'
import { cn } from '@/utils'
import { COLORS } from '@/utils/constants'
import BlogPostDetail from './BlogPostDetail'
import Link from 'next/link'
import { blogService } from '@/lib/api/blogs'

interface BlogCarouselProps {
  className?: string
}

const BlogCarousel: React.FC<BlogCarouselProps> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await blogService.getAll();
        const detailedPosts = await Promise.all(
          posts.data.map(async (post) => {
            const detailedPost = await blogService.getById(post.id);
            return { ...post, content: detailedPost.content };
          })
        );
        setBlogPosts(detailedPosts);
      } catch (err: any) {
        setError('Failed to load blog posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    blogService.getAll();
  }, []);

  const extendedBlogPosts = [...blogPosts, ...blogPosts.slice(0, visibleCards)]

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1)
      } else if (window.innerWidth < 768) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
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

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning && !selectedPost) {
        scrollRight()
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [isTransitioning, selectedPost])

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
    <section className={cn("py-8 sm:py-12", className)} id="blog">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center">
            Latest News and Blog
          </h2>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
        <div className="relative">
          <div className="flex items-center justify-center">
            <Button
              onClick={scrollLeft}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md mr-1 sm:mr-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Previous blog posts"
            >
              <ChevronLeftIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="overflow-hidden w-full max-w-6xl">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                }}
              >
                {extendedBlogPosts.map((post, index) => (
                  <div
                    key={`${post.id}-${index}`}
                    className="flex-shrink-0 px-1 sm:px-2"
                    style={{ width: `${100 / visibleCards}%` }}
                  >
                    <Card 
                      className="w-full h-full min-h-[360px] hover:shadow-lg transition-all duration-300 hover:scale-[1.02] mx-1 sm:mx-2 flex flex-col bg-background cursor-pointer"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <CardContent className="p-5 sm:p-7 flex flex-col h-full">
                        <div className="flex items-center justify-center h-40 w-full bg-muted mb-4 rounded-md overflow-hidden">
                          {post.image_full_urls && post.image_full_urls.length > 0 ? (
                            <img
                              src={post.image_full_urls[0]}
                              alt={post.title}
                              className="object-cover h-full w-full"
                            />
                          ) : post.image_urls && post.image_urls.length > 0 ? (
                            <img
                              src={post.image_urls[0]}
                              alt={post.title}
                              className="object-cover h-full w-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
                          <Calendar className="w-3 h-3 text-red-500" />
                          <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Invalid Date'}</span>
                        </div>
                        <div className="mb-2 flex-grow">
                          <h3 className="text-sm font-bold text-foreground mb-1 line-clamp-1">{post.title}</h3>
                          <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">{post.content}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${post.tagColor}`}>
                            {post.tag}
                          </span>
                        </div>
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-primary font-semibold text-xs hover:no-underline flex items-center gap-1 group mt-auto mb-1"
                        >
                          READ MORE
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-red-500" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={scrollRight}
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md ml-1 sm:ml-2 z-10 flex items-center justify-center transition-colors"
              aria-label="Next blog posts"
            >
              <ChevronRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
        )}
        <div className="flex justify-center mt-6 sm:mt-8">
          <Link href="/blog">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 rounded-full px-6 py-1.5 sm:px-8 sm:py-2 text-xs sm:text-sm lg:text-base"
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