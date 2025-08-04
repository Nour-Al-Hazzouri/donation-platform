"use client"

import React, { useState } from 'react'
import { MessageCircle, Share2, ThumbsUp, ThumbsDown } from 'lucide-react'

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
}

const mockUser: User = {
  id: 'me',
  name: 'whatever',
  verified: false,
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    content: 'Anyone can take me there pleasee I need to relax\n\nUrgent !!!',
    user: {
      id: 'user1',
      name: 'Tony Stark',
      verified: false,
    },
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'],
    likes: 1,
    dislikes: 0,
    comments: ['omg!! ana kmn please'],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    content: 'Looking for hiking partners this weekend!\n\nAnyone interested?',
    user: {
      id: 'user2',
      name: 'Steve Rogers',
      verified: true,
    },
    likes: 5,
    dislikes: 1,
    comments: ['I might be available!', 'What trail are you thinking?'],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: '3',
    content: 'Check out this amazing view from my hike yesterday! Absolutely breathtaking scenery that everyone should experience at least once in their lifetime.',
    user: {
      id: 'user3',
      name: 'Natasha Romanoff',
      verified: true,
    },
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&h=800&fit=crop'],
    likes: 42,
    dislikes: 2,
    comments: ['Wow! Where is this?', 'Incredible shot!', 'What camera did you use?'],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const PostCreator = () => {
  const [content, setContent] = useState('')

  return (
    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100 mx-auto w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">✓</span>
        </div>
        <span className="font-medium text-base text-black">Write a post</span>
      </div>
      <div className="bg-gray-50 rounded-lg p-3">
        <input
          type="text"
          placeholder="Write something here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 text-base"
        />
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

  const handleLike = () => {
    if (isDisliked) {
      setIsDisliked(false)
      setDislikesCount(dislikesCount - 1)
    }
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleDislike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikesCount(likesCount - 1)
    }
    setIsDisliked(!isDisliked)
    setDislikesCount(isDisliked ? dislikesCount - 1 : dislikesCount + 1)
  }

  const toggleComments = () => {
    setShowComments(!showComments)
  }

  return (
    <div className="bg-white rounded-lg mb-4 shadow-sm border border-gray-100 mx-auto w-full max-w-2xl">
      <div className="p-4">
        {/* User header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">
              {post.user.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-black">{post.user.name}</span>
              {post.user.verified && (
                <span className="text-blue-500 text-xs bg-blue-50 px-2 py-0.5 rounded-full">Verified</span>
              )}
            </div>
            <div className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</div>
          </div>
        </div>

        {/* Post content */}
        <div className="mb-4 whitespace-pre-line">
          <p className="text-gray-900 text-base mb-3 leading-relaxed">
            {post.content}
          </p>
          <p className="text-blue-600 text-sm">#RIP #SOS</p>
        </div>

        {/* Image */}
        {post.images && post.images.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.images[0]}
              alt="post"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${isLiked ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600'}`}
            >
              <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{likesCount}</span>
            </button>
            <button 
              onClick={handleDislike}
              className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg ${isDisliked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:text-red-600'}`}
            >
              <ThumbsDown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{dislikesCount}</span>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleComments}
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-1.5 rounded-lg"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{post.comments.length}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm px-3 py-1.5 rounded-lg">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            {/* Existing comments */}
            {post.comments.map((comment, idx) => (
              <div key={idx} className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-black mb-1">whatever</div>
                  <div className="text-sm text-gray-700">{comment}</div>
                </div>
              </div>
            ))}

            {/* Comment input */}
            <div className="flex items-center gap-3 mt-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">W</span>
              </div>
              <div className="flex-1 bg-gray-50 rounded-lg px-4 py-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CommunityFeed() {
  return (
    <div className="bg-gray-50 min-h-screen py-4 px-3 sm:px-6">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-4">
        <PostCreator />
        {mockPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}