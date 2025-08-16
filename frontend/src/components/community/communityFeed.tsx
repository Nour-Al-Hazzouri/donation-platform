'use client'

import React, { useState, useEffect } from 'react'
import { MessageCircle, ThumbsUp, ThumbsDown, Pen, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'
import Image from 'next/image'
import { CommunityPost, CommentResource } from '@/types'
import { communityService } from '@/lib/api/community'
import { toast } from '@/components/ui/use-toast'

interface User {
  id: string
  first_name: string
  last_name: string
  verified: boolean
}

// This interface is for the mock data and will be replaced by the imported CommunityPost interface
interface MockCommunityPost {
  id: string
  content: string
  user: User
  images?: string[]
  location?: string
  likes: number
  dislikes: number
  comments: string[]
  isLiked?: boolean
  isDisliked?: boolean
  createdAt: string
  tags: string[]
  // Title is generated from content in convertMockToCommunityPost function
}

const mockUser: User = {
  id: 'me',
  first_name: 'User',
  last_name: 'Name',
  verified: false,
}

const initialMockPosts: MockCommunityPost[] = [
  {
    id: '1',
    content: 'Just donated to the local food bank! Who else wants to join me in supporting this great cause?',
    user: {
      id: 'user1',
      first_name: 'Tony',
      last_name: 'Stark',
      verified: false,
    },
    images: ['https://images.unsplash.com/photo-1504281623087-1f6f7c0fd8ce?w=500&h=300&fit=crop'],
    likes: 1,
    dislikes: 0,
    comments: ['Thank you for your generosity! The food bank really needs support right now.'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    tags: ['#FoodBank', '#Donation', '#CommunitySupport']
  },
  {
    id: '2',
    content: 'Looking for volunteers to help distribute supplies at the homeless shelter this weekend. Can anyone lend a hand?',
    user: {
      id: 'user2',
      first_name: 'Steve',
      last_name: 'Rogers',
      verified: true,
    },
    likes: 5,
    dislikes: 1,
    comments: ['I can help on Saturday!', 'What time do you need people?'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    tags: ['#Volunteer', '#HomelessShelter', '#HelpNeeded']
  },
  {
    id: '3',
    content: 'Check out this amazing work being done by our local charity! They\'ve helped over 500 families this month alone. Consider donating if you can.',
    user: {
      id: 'user3',
      first_name: 'Natasha',
      last_name: 'Romanoff',
      verified: true,
    },
    images: ['https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=800&fit=crop'],
    likes: 42,
    dislikes: 2,
    comments: ['Just made a donation!', 'This organization does incredible work', 'Where can I sign up to volunteer?'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['#Charity', '#Donate', '#MakeADifference', '#VolunteerOpportunity']
  },
]

// Helper function to convert mock data to the new CommunityPost format
const convertMockToCommunityPost = (mockPost: MockCommunityPost): CommunityPost => {
  return {
    id: parseInt(mockPost.id),
    user_id: parseInt(mockPost.user.id.replace('user', '')) || 1,
    title: mockPost.content.substring(0, 50) + (mockPost.content.length > 50 ? '...' : ''), // Generate title from content
    content: mockPost.content,
    image_urls: mockPost.images,
    image_full_urls: mockPost.images,
    tags: mockPost.tags,
    created_at: mockPost.createdAt,
    updated_at: mockPost.createdAt,
    votes: {
      upvotes: mockPost.likes,
      downvotes: mockPost.dislikes,
      total: mockPost.likes - mockPost.dislikes,
      user_vote: mockPost.isLiked ? 'upvote' : (mockPost.isDisliked ? 'downvote' : null)
    },
    user: {
      id: parseInt(mockPost.user.id.replace('user', '')) || 1,
      username: `${mockPost.user.first_name.toLowerCase()}${mockPost.user.last_name.toLowerCase()}`,
      first_name: mockPost.user.first_name,
      last_name: mockPost.user.last_name,
      avatar: undefined
    },
    comments_count: mockPost.comments.length
  }
}

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

interface PostCreatorProps {
  onWritePost: () => void;
}

const PostCreator = ({ onWritePost }: PostCreatorProps) => {
  const { isAuthenticated } = useAuthStore()
  const { openModal } = useModal()

  const handleClick = () => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    onWritePost()
  }

  return (
    <div 
      className="bg-background rounded-lg p-3 mb-3 shadow-sm border border-border mx-auto w-full max-w-4xl cursor-pointer hover:bg-secondary/50"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <Pen className="text-white w-3.5 h-3.5" />
        </div>
        <span className="font-medium text-sm text-foreground">Write a post</span>
      </div>
    </div>
  )
}

const PostItem = ({ post }: { post: CommunityPost }) => {
  const [isLiked, setIsLiked] = useState(post.votes?.user_vote === 'upvote' || false)
  const [isDisliked, setIsDisliked] = useState(post.votes?.user_vote === 'downvote' || false)
  const [likesCount, setLikesCount] = useState(post.votes?.upvotes || 0)
  const [dislikesCount, setDislikesCount] = useState(post.votes?.downvotes || 0)
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<CommentResource[]>(post.comments || [])
  const [isLoadingComments, setIsLoadingComments] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  
  const { isAuthenticated, user } = useAuthStore()
  const { openModal } = useModal()

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      openModal('signIn')
      return
    }
    action()
  }

  const handleLike = () => {
    requireAuth(async () => {
      try {
        setIsVoting(true)
        
        if (isLiked) {
          // Remove vote if already liked
          const response = await communityService.removeVote(post.id)
          if (response.success) {
            setIsLiked(false)
            setLikesCount(response.data.upvotes)
            setDislikesCount(response.data.downvotes)
          }
        } else {
          // Add upvote
          const response = await communityService.votePost(post.id, 'upvote')
          if (response.success) {
            if (isDisliked) setIsDisliked(false)
            setIsLiked(true)
            setLikesCount(response.data.upvotes)
            setDislikesCount(response.data.downvotes)
          }
        }
      } catch (error) {
        console.error('Error voting on post:', error)
        toast({
          title: 'Error',
          description: 'Failed to vote on post. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsVoting(false)
      }
    })
  }

  const handleDislike = () => {
    requireAuth(async () => {
      try {
        setIsVoting(true)
        
        if (isDisliked) {
          // Remove vote if already disliked
          const response = await communityService.removeVote(post.id)
          if (response.success) {
            setIsDisliked(false)
            setLikesCount(response.data.upvotes)
            setDislikesCount(response.data.downvotes)
          }
        } else {
          // Add downvote
          const response = await communityService.votePost(post.id, 'downvote')
          if (response.success) {
            if (isLiked) setIsLiked(false)
            setIsDisliked(true)
            setLikesCount(response.data.upvotes)
            setDislikesCount(response.data.downvotes)
          }
        }
      } catch (error) {
        console.error('Error voting on post:', error)
        toast({
          title: 'Error',
          description: 'Failed to vote on post. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsVoting(false)
      }
    })
  }

  const toggleComments = async () => {
    const newShowComments = !showComments
    setShowComments(newShowComments)
    
    // Fetch comments when opening comments section and no comments loaded yet
    if (newShowComments && comments.length === 0) {
      try {
        setIsLoadingComments(true)
        const response = await communityService.getComments(post.id)
        if (response.success) {
          setComments(response.data)
        }
      } catch (error) {
        console.error('Error fetching comments:', error)
        toast({
          title: 'Error',
          description: 'Failed to load comments. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingComments(false)
      }
    }
  }

  const handleCommentSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newComment.trim()) {
      requireAuth(async () => {
        try {
          setIsSubmittingComment(true)
          const response = await communityService.addComment(post.id, { content: newComment.trim() })
          
          if (response.success) {
            setComments([...comments, response.data])
            setNewComment('')
          }
        } catch (error) {
          console.error('Error adding comment:', error)
          toast({
            title: 'Error',
            description: 'Failed to add comment. Please try again.',
            variant: 'destructive',
          })
        } finally {
          setIsSubmittingComment(false)
        }
      })
    }
  }

  return (
    <div className="bg-background rounded-lg mb-3 shadow-sm border border-border mx-auto w-full max-w-4xl">
      <div className="p-3">
        {/* User header with verification badge */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.user?.first_name && post.user?.last_name ? `${post.user.first_name[0]}${post.user.last_name[0]}` : 'U'}
              </span>
            </div>
            {post.user?.first_name && (
              <div className="absolute -top-1 -right-1">
                <Image 
                  src="/verification.png" 
                  alt="Verified" 
                  width={16} 
                  height={16}
                  className="w-4 h-4"
                />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 truncate">
              <span className="font-semibold text-sm text-foreground truncate">{post.user?.first_name} {post.user?.last_name}</span>
            </div>
            <div className="text-[10px] text-muted-foreground">{formatTimeAgo(post.created_at)}</div>
          </div>
        </div>

        {/* Post title and content */}
        <div className="mb-2 whitespace-pre-line">
          <h3 className="text-foreground font-medium text-base mb-1">
            {post.title}
          </h3>
          <p className="text-foreground text-sm mb-1 line-clamp-3 leading-snug">
            {post.content}
          </p>
          {/* Display tags */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-primary text-xs bg-primary/10 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        {post.image_urls && post.image_urls.length > 0 && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img
              src={post.image_urls[0]}
              alt="post"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 py-2 border-t border-border text-xs">
          <button 
            onClick={handleLike}
            disabled={isVoting}
            className={`flex items-center gap-1 px-2 py-1 rounded ${isLiked ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary'} ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isVoting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}
            <span>{likesCount}</span>
          </button>
          <button 
            onClick={handleDislike}
            disabled={isVoting}
            className={`flex items-center gap-1 px-2 py-1 rounded ${isDisliked ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:text-destructive'} ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isVoting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ThumbsDown className="w-3.5 h-3.5" />}
            <span>{dislikesCount}</span>
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center gap-1 px-2 py-1 rounded text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{post.comments_count || comments.length}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-2 pt-2 border-t border-border">
            {/* Loading state */}
            {isLoadingComments && (
              <div className="flex justify-center items-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="ml-2 text-xs text-muted-foreground">Loading comments...</span>
              </div>
            )}

            {/* Empty state */}
            {!isLoadingComments && comments.length === 0 && (
              <div className="text-center py-4">
                <p className="text-xs text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}

            {/* Existing comments */}
            {!isLoadingComments && comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-[10px] font-bold">
                    {comment.user.first_name && comment.user.last_name ? 
                      `${comment.user.first_name[0]}${comment.user.last_name[0]}` : 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-foreground mb-0.5">
                    {comment.user.first_name} {comment.user.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{comment.content}</div>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground text-[10px] font-bold">
                  {user?.first_name && user?.last_name ? `${user.first_name[0]}${user.last_name[0]}` : 'U'}
                </span>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={isAuthenticated ? "Write a comment..." : "Sign in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleCommentSubmit}
                  className="w-full p-1.5 border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-xs text-foreground placeholder:text-muted-foreground bg-background pr-8"
                  disabled={!isAuthenticated || isSubmittingComment}
                />
                {isSubmittingComment && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CommunityFeedProps {
  onWritePost: () => void;
  newPost?: CommunityPost | null;
}

export default function CommunityFeed({ onWritePost, newPost }: CommunityFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Fetch posts from API
  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      const response = await communityService.getAllPosts(undefined, pageNum);
      
      if (response.success) {
        if (append) {
          setPosts(prev => [...prev, ...response.data]);
        } else {
          setPosts(response.data);
        }
        setHasMore(response.meta.current_page < response.meta.last_page);
        setPage(response.meta.current_page);
      } else {
        setError('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Load more posts
  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      fetchPosts(page + 1, true);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, []);

  // Add new post to the beginning of the posts array
  useEffect(() => {
    if (newPost) {
      setPosts(prevPosts => {
        // Check if the post already exists to prevent duplicates
        if (!prevPosts.some(post => post.id === newPost.id)) {
          return [newPost, ...prevPosts];
        }
        return prevPosts;
      });
    }
  }, [newPost]);

  return (
    <div className="min-h-screen py-3 px-2 sm:px-4">
      <div className="mx-auto w-full flex flex-col gap-2 max-w-4xl">
        <PostCreator onWritePost={onWritePost} />
        
        {/* Error state */}
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-3">
            <p className="text-sm">{error}</p>
            <button 
              onClick={() => fetchPosts()} 
              className="mt-2 text-xs bg-background px-3 py-1 rounded-md hover:bg-muted"
            >
              Try Again
            </button>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          </div>
        )}
        
        {/* Posts list */}
        {!isLoading && posts.length === 0 && !error && (
          <div className="bg-background rounded-lg p-6 text-center mb-3 shadow-sm border border-border">
            <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
          </div>
        )}
        
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
        
        {/* Load more button */}
        {hasMore && posts.length > 0 && (
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="bg-background rounded-lg p-3 mb-3 shadow-sm border border-border text-center hover:bg-secondary/50 transition-colors"
          >
            {isLoadingMore ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                <span>Loading more...</span>
              </div>
            ) : (
              <span>Load more posts</span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}