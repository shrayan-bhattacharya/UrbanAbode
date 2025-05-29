export type Property = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address: string;
  type: 'Apartment' | 'House' | 'Condo' | 'Townhouse' | 'Land';
  bedrooms: number;
  bathrooms: number;
  area: number; // in sqft
  imageUrl: string;
  videoUrl?: string;
  createdAt: string; // ISO date string
  agent: {
    name: string;
    phone: string;
    email: string;
  };
  features?: string[]; // e.g., ["Swimming Pool", "Garage", "Garden"]
};
