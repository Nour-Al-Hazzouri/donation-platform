"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface User {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
}

// Mock data for users
const users: User[] = [
  {
    id: "1",
    name: "Tomiwa Oyeledu Dolapo",
    email: "tomiwaledu@me.com",
    phone: "+2349034526771",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "2",
    name: "Bessie Cooper",
    email: "michael.mitc@me.com",
    phone: "(505) 555-0125",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "3",
    name: "Albert Flores",
    email: "alma.lawson@we.com",
    phone: "(808) 555-0111",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "4",
    name: "Brooklyn Simmons",
    email: "debbie.baker@you.com",
    phone: "(480) 555-0103",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "5",
    name: "Devon Lane",
    email: "felicia.reid@us.com",
    phone: "(217) 555-0113",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "6",
    name: "Jerome Bell",
    email: "sara.cruz@them.com",
    phone: "(629) 555-0129",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

// Mock data for verification requests
const verificationRequests: User[] = [
  {
    id: "2",
    name: "Bessie Cooper",
    email: "michael.mitc@me.com",
    phone: "(505) 555-0125",
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: "5",
    name: "Devon Lane",
    email: "felicia.reid@us.com",
    phone: "(217) 555-0113",
    avatar: "/placeholder.svg?height=40&width=40"
  }
]

interface ManageUsersProps {
  activeTab?: string;
}

export function ManageUsers({ activeTab = "All" }: ManageUsersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  
  // Determine which data to use based on active tab
  const dataSource = activeTab === "Verification" ? verificationRequests : users
  
  // Filter users based on search query
  const filteredUsers = dataSource.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 sm:px-6 py-4 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === "All" ? "All Users" : "Verification Requests"}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-60 md:w-80 bg-gray-50 border-gray-200"
              />
            </div>
            <Button className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto">
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-b-lg shadow-sm overflow-x-auto">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Name</div>
          <div>Email</div>
          <div>Phone Number</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="divide-y">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col md:grid md:grid-cols-4 gap-2 md:gap-4 p-4 items-start md:items-center hover:bg-gray-50">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                    <Image
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-gray-900 truncate">{user.name}</span>
                </div>
                <div className="text-gray-600 w-full md:w-auto">
                  <span className="md:hidden font-medium text-gray-700">Email: </span>
                  {user.email}
                </div>
                <div className="text-gray-600 w-full md:w-auto">
                  <span className="md:hidden font-medium text-gray-700">Phone: </span>
                  {user.phone}
                </div>
                <div className="flex justify-start md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                  {activeTab === "Verification" && (
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600 text-white px-4"
                    onClick={() => {
                      if (activeTab === "Verification") {
                        // Navigate to verification request details page
                        router.push(`/admin/verification-requests/${user.id}`);
                      } else {
                        // Navigate to user management page
                        router.push(`/admin/users/manage/${user.id}`);
                      }
                    }}
                  >
                    {activeTab === "Verification" ? "View Request" : "Manage"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No users found matching your search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}