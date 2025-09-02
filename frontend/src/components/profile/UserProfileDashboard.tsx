"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, AlertTriangle, Loader2, X } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { useModal } from "@/contexts/ModalContext"
import { locationsService } from "@/lib/api/locations"
import ProfileSidebar from "./Sidebar"
import AccVerification from "./AccVerification"
import { profileService, UpdateProfileData } from "@/lib/api/profile"
import { toast } from "@/components/ui/use-toast"

interface UserProfileDashboardProps {
  onViewChange?: (view: 'profile' | 'notifications') => void
}

export default function UserProfileDashboard({ onViewChange }: UserProfileDashboardProps) {
  const { user, updateUserProfile } = useAuthStore()
  const { openModal, modalType } = useModal()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [locations, setLocations] = useState<{id: number, governorate: string, district: string}[]>([])
  const [error, setError] = useState<string | null>(null)
  const [profileData, setProfileData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : "",
    phoneNumber: user?.phone || "",
    email: user?.email || "",
    governorate: user?.location?.governorate || "",
    district: user?.location?.district || "",
  })
  
  // Create a ref to store the current profileData to avoid dependency issues
  const profileDataRef = React.useRef(profileData)
  
  // Store original data for cancel functionality
  const [originalData, setOriginalData] = useState({
    fullName: user ? `${user.first_name} ${user.last_name}` : "",
    phoneNumber: user?.phone || "",
    email: user?.email || "",
    governorate: user?.location?.governorate || "",
    district: user?.location?.district || "",
  })
  
  // Effect to update profile and original data when user changes
  useEffect(() => {
    if (user) {
      // Clear any existing profile data first to prevent stale data
      setProfileData({
        fullName: "",
        phoneNumber: "",
        email: "",
        governorate: "",
        district: ""
      });
      
      // First try to load location from localStorage (user-specific)
      let savedLocation: { governorate: string; district: string } | null = null;
      if (typeof window !== 'undefined' && user?.id) {
        // Create a user-specific key for localStorage
        const userLocationKey = `userLocation_${user.id}`;
        // Also check legacy key format for backward compatibility
        const legacyLocationKey = `user_location_${user.id}`;
        
        try {
          const savedLocationStr = localStorage.getItem(userLocationKey) || localStorage.getItem(legacyLocationKey);
          if (savedLocationStr) {
            savedLocation = JSON.parse(savedLocationStr);
            console.log('Loaded location from localStorage:', savedLocation);
          }
        } catch (e) {
          console.error("Error parsing saved location:", e);
          localStorage.removeItem(userLocationKey);
        }
      }
      
      // Check for backup in session storage
      let newProfileData;
      
      if (typeof window !== 'undefined') {
        const backupData = sessionStorage.getItem('profile-data-backup');
        const preSaveData = sessionStorage.getItem('profile-data-before-save');
        
        if (preSaveData) {
          // If we have pre-save data, it means the last save operation didn't complete
          try {
            const parsedData = JSON.parse(preSaveData);
            if (parsedData.email === user.email) {
              newProfileData = parsedData;
              console.log('Restored profile data from pre-save backup');
            } else {
              sessionStorage.removeItem('profile-data-before-save');
            }
          } catch (e) {
            console.error('Error parsing pre-save profile data:', e);
            sessionStorage.removeItem('profile-data-before-save');
          }
        } else if (backupData) {
          try {
            const parsedData = JSON.parse(backupData);
            // Only use backup data if it's for the current user (check email)
            if (parsedData.email === user.email) {
              newProfileData = parsedData;
              console.log('Loaded profile data from session backup');
            } else {
              // If backup data is for a different user, remove it
              sessionStorage.removeItem('profile-data-backup');
            }
          } catch (e) {
            console.error('Error parsing backup profile data:', e);
            sessionStorage.removeItem('profile-data-backup');
          }
        }
      }
      
      // If no backup found, use user object data
      if (!newProfileData) {
        newProfileData = {
          fullName: `${user.first_name} ${user.last_name}`,
          phoneNumber: user.phone || "",
          email: user.email || "",
          // Prioritize saved location from localStorage over user object data
          governorate: savedLocation?.governorate || user?.location?.governorate || "",
          district: savedLocation?.district || user?.location?.district || "",
        };
      } else if (savedLocation) {
        // If we have backup data but also have saved location, prioritize the saved location
        newProfileData.governorate = savedLocation.governorate;
        newProfileData.district = savedLocation.district;
      }
      
      setProfileData(newProfileData);
      
      // Also update original data for cancel functionality
      setOriginalData(newProfileData);
      
      // Store a session backup of the profile data
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('profile-data-backup', JSON.stringify(newProfileData));
      }
    }
  }, [user?.id]) // Use user.id instead of user to ensure the effect runs when the user changes

  const handleProfileUpdate = useCallback(async () => {
    // Refresh user profile data after avatar update
    try {
      const updatedProfile = await profileService.getProfile()
      
      // Update local profile data
      setProfileData({
        fullName: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
        phoneNumber: updatedProfile.phone || "",
        email: updatedProfile.email || "",
        governorate: updatedProfile.location?.governorate || "",
        district: updatedProfile.location?.district || "",
      })
      
      // Also update the user in the auth store to ensure avatar URLs are updated
      if (updatedProfile) {
        updateUserProfile({
          // Empty update to trigger a refresh of the user state
          // The actual profile data will come from the API response
        })
      }
    } catch (error) {
      console.error('Error refreshing profile data:', error)
    }
  }, [])

  // Districts are now handled by the districtsForSelectedGovernorate useMemo

  // Get districts for selected governorate
  const districtsForSelectedGovernorate = useMemo(() => {
    if (!profileData.governorate || !locations.length) return []
    return [...new Set(locations
      .filter(loc => loc.governorate === profileData.governorate)
      .map(loc => loc.district))]
  }, [profileData.governorate, locations])

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => {
      let newData;
      if (field === 'governorate') {
        newData = {
          ...prev,
          governorate: value,
          district: ''
        };
      } else {
        newData = {
          ...prev,
          [field]: value,
        };
      }
      
      // Save location data to localStorage when it changes (only in browser environment)
      if ((field === 'governorate' || field === 'district') && typeof window !== 'undefined' && user?.id) {
        // Create a user-specific key for localStorage
        const userLocationKey = `userLocation_${user.id}`;
        
        // Only save to localStorage if we have valid data
        if (field === 'governorate' && value !== '') {
          const locationToSave = {
            governorate: value,
            district: ''
          };
          localStorage.setItem(userLocationKey, JSON.stringify(locationToSave));
        } else if (field === 'district' && value !== '' && prev.governorate !== '') {
          const locationToSave = {
            governorate: prev.governorate,
            district: value
          };
          localStorage.setItem(userLocationKey, JSON.stringify(locationToSave));
        } else if (value === '') {
          // If clearing a field, remove from localStorage to prevent defaults
          localStorage.removeItem(userLocationKey);
        }
      }
      
      return newData;
    });
  }
  
  // Get unique governorates from fetched locations
  const governorates = useMemo(() => {
    return [...new Set(locations.map(loc => loc.governorate))]
  }, [locations])

  // Fetch locations on component mount and load saved location from localStorage
  // Update ref whenever profileData changes
  useEffect(() => {
    profileDataRef.current = profileData;
  }, [profileData]);
  
  // Effect to recover profile data if page is refreshed during editing
  useEffect(() => {
    // Check if there's any saved profile data in session storage
    if (typeof window !== 'undefined' && isEditing) {
      const savedProfileData = sessionStorage.getItem('profile-data-before-save');
      if (savedProfileData) {
        try {
          const parsedData = JSON.parse(savedProfileData);
          setProfileData(parsedData);
          console.log('Recovered profile data from session storage');
        } catch (e) {
          console.error('Error parsing saved profile data:', e);
          sessionStorage.removeItem('profile-data-before-save');
        }
      }
      
      // Add event listener for beforeunload to save data if user refreshes during editing
      const handleBeforeUnload = () => {
        sessionStorage.setItem('profile-data-before-save', JSON.stringify(profileDataRef.current));
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [isEditing]); // Only depend on isEditing to prevent infinite loop

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locationsData = await locationsService.listLocations()
        // Use all locations from the backend without filtering
        setLocations(locationsData)
        
        // Try to load location from localStorage first (only in browser environment)
        let savedLocation: { governorate: string; district: string } | null = null;
        if (typeof window !== 'undefined' && user?.id) {
          // Create a user-specific key for localStorage
          const userLocationKey = `userLocation_${user.id}`;
          // Also check legacy key format for backward compatibility
          const legacyLocationKey = `user_location_${user.id}`;
          
          try {
            const savedLocationStr = localStorage.getItem(userLocationKey) || localStorage.getItem(legacyLocationKey);
            if (savedLocationStr) {
              savedLocation = JSON.parse(savedLocationStr);
              
              // Validate that the saved location exists in our locations data
              const isValidLocation = locationsData.some(
                loc => loc.governorate === savedLocation?.governorate && loc.district === savedLocation?.district
              );
              
              if (!isValidLocation) {
                console.warn('Saved location not found in available locations, clearing localStorage');
                localStorage.removeItem(userLocationKey);
                localStorage.removeItem(legacyLocationKey);
                savedLocation = null;
              } else {
                console.log('Loaded location from localStorage:', savedLocation);
                // If using legacy key, migrate to new format
                if (localStorage.getItem(legacyLocationKey) && !localStorage.getItem(userLocationKey)) {
                  localStorage.setItem(userLocationKey, savedLocationStr);
                  localStorage.removeItem(legacyLocationKey);
                  console.log('Migrated location from legacy storage format');
                }
              }
            }
          } catch (e) {
            console.error("Error parsing saved location:", e);
            localStorage.removeItem(userLocationKey);
            localStorage.removeItem(legacyLocationKey);
          }
        }
        
        // Validate user location exists in our locations data
        let userLocationValid = false;
        if (user?.location) {
          userLocationValid = locationsData.some(
            loc => loc.governorate === user.location?.governorate && loc.district === user.location?.district
          );
        }
        
        // Check if default Beirut Achrafieh is being set incorrectly
        const defaultBeirutAchrafieh = locationsData.find(
          loc => loc.governorate === 'Beirut' && loc.district === 'Achrafieh'
        );
        
        // Update profile data with location from: localStorage > valid user object > empty
        // Explicitly avoid setting Beirut Achrafieh as default if no valid location is found
        setProfileData(prev => {
          // Only use saved location if it's valid
          if (savedLocation) {
            return {
              ...prev,
              governorate: savedLocation.governorate,
              district: savedLocation.district
            };
          }
          
          // Only use user location if it's valid
          if (userLocationValid && user?.location) {
            return {
              ...prev,
              governorate: user.location.governorate,
              district: user.location.district
            };
          }
          
          // If no valid location, use empty strings (not default Beirut Achrafieh)
          return {
            ...prev,
            governorate: '',
            district: ''
          };
        });
      } catch (err) {
        console.error("Error fetching locations:", err)
      }
    }
    
    fetchLocations()
    // Use user.id instead of user to ensure the effect runs when the user changes
  }, [user?.id])

  const handleCancel = () => {
    // Revert to original data
    setProfileData({
      ...originalData
    })
    setIsEditing(false)
    
    // Clean up any session storage data for editing
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('profile-data-before-save')
    }
  }

  const handleEdit = async () => {
    if (isEditing) {
      // Save profile data
      setIsLoading(true)
      setError(null)
      
      try {
        // Store current state in session storage before making changes
        // This provides an additional recovery mechanism if the update fails
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('profile-data-before-save', JSON.stringify(profileData));
        }
        
        // Find location ID based on governorate and district
        let locationId = null
        
        // Only look for a location ID if both governorate and district are selected
        if (profileData.governorate && profileData.district) {
          const matchingLocation = locations.find(
            loc => loc.governorate === profileData.governorate && loc.district === profileData.district
          )
          
          if (matchingLocation) {
            locationId = matchingLocation.id
          } else {
            console.warn('No matching location found for selected governorate and district')
          }
        }
        
        // Split full name into first and last name
        const nameParts = profileData.fullName.trim().split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        // Update profile with location_id only if a valid location was selected
        const profileUpdateData: UpdateProfileData = {
          first_name: firstName,
          last_name: lastName,
          phone: profileData.phoneNumber || null,
          email: profileData.email,
        }
        
        // Handle location_id explicitly
        if (locationId !== null) {
          // Only include location_id if we have a valid one
          profileUpdateData.location_id = locationId
        } else if (profileData.governorate === '' && profileData.district === '') {
          // If both governorate and district are empty, explicitly set location_id to null
          // This ensures we're clearing any existing location
          profileUpdateData.location_id = null
        }
        // If governorate/district are selected but no matching locationId was found,
        // we don't include location_id at all to avoid changing the current location
        
        // Update profile
        const updatedProfile = await profileService.updateProfile(profileUpdateData)
        
        // Log the response to help with debugging
        console.log('Profile update response:', updatedProfile)
        
        // Update auth store with new user data
         if (user) {
           // Update the local state with the values from the API response
           // If location was updated in the profile, use those values
           // If location was not included in the update (null location_id), keep the current values
           let updatedGovernorate = '';
           let updatedDistrict = '';
           
           if (updatedProfile.location) {
             // If API returned a location, use it
             updatedGovernorate = updatedProfile.location.governorate;
             updatedDistrict = updatedProfile.location.district;
           } else if (profileData.governorate && profileData.district) {
             // If we didn't update location but had valid values before, keep them
             updatedGovernorate = profileData.governorate;
             updatedDistrict = profileData.district;
           }
           
           // Explicitly check for Beirut Achrafieh default and clear if not intentionally set
           if (updatedGovernorate === 'Beirut' && updatedDistrict === 'Achrafieh') {
             // Only keep Beirut Achrafieh if it was explicitly selected by the user
             const wasExplicitlySelected = 
               (profileData.governorate === 'Beirut' && profileData.district === 'Achrafieh') ||
               (locationId && locations.some(loc => 
                 loc.id === locationId && loc.governorate === 'Beirut' && loc.district === 'Achrafieh'
               ));
               
             if (!wasExplicitlySelected) {
               updatedGovernorate = '';
               updatedDistrict = '';
             }
           }
           
           const updatedProfileData = {
             fullName: `${updatedProfile.first_name} ${updatedProfile.last_name}`,
             phoneNumber: updatedProfile.phone || "",
             email: updatedProfile.email,
             governorate: updatedGovernorate,
             district: updatedDistrict
           };
           
           setProfileData(updatedProfileData);
           // Update original data for future cancel operations
           setOriginalData(updatedProfileData);
           
           // Persist updated profile data to session storage for recovery
           if (typeof window !== 'undefined') {
             sessionStorage.setItem('profile-data-backup', JSON.stringify(updatedProfileData));
             // Remove the pre-save backup as it's no longer needed
             sessionStorage.removeItem('profile-data-before-save');
           }
           
           // Always save location data to localStorage for persistence, even if empty
           // This ensures we're always using the most recent user selection
           if (typeof window !== 'undefined' && user?.id) {
             const userLocationKey = `userLocation_${user.id}`;
             
             if (updatedGovernorate && updatedDistrict) {
               // Save non-empty location data
               localStorage.setItem(userLocationKey, JSON.stringify({
                 governorate: updatedGovernorate,
                 district: updatedDistrict
               }));
               console.log('Saved location to localStorage:', { governorate: updatedGovernorate, district: updatedDistrict });
             } else {
               // If location was explicitly cleared, remove from localStorage
               localStorage.removeItem(userLocationKey);
               console.log('Cleared location from localStorage');
             }
           }
           
           // Also update the auth store with the location data
           // This ensures the location data is properly saved in the auth store
           // and will be available on subsequent logins
           updateUserProfile({
             // We don't need to include other fields as they're already updated
             // by the profileService.updateProfile call above
             // Just ensure the location is properly updated in the auth store
             location_id: locationId,
             // Pass the location data directly to ensure it's properly saved
             // This is a backup in case the backend doesn't return the location
             ...(updatedProfile.location ? {} : {
               location: updatedGovernorate && updatedDistrict ? {
                 id: locationId || 0,
                 governorate: updatedGovernorate,
                 district: updatedDistrict
               } : null
             })
           });
           
           // Show success message
           toast({
             title: "Profile updated",
             description: "Your profile has been updated successfully.",
           });
        }
        
        setIsLoading(false)
      } catch (err: any) {
        // Check if this is an email already exists error
        const isEmailError = err.response?.data?.errors?.email?.includes("The email has already been taken") ||
                            err.response?.data?.message?.includes("email has already been taken") ||
                            err.response?.data?.message?.toLowerCase().includes("email");
        
        if (isEmailError) {
          // For email errors, use the specific error message from the API
          setError(err.response?.data?.message || "The email has already been taken.")
          
          // Revert the email field to its original value but keep other changes intact
          // Use a callback to ensure we're working with the latest state
          setProfileData(prev => ({
            ...prev,
            email: originalData.email // Revert only the email field
          }))
          
          // Remove the pre-save backup as we're handling the error
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('profile-data-before-save');
          }
          
          // Silently handle email validation errors without console output
          // This is an expected validation error, so we don't need to log it
        } else {
          // For non-email errors, log to console and set the general error message
          console.error("Error updating profile:", err)
          setError(err.response?.data?.message || "Failed to update profile")
        }
        
        setIsLoading(false)
        
        // If there was an error, keep the user in edit mode so they can fix it
        // Only for email errors, we want to stay in edit mode
        if (isEmailError) {
          // Stay in edit mode
          return;
        }
      }
    }
    
    // Only toggle edit mode if we're not already in an error state
    // This prevents exiting edit mode when there's an error
    // Check if we had an email error, in which case we want to stay in edit mode
    const isEmailError = error?.toLowerCase().includes('email');
    if (!isEmailError) {
      // Only toggle if we're not in an error state
      setIsEditing(prev => !prev);
    }
  }

  const handleVerify = () => {
    openModal('documentVerification')
  }

  return (
    <section className="bg-background min-h-screen w-full">
      <div className="flex flex-col lg:flex-row w-full h-full">
        <div className="w-full lg:w-64 shrink-0 md:fixed md:left-0 md:top-0 md:bottom-0 md:pt-16 md:z-10">
          <div className="hidden md:block">
            <ProfileSidebar 
              activeItem="profile" 
              fullName={profileData.fullName} 
              profileImage={user?.avatar_url_full || user?.avatar_url || undefined}
              onViewChange={onViewChange}
              onProfileUpdate={handleProfileUpdate}
            />
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5 max-w-full overflow-x-hidden md:ml-64">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-foreground">
              Welcome, {profileData.fullName.split(' ')[0]}
            </h1>
            {error && (
              <div className="text-red-500 text-sm flex items-center gap-1">
                <AlertTriangle size={16} />
                {error}
              </div>
            )}
            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing && (
                <Button
                  onClick={handleCancel}
                  disabled={isLoading}
                  variant="outline"
                  className="px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleEdit}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 w-full">
            <div className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Full Name</Label>
                {isEditing ? (
                  <Input
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">{profileData.fullName}</p>
                )}
              </div>



              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Phone Number</Label>
                {isEditing ? (
                  <Input
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.phoneNumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Email</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full h-10 sm:h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">{profileData.email}</p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">Governorate</Label>
                {isEditing ? (
                  <div className="h-10 sm:h-12 w-full">
                    <Select 
                      value={profileData.governorate} 
                      onValueChange={(value) => handleInputChange("governorate", value)}
                    >
                      <SelectTrigger className="w-full h-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder="Select governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((gov) => (
                          <SelectItem key={gov} value={gov}>
                            {gov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.governorate || "Not specified"}
                  </p>
                )}
              </div>

              <div className="space-y-2 w-full">
                <Label className="text-muted-foreground text-sm sm:text-base">District</Label>
                {isEditing ? (
                  <div className="h-10 sm:h-12 w-full">
                    <Select 
                      value={profileData.district} 
                      onValueChange={(value) => handleInputChange("district", value)}
                      disabled={!profileData.governorate}
                    >
                      <SelectTrigger className="w-full h-full px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                        <SelectValue placeholder={profileData.governorate ? "Select district" : "First select governorate"} />
                      </SelectTrigger>
                      <SelectContent>
                        {districtsForSelectedGovernorate.map((dist) => (
                          <SelectItem key={dist} value={dist}>
                            {dist}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-foreground text-sm sm:text-base py-2 sm:py-3">
                    {profileData.district || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 sm:p-6 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <h3 className="text-muted-foreground font-medium text-sm sm:text-base">Account Verification</h3>
                {user?.email_verified_at ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-primary" />
                    <span className="text-primary text-sm">Verified</span>
                    {user.email_verified_at && (
                      <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                        Verified on {new Date(user.email_verified_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={16} className="text-yellow-500" />
                    <span className="text-muted-foreground text-sm">Not Verified</span>
                  </div>
                )}
              </div>
              {user?.email_verified_at ? (
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  <span className="text-primary text-sm">Verification Complete</span>
                </div>
              ) : (
                <Button
                  onClick={handleVerify}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base w-full sm:w-auto"
                >
                  Verify Account
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalType === 'documentVerification' && <AccVerification />}
    </section>
  )
}