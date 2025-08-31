"use client"

import { useState, useEffect } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Location, locationsService } from "@/lib/api/locations";
import { toast } from "sonner";
import { COLORS } from "@/utils/constants";
import { cn } from '@/utils';


// Mock data constants
const INITIAL_USER_DATA = {
  id: "",
  personalDetails: {
    name: "",
    gender: "male",
    phoneNumber: "",
    email: "",
    address: {
      district: "",
      governorate: "",
    },
    profileImage: null as File | null,
  },
};

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

interface UserFormData {
  id: string;
  personalDetails: {
    name: string;
    gender: string;
    phoneNumber: string;
    email: string;
    address: {
      district: string;
      governorate: string;
    };
    profileImage: File | null;
  };
}

interface EditUserProfileProps {
  initialData?: UserFormData;
  mode?: "add" | "edit";
  onBack?: () => void;
  onSave?: (userData: UserFormData) => void;
  onCancel?: () => void;
}

export default function EditUserProfile({
  initialData = INITIAL_USER_DATA,
  mode = "add",
  onBack,
  onSave,
  onCancel,
}: EditUserProfileProps) {
  const [formData, setFormData] = useState<UserFormData>({
    ...initialData,
    personalDetails: {
      ...initialData.personalDetails,
      address: {
        governorate: initialData.personalDetails.address.governorate || "",
        district: initialData.personalDetails.address.district || "",
      },
    },
  });

  const [imageFileName, setImageFileName] = useState<string>("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Load locations from API
  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoadingLocations(true);
        const locationsData = await locationsService.listLocations();
        setLocations(locationsData);
      } catch (err) {
        console.error("Error loading locations:", err);
        toast.error("Failed to load locations");
      } finally {
        setLoadingLocations(false);
      }
    };
    
    loadLocations();
  }, []);

  // Get unique governorates from locations
  const governorates = [...new Set(locations.map((loc: Location) => loc.governorate))].sort();

  // Get districts for the selected governorate
  const getDistricts = () => {
    if (!formData.personalDetails.address.governorate) return [];
    return locations
      .filter((loc: Location) => loc.governorate === formData.personalDetails.address.governorate)
      .map((loc: Location) => loc.district);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child, subChild] = field.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, unknown>),
          [child]: subChild
            ? {
                ...(prev[parent as keyof typeof prev] as any)[child],
                [subChild]: value,
              }
            : value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          [field]: value,
        },
      }));
    }
  };

  const handleAddressChange = (field: "governorate" | "district", value: string) => {
    setFormData(prev => {
      const newAddress = { ...prev.personalDetails.address };
      
      if (field === "governorate") {
        // Reset district when governorate changes
        newAddress.governorate = value;
        newAddress.district = "";
      } else {
        newAddress[field] = value;
      }

      return {
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          address: newAddress,
        },
      };
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          profileImage: file,
        },
      }));
      setImageFileName(file.name);
    }
  };

  const handleBack = () => {
    onBack?.();
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const handleCancel = () => {
    onCancel?.();
  };

  const isFormValid =
    formData.personalDetails.name.trim() &&
    formData.personalDetails.gender &&
    formData.personalDetails.phoneNumber.trim() &&
    formData.personalDetails.email.trim() &&
    formData.personalDetails.address.district.trim() &&
    formData.personalDetails.address.governorate;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          onClick={handleBack}
          className="mb-6 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-md transition-colors z-10"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        {/* Personal Details Section */}
        <div className="bg-background rounded-lg shadow-sm border border-border p-8">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            {mode === "edit" ? "Edit User" : "Add New User"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Image Upload and Basic Info */}
            <div className="space-y-8">
              {/* Image Upload */}
              <div className="flex justify-center lg:justify-start">
                <label htmlFor="profile-image">
                  <div 
                    className="bg-red-500 text-white px-6 py-3 rounded-md cursor-pointer flex items-center gap-2 transition-colors hover:bg-red-600"
                  >
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </div>
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              {imageFileName && (
                <p className="text-sm text-gray-600 text-center lg:text-left">Selected: {imageFileName}</p>
              )}

              {/* Personal Information Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Name</label>
                  <Input
                    type="text"
                    value={formData.personalDetails.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background"
                    placeholder="Enter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Gender</label>
                  <Select
                    value={formData.personalDetails.gender}
                    onValueChange={(value) => handleInputChange("gender", value)}
                  >
                    <SelectTrigger className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.personalDetails.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
                  <Input
                    type="email"
                    value={formData.personalDetails.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background"
                    placeholder="Enter email"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Address */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-6">Address</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Governorate</label>
                    <Select
                      value={formData.personalDetails.address.governorate}
                      onValueChange={(value) => handleAddressChange("governorate", value)}
                    >
                      <SelectTrigger className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background">
                        <SelectValue placeholder="Select governorate" />
                      </SelectTrigger>
                      <SelectContent>
                        {governorates.map((governorate) => (
                          <SelectItem key={governorate} value={governorate}>
                            {governorate}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">District</label>
                    <Select
                      value={formData.personalDetails.address.district}
                      onValueChange={(value) => handleAddressChange("district", value)}
                      disabled={!formData.personalDetails.address.governorate}
                    >
                      <SelectTrigger className="w-full border-border focus:border-red-500 focus:ring-red-500 bg-background">
                        <SelectValue 
                          placeholder={
                            formData.personalDetails.address.governorate 
                              ? "Select district" 
                              : "First select governorate"
                          } 
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {getDistricts().map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-border">
            <Button onClick={handleCancel} variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isFormValid}
              className="bg-red-500 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
            >
              {mode === "edit" ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}