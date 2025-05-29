
// Represents the structure of property data from Supabase & PRD requirements
export type Property = {
  id: string; // Ensure string, Supabase might return number but we'll cast
  title: string;
  description: string;
  price: string; // Changed from number to string
  location: string; // From Supabase 'location' (e.g., city, state)
  
  bedrooms: number; // Mapped from Supabase 'bhk'
  area: string | number; // From Supabase (e.g. 'area'), can be string like "1500 sqft" or number.
  
  imageUrl: string; // Mapped from Supabase 'image_url'
  videoUrl?: string; // Mapped from Supabase 'video_url'
  
  rera_id?: string; // From Supabase 'rera_id' or user input
  createdAt?: string; // Supabase provides 'created_at'
  updatedAt?: string; // For tracking updates
  
  // Fields from PRD that might not be in simple Supabase table / basic forms
  address?: string; 
  type?: 'Apartment' | 'House' | 'Condo' | 'Townhouse' | 'Land';
  bathrooms?: number; 
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
  features?: string[];

  // Keep original Supabase field names if needed for direct mapping access, ensure they are optional
  image_url?: string; 
  video_url?: string;
  created_at?: string;
  bhk?: number; // If 'bhk' is the column name in Supabase for bedrooms
};
