'use client'

import React, { useState } from 'react'
import { MessageCircle, ThumbsUp, ThumbsDown, Pen, Check } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useModal } from '@/contexts/ModalContext'

interface User {
  id: string
  name: string
  verified: boolean
}

interface CommunityPost {
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
}

const mockUser: User = {
  id: 'me',
  name: 'whatever',
  verified: false,
}

const initialMockPosts: CommunityPost[] = [
  {
    id: '1',
    content: 'Just donated to the local food bank! Who else wants to join me in supporting this great cause?',
    user: {
      id: 'user1',
      name: 'Tony Stark',
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
      name: 'Steve Rogers',
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
      name: 'Natasha Romanoff',
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
      className="bg-white rounded-lg p-3 mb-3 shadow-sm border border-gray-200 mx-auto w-full max-w-4xl cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <Pen className="text-white w-3.5 h-3.5" />
        </div>
        <span className="font-medium text-sm text-black">Write a post</span>
      </div>
    </div>
  )
}

const PostItem = ({ post }: { post: CommunityPost }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isDisliked, setIsDisliked] = useState(post.isDisliked || false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [dislikesCount, setDislikesCount] = useState(post.dislikes)
  const [newComment, setNewComment] = useState('')
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments)
  
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
    requireAuth(() => {
      if (isDisliked) {
        setIsDisliked(false)
        setDislikesCount(dislikesCount - 1)
      }
      setIsLiked(!isLiked)
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    })
  }

  const handleDislike = () => {
    requireAuth(() => {
      if (isLiked) {
        setIsLiked(false)
        setLikesCount(likesCount - 1)
      }
      setIsDisliked(!isDisliked)
      setDislikesCount(isDisliked ? dislikesCount - 1 : dislikesCount + 1)
    })
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  const handleCommentSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newComment.trim()) {
      requireAuth(() => {
        setComments([...comments, newComment])
        setNewComment('')
      })
    }
  }

  return (
    <div className="bg-white rounded-lg mb-3 shadow-sm border border-gray-200 mx-auto w-full max-w-4xl">
      <div className="p-3">
        {/* User header with verification badge on top-right of avatar */}
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {post.user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            {post.user.verified && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 truncate">
              <span className="font-semibold text-sm text-black truncate">{post.user.name}</span>
            </div>
            <div className="text-[10px] text-gray-500">{formatTimeAgo(post.createdAt)}</div>
          </div>
        </div>

        {/* Post content */}
        <div className="mb-2 whitespace-pre-line">
          <p className="text-gray-900 text-sm mb-1 line-clamp-3 leading-snug">
            {post.content}
          </p>
          {/* Display tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tags.map((tag, index) => (
                <span 
                  key={index} 
                  className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image */}
        {post.images && post.images.length > 0 && (
          <div className="mb-2 rounded-lg overflow-hidden">
            <img
              src={post.images[0]}
              alt="post"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-4 py-2 border-t border-gray-100 text-xs">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-1 rounded ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{likesCount}</span>
          </button>
          <button 
            onClick={handleDislike}
            className={`flex items-center gap-1 px-2 py-1 rounded ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{dislikesCount}</span>
          </button>
          <button 
            onClick={toggleComments}
            className="flex items-center gap-1 px-2 py-1 rounded text-gray-600 hover:text-blue-600"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{comments.length}</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            {/* Existing comments */}
            {comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-2 mb-2">
                <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-[10px] font-bold">W</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-black mb-0.5">whatever</div>
                  <div className="text-xs text-gray-700 line-clamp-2">{comment}</div>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'W'}
                </span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={isAuthenticated ? "Write a comment..." : "Sign in to comment"}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleCommentSubmit}
                  className="w-full p-1.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs text-gray-700 placeholder-gray-500"
                  disabled={!isAuthenticated}
                />
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
  const [posts, setPosts] = useState<CommunityPost[]>(initialMockPosts);

  // Add new post to the beginning of the posts array
  React.useEffect(() => {
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
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}