"use client"

import { useState, useEffect } from "react"
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

// Default mock data constants
const DEFAULT_MOCK_USERS: User[] = [
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

// Function to get users from localStorage or use default mock data
const getUsersFromStorage = (): User[] => {
  if (typeof window === 'undefined') return DEFAULT_MOCK_USERS;
  
  const storedUsers = localStorage.getItem('mockUsers');
  return storedUsers ? JSON.parse(storedUsers) : DEFAULT_MOCK_USERS;
};

// Function to save users to localStorage
const saveUsersToStorage = (users: User[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockUsers', JSON.stringify(users));
  }
};

// Get initial users from storage or defaults
const MOCK_USERS: User[] = getUsersFromStorage();

// IDs of users with pending verification requests
const VERIFICATION_REQUEST_USER_IDS = ["2", "5"]

// Generate verification requests from users with matching IDs
const MOCK_VERIFICATION_REQUESTS: User[] = MOCK_USERS.filter(user => 
  VERIFICATION_REQUEST_USER_IDS.includes(user.id)
)

interface ManageUsersProps {
  activeTab?: string;
}

// Create a custom hook to manage users state
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);

  // Load users from localStorage on component mount
  useEffect(() => {
    const storedUsers = getUsersFromStorage();
    setUsers(storedUsers);
  }, []);

  // Function to add a new user
  const addUser = (userData: any) => {
    // Create a new user object from the form data
    const newUser: User = {
      id: String(Date.now()), // Generate a unique ID
      name: userData.personalDetails.name,
      email: userData.personalDetails.email,
      phone: userData.personalDetails.phoneNumber,
      avatar: "/placeholder.svg?height=40&width=40" // Default avatar
    };

    // Add the new user to the list
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Save to localStorage
    saveUsersToStorage(updatedUsers);
    
    return newUser;
  };
  
  // Function to update an existing user
  const updateUser = (updatedData: any) => {
    const { id, personalDetails } = updatedData || {};
    if (!id || !personalDetails) return null as unknown as User;

    const updatedUsers = users.map((u) =>
      u.id === id
        ? {
            ...u,
            name: personalDetails.name ?? u.name,
            email: personalDetails.email ?? u.email,
            phone: personalDetails.phoneNumber ?? u.phone,
            // keep avatar unchanged for now
          }
        : u
    );

    setUsers(updatedUsers);
    saveUsersToStorage(updatedUsers);

    const result = updatedUsers.find((u) => u.id === id)!;
    return result;
  };
  
  // Function to delete a user
  const deleteUser = (userId: string) => {
    // Filter out the user with the given ID
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    
    // Save to localStorage
    saveUsersToStorage(updatedUsers);
    
    return true;
  };

  return { users, addUser, updateUser, deleteUser };
}

// Create a global context for users
import { createContext, useContext } from "react";

interface UsersContextType {
  users: User[];
  addUser: (userData: any) => User;
  updateUser: (updatedData: any) => User | null;
  deleteUser: (userId: string) => boolean;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const usersData = useUsers();
  
  return (
    <UsersContext.Provider value={usersData}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsersContext() {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
}

export function ManageUsers({ activeTab = "All" }: ManageUsersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { users } = useUsersContext();
  
  // Determine which data to use based on active tab
  const dataSource = activeTab === "Verification" ? MOCK_VERIFICATION_REQUESTS : users
  
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-gray-50 border-gray-200"
              />
            </div>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto whitespace-nowrap"
              onClick={() => router.push('/admin/users/add')}
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-b-lg shadow-sm overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b bg-gray-50 font-medium text-gray-700">
          <div>Name</div>
          <div>Email</div>
          <div>Phone Number</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="divide-y overflow-x-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div key={user.id} className="flex flex-col md:grid md:grid-cols-4 gap-3 p-4 items-start md:items-center hover:bg-gray-50">
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
                  <span className="break-all">{user.email}</span>
                </div>
                <div className="text-gray-600 w-full md:w-auto">
                  <span className="md:hidden font-medium text-gray-700">Phone: </span>
                  {user.phone}
                </div>
                <div className="flex flex-wrap justify-start md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                  {activeTab === "Verification" && (
                    <div className="flex items-center mr-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 w-full sm:w-auto"
                    onClick={() => {
                      if (activeTab === "Verification") {
                        // Navigate to verification request details page
                        router.push(`/admin/users/verification/${user.id}`);
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