"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usersService } from "@/lib/api"

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

// We'll replace mock verification requests with API data

interface ManageUsersProps {
  activeTab?: string;
}

// Create a custom hook to manage users state
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await usersService.getAllUsers();
        if (response.data && Array.isArray(response.data)) {
          // Transform API user data to match our User interface
          const transformedUsers: User[] = response.data.map((apiUser: any) => ({
            id: apiUser.id.toString(),
            name: `${apiUser.first_name} ${apiUser.last_name}`,
            email: apiUser.email,
            phone: apiUser.phone || 'No phone',
            avatar: apiUser.avatar_url_full || apiUser.avatar_url || "/placeholder.svg?height=40&width=40"
          }));
          setUsers(transformedUsers);
        } else {
          setError('Failed to fetch users - Invalid response format');
          // Fallback to mock data if API fails
          const storedUsers = getUsersFromStorage();
          setUsers(storedUsers);
        }
      } catch (err: any) {
        console.error('Error fetching users:', err);
        
        // Provide more specific error messages based on the error type
        let errorMessage = 'Error fetching users';
        if (err.response?.status === 403) {
          errorMessage = 'Access denied: You do not have permission to view users';
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication required: Please log in again';
        } else if (err.response?.status === 404) {
          errorMessage = 'Users endpoint not found';
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        // Fallback to mock data if API fails
        const storedUsers = getUsersFromStorage();
        setUsers(storedUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to add a new user
  const addUser = async (userData: any) => {
    try {
      const userPayload = {
        first_name: userData.personalDetails.name.split(' ')[0] || userData.personalDetails.name,
        last_name: userData.personalDetails.name.split(' ').slice(1).join(' ') || '',
        username: userData.personalDetails.email, // Use email as username
        email: userData.personalDetails.email,
        phone: userData.personalDetails.phoneNumber,
        password: 'defaultPassword123',
        password_confirmation: 'defaultPassword123',
        location_id: 1 // Default location ID
      };

      const response = await usersService.createUser(userPayload);
      
      if (response.success && response.data) {
        // Transform the new user data
        const newUser: User = {
          id: response.data.id.toString(),
          name: `${response.data.first_name} ${response.data.last_name}`,
          email: response.data.email,
          phone: response.data.phone || 'No phone',
          avatar: response.data.avatar_url_full || response.data.avatar_url || "/placeholder.svg?height=40&width=40"
        };

        // Add the new user to the list
        setUsers(prevUsers => [...prevUsers, newUser]);
        return newUser;
      } else {
        throw new Error('Failed to create user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      // Fallback to localStorage method for now
      const userId = String(Date.now());
      const newUser: User = {
        id: userId,
        name: userData.personalDetails.name,
        email: userData.personalDetails.email,
        phone: userData.personalDetails.phoneNumber,
        avatar: "/placeholder.svg?height=40&width=40"
      };

      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsersToStorage(updatedUsers);
      
      return newUser;
    }
  };
  
  // Function to update an existing user
  const updateUser = (updatedData: any) => {
    const { id, personalDetails } = updatedData || {};
    if (!id || !personalDetails) return null as unknown as User;

    // Log the updated data to help with debugging
    console.log('Updating user with data:', updatedData);
    
    // Store address information in localStorage for reference
    // This won't be displayed in the user list but will be available when editing
    if (typeof window !== 'undefined') {
      const addressKey = `user_${id}_address`;
      const addressData = {
        governorate: personalDetails.address?.governorate,
        district: personalDetails.address?.district
      };
      localStorage.setItem(addressKey, JSON.stringify(addressData));
      console.log('Saved address data:', addressData);
    }

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

  return { users, loading, error, addUser, updateUser, deleteUser };
}

// Create a global context for users
import { createContext, useContext } from "react";

interface UsersContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  addUser: (userData: any) => Promise<User>;
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
  const [verificationRequests, setVerificationRequests] = useState<any[]>([])
  const [verificationLoading, setVerificationLoading] = useState(false)
  const [verificationError, setVerificationError] = useState<string | null>(null)
  const router = useRouter()
  const { users, loading: usersLoading, error: usersError } = useUsersContext();
  
  // Fetch verification requests when the component mounts or when activeTab changes
  useEffect(() => {
    if (activeTab === "Verification") {
      setVerificationLoading(true);
      setVerificationError(null);
      
      // Import verificationService dynamically to avoid circular dependencies
      import("@/lib/api").then(({ verificationService }) => {
        verificationService.getAllVerifications()
          .then(response => {
            if (response.success) {
              // Map verification data to include user information
              const requests = response.data.map((verification: any) => ({
                id: verification.id,
                name: verification.user ? `${verification.user.first_name} ${verification.user.last_name}` : 'Unknown User',
                email: verification.user?.email || 'No email',
                phone: verification.user?.phone || 'No phone',
                avatar: verification.user?.avatar || "/placeholder.svg?height=40&width=40",
                status: verification.status,
                created_at: verification.created_at
              }));
              setVerificationRequests(requests);
            } else {
              setVerificationError('Failed to fetch verification requests');
            }
          })
          .catch(err => {
            console.error('Error fetching verification requests:', err);
            setVerificationError('Error fetching verification requests');
          })
          .finally(() => {
            setVerificationLoading(false);
          });
      });
    }
  }, [activeTab]);
  
  // Determine which data to use based on active tab
  const dataSource = activeTab === "Verification" ? verificationRequests : users
  
  // Filter users based on search query
  const filteredUsers = dataSource.filter((user: User) => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 sm:px-6 py-4 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            {activeTab === "All" ? "All Users" : "Verification Requests"}
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full bg-background border-border"
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
      <div className="flex-1 bg-background rounded-b-lg shadow-sm border border-border overflow-hidden">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 p-4 border-b border-border bg-muted font-medium text-foreground">
          <div>Name</div>
          <div>Email</div>
          <div>Phone Number</div>
          <div></div>
        </div>

        {/* Loading State */}
        {((activeTab === "Verification" && verificationLoading) || (activeTab === "All" && usersLoading)) && (
          <div className="p-8 text-center text-muted-foreground">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 bg-muted rounded w-32 mb-4"></div>
              <div className="h-4 bg-muted rounded w-48"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {((activeTab === "Verification" && verificationError) || (activeTab === "All" && usersError)) && (
          <div className="p-8 text-center text-red-500">
            {activeTab === "Verification" ? verificationError : usersError}
            <div className="mt-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => {
                  if (activeTab === "Verification") {
                    setVerificationLoading(true);
                    setVerificationError(null);
                    import("@/lib/api").then(({ verificationService }) => {
                      verificationService.getAllVerifications()
                        .then(response => {
                          if (response.success) {
                            const requests = response.data.map((verification: any) => ({
                              id: verification.id,
                              name: verification.user ? `${verification.user.first_name} ${verification.user.last_name}` : 'Unknown User',
                              email: verification.user?.email || 'No email',
                              phone: verification.user?.phone || 'No phone',
                              avatar: verification.user?.avatar || "/placeholder.svg?height=40&width=40",
                              status: verification.status,
                              created_at: verification.created_at
                            }));
                            setVerificationRequests(requests);
                          } else {
                            setVerificationError('Failed to fetch verification requests');
                          }
                        })
                        .catch(err => {
                          console.error('Error fetching verification requests:', err);
                          setVerificationError('Error fetching verification requests');
                        })
                        .finally(() => {
                          setVerificationLoading(false);
                        });
                    });
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {/* Table Body */}
        {!((activeTab === "Verification" && verificationLoading) || (activeTab === "All" && usersLoading)) && 
         !((activeTab === "Verification" && verificationError) || (activeTab === "All" && usersError)) && (
          <div className="divide-y overflow-x-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.id} className="flex flex-col md:grid md:grid-cols-4 gap-3 p-4 items-start md:items-center hover:bg-secondary/50">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-foreground truncate">{user.name}</span>
                  </div>
                  <div className="text-muted-foreground w-full md:w-auto">
                    <span className="md:hidden font-medium text-foreground">Email: </span>
                    <span className="break-all">{user.email}</span>
                  </div>
                  <div className="text-muted-foreground w-full md:w-auto">
                    <span className="md:hidden font-medium text-foreground">Phone: </span>
                    {user.phone}
                  </div>
                  <div className="flex flex-wrap justify-start md:justify-end gap-2 w-full md:w-auto mt-2 md:mt-0">
                    {activeTab === "Verification" && (
                      <div className="flex items-center mr-2">
                        {user.status === 'approved' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Approved
                          </span>
                        )}
                        {user.status === 'rejected' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Rejected
                          </span>
                        )}
                        {(user.status === 'pending' || !user.status) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        )}
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
                      {activeTab === "Verification" ? (user.status === 'pending' ? "Review" : "View Details") : "Manage"}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                {activeTab === "Verification" ? "No verification requests found." : "No users found matching your search criteria."}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}