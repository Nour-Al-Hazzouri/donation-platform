"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { DashboardSidebar } from "@/components/admin/dashboard/dashboardSiderbar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreateBlogPost } from "./CreateBlogPost"
import { blogService } from "@/lib/api/blogs"
import { useToast } from "@/components/ui/use-toast"

interface BlogPost {
  id: number;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  image_urls?: string[];
  image_full_urls?: string[];
}

export function BlogsAdminPageClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPost | null>(null)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      setIsLoading(true)
      const response = await blogService.getAll()
      setBlogPosts(response.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredBlogPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateBlogPost = async (formData: any) => {
    try {
      const { title, content, priority, image } = formData
      const imageFiles = image ? [image] : undefined
      
      await blogService.create({
        title,
        content,
        priority,
        image_urls: imageFiles,
      })
      
      toast({
        title: "Success",
        description: "Blog post created successfully",
      })
      setIsCreating(false)
      fetchBlogPosts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      })
    }
  }

  const handleEditBlogPost = async (formData: any) => {
    if (!currentBlogPost) return

    try {
      const { title, content, priority, image } = formData
      const imageFiles = image ? [image] : undefined
      const removeImages = formData.removeImage ? currentBlogPost.image_urls : undefined
      
      await blogService.update(currentBlogPost.id, {
        title,
        content,
        priority,
        image_urls: imageFiles,
        remove_image_urls: removeImages,
      })
      
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      })
      setIsEditing(false)
      setCurrentBlogPost(null)
      fetchBlogPosts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBlogPost = async (id: number) => {
    try {
      await blogService.delete(id)
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      })
      fetchBlogPosts()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      })
    }
  }

  const startEditing = (blogPost: BlogPost) => {
    setCurrentBlogPost(blogPost)
    setIsEditing(true)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <div className="hidden md:block w-64 flex-shrink-0">
          <DashboardSidebar />
        </div>

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
                initialData={{
                  title: currentBlogPost.title,
                  content: currentBlogPost.content,
                  priority: currentBlogPost.priority,
                  imageUrl: currentBlogPost.image_full_urls?.[0]
                }}
                mode="edit"
              />
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-foreground">Manage Blogs</h1>
                  <p className="text-muted-foreground mt-1">Create, edit, and manage blog posts</p>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full bg-background border-input"
                    />
                  </div>
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto whitespace-nowrap"
                    onClick={() => setIsCreating(true)}
                  >
                    Create Blog Post
                  </Button>
                </div>

                <div className="flex-1 bg-background rounded-lg shadow-sm overflow-hidden">
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted font-medium text-muted-foreground">
                    <div className="col-span-5">Title</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-2">Priority</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="divide-y">
                    {isLoading ? (
                      <div className="p-8 text-center text-muted-foreground">
                        Loading blog posts...
                      </div>
                    ) : filteredBlogPosts.length > 0 ? (
                      filteredBlogPosts.map((post) => (
                        <div key={post.id} className="md:grid md:grid-cols-12 flex flex-col gap-3 p-4 items-start md:items-center hover:bg-muted">
                          <div className="md:col-span-5 font-medium text-foreground flex items-center gap-3 w-full">
                            {post.image_full_urls?.[0] && (
                              <img 
                                src={post.image_full_urls[0]} 
                                alt={post.title}
                                className="w-10 h-10 rounded object-cover flex-shrink-0"
                              />
                            )}
                            <span className="truncate max-w-full">{post.title}</span>
                          </div>
                          <div className="md:col-span-3 text-muted-foreground text-sm md:text-base w-full md:w-auto flex items-center gap-2">
                            <span className="md:hidden font-medium text-muted-foreground">Date:</span>
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                          <div className="md:col-span-2 w-full md:w-auto flex items-center gap-2">
                            <span className="md:hidden font-medium text-muted-foreground">Priority:</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              post.priority === 'high' ? 'bg-red-100 text-red-800' :
                              post.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {post.priority.charAt(0).toUpperCase() + post.priority.slice(1)}
                            </span>
                          </div>
                          <div className="md:col-span-2 flex flex-wrap gap-2 w-full md:w-auto mt-2 md:mt-0">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-red-500 hover:bg-red-500 text-white hover:text-white flex-1 md:flex-auto min-w-[70px] whitespace-nowrap"
                              onClick={() => startEditing(post)}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="bg-red-500 hover:bg-red-500 text-white hover:text-white flex-1 md:flex-auto min-w-[70px] whitespace-nowrap"
                              onClick={() => handleDeleteBlogPost(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No blog posts found. Create your first blog post!
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              </>
            )}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}