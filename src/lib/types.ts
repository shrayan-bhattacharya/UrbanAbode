// Represents the structure of property data from Supabase & PRD requirements
export type Property = {
  id: string; // Ensure string, Supabase might return number
  title: string;
  description: string;
  price: number;
  location: string; // From Supabase 'location' (e.g., city, state)
  address?: string; // Full address (PRD requirement, may not be in current Supabase table)
  type?: 'Apartment' | 'House' | 'Condo' | 'Townhouse' | 'Land'; // PRD requirement
  
  bedrooms?: number; // From Supabase (e.g., 'bhk' or 'bedrooms')
  bathrooms?: number; // From Supabase or PRD requirement
  area?: number | string; // From Supabase (e.g. 'area'), PRD wants number. Can be string like "1500 sqft" or number.
  
  imageUrl: string; // Mapped from Supabase 'image_url'
  videoUrl?: string; // Mapped from Supabase 'video_url'
  
  rera_id?: string; // From Supabase 'rera_id' or user input
  createdAt?: string; // Supabase provides 'created_at'
  updatedAt?: string; // For tracking updates
  
  agent?: { // PRD requirement - now optional from form
    name: string;
    phone: string;
    email: string;
  };
  features?: string[]; // PRD requirement - now optional from form

  // Keep original Supabase field names if needed for direct mapping access
  // These are optional if you prefer to only use the mapped names above
  image_url?: string; 
  video_url?: string;
  created_at?: string;
  bhk?: number; // If 'bhk' is the column name in Supabase for bedrooms
};
