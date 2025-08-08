"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { AdminLayout } from "@/components/layouts/AdminLayout"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateBlogPost } from "./CreateBlogPost"

// Mock data for blog posts
const MOCK_BLOG_POSTS = [
  {
    id: "1",
    title: "How to Donate Effectively",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
    priority: "high",
    createdAt: "2023-06-15",
    image: null as File | null
  },
  {
    id: "2",
    title: "Community Impact Stories",
    content: "Ut enim ad minim veniam, quis nostrud exercitation...",
    priority: "medium",
    createdAt: "2023-07-22",
    image: null as File | null
  },
  {
    id: "3",
    title: "Upcoming Charity Events",
    content: "Duis aute irure dolor in reprehenderit in voluptate...",
    priority: "low",
    createdAt: "2023-08-10",
    image: null as File | null
  }
]

interface BlogPost {
  id: string
  title: string
  content: string
  priority: string
  createdAt: string
  image: File | null
}

export function BlogsAdminPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG_POSTS)

  // Filter blog posts based on search query
  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBlogPost = (formData: any) => {
    const newBlogPost: BlogPost = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      priority: formData.priority,
      createdAt: new Date().toISOString().split('T')[0],
      image: formData.image
    }

    setBlogPosts([newBlogPost, ...blogPosts])
    setIsCreating(false)
  }

  const handleEditBlogPost = (formData: any) => {
    if (!currentBlogPost) return

    const updatedBlogPosts = blogPosts.map(post =>
      post.id === currentBlogPost.id
        ? {
            ...post,
            title: formData.title,
            content: formData.content,
            priority: formData.priority,
            image: formData.image
          }
        : post
    )

    setBlogPosts(updatedBlogPosts)
    setIsEditing(false)
    setCurrentBlogPost(null)
  }

  const handleDeleteBlogPost = (id: string) => {
    const updatedBlogPosts = blogPosts.filter(post => post.id !== id)
    setBlogPosts(updatedBlogPosts)
  }

  const startEditing = (blogPost: BlogPost) => {
    setCurrentBlogPost(blogPost)
    setIsEditing(true)
  }

  return (
    <AdminLayout>
      <SidebarProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden">
          {/* Desktop sidebar - only visible on md screens and up */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <DashboardSidebar />
          </div>

          {/* Main content */}
          <div className="flex-1 w-full min-w-0 flex flex-col">
            <SidebarInset className="p-4 md:p-6 flex-1 flex flex-col">
              {isCreating ? (
                <CreateBlogPost
                  onBack={() => setIsCreating(false)}
                  onCancel={() => setIsCreating(false)}
                  onCreate={handleCreateBlogPost}
                  mode="create"
                />
              ) : isEditing && currentBlogPost ? (
                <CreateBlogPost
                  onBack={() => {
                    setIsEditing(false)
                    setCurrentBlogPost(null)
                  }}
                  onCancel={() => {
                    setIsEditing(false)
                    setCurrentBlogPost(null)
                  }}
                  onCreate={handleEditBlogPost}
                  initialData={currentBlogPost}
                  mode="edit"
                />
              ) : (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Manage Blogs</h1>
                    <p className="text-gray-600 mt-1">Create, edit, and manage blog posts</p>
                  </div>

                  {/* Search and Create */}
                  <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative w-full sm:w-auto">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full sm:w-60 md:w-80 bg-gray-50 border-gray-200"
                      />
                    </div>
                    <Button 
                      className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                      onClick={() => setIsCreating(true)}
                    >
                      Create Blog Post
                    </Button>
                  </div>

                  {/* Blog Posts Table */}
                  <div className="flex-1 bg-white rounded-lg shadow-sm overflow-x-auto">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
                      <div className="col-span-5">Title</div>
                      <div className="col-span-3">Date</div>
                      <div className="col-span-2">Priority</div>
                      <div className="col-span-2">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y">
                      {filteredBlogPosts.length > 0 ? (
                        filteredBlogPosts.map((post) => (
                          <div key={post.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                            <div className="col-span-5 font-medium text-gray-900 truncate">{post.title}</div>
                            <div className="col-span-3 text-gray-600">{post.createdAt}</div>
                            <div className="col-span-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                post.priority === 'high' ? 'bg-red-100 text-red-800' :
                                post.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)}
                              </span>
                            </div>
                            <div className="col-span-2 flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                onClick={() => startEditing(post)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleDeleteBlogPost(post.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No blog posts found. Create your first blog post!
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </AdminLayout>
  )
}