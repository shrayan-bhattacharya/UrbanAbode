import type { Property } from './types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Luxurious Downtown Apartment',
    description: 'A stunning apartment in the heart of the city with breathtaking views and modern amenities.',
    price: 1200000,
    location: 'New York, NY',
    address: '123 Main St, New York, NY 10001',
    type: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    imageUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/600x400.png/00032E/B89357?text=Sample+Video', // Placeholder for video
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    agent: { name: 'Jane Doe', phone: '555-1234', email: 'jane.doe@urbanabode.com' },
    features: ['City View', 'Modern Kitchen', 'Gym Access'],
  },
  {
    id: '2',
    title: 'Cozy Suburban House',
    description: 'Charming house in a quiet suburban neighborhood, perfect for families.',
    price: 750000,
    location: 'Austin, TX',
    address: '456 Oak Ln, Austin, TX 78701',
    type: 'House',
    bedrooms: 4,
    bathrooms: 3,
    area: 2500,
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    agent: { name: 'John Smith', phone: '555-5678', email: 'john.smith@urbanabode.com' },
    features: ['Large Backyard', 'Fireplace', 'Two-car Garage'],
  },
  {
    id: '3',
    title: 'Modern Beachfront Condo',
    description: 'Sleek condo with direct beach access and ocean views.',
    price: 2500000,
    location: 'Miami, FL',
    address: '789 Ocean Dr, Miami, FL 33101',
    type: 'Condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 1500,
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    agent: { name: 'Alice Brown', phone: '555-8765', email: 'alice.brown@urbanabode.com' },
    features: ['Ocean View', 'Private Balcony', 'Swimming Pool'],
  },
  {
    id: '4',
    title: 'Spacious Family Home',
    description: 'Large home with plenty of room for a growing family, featuring a beautiful garden.',
    price: 980000,
    location: 'Chicago, IL',
    address: '321 Pine St, Chicago, IL 60601',
    type: 'House',
    bedrooms: 5,
    bathrooms: 3.5,
    area: 3200,
    imageUrl: 'https://placehold.co/600x400.png',
    videoUrl: 'https://placehold.co/600x400.png/00032E/B89357?text=Home+Tour',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    agent: { name: 'Robert Green', phone: '555-4321', email: 'robert.green@urbanabode.com' },
    features: ['Garden', 'Playroom', 'Home Office'],
  },
  {
    id: '5',
    title: 'Chic Urban Loft',
    description: 'Stylish loft in a converted warehouse, boasting industrial design and open spaces.',
    price: 1500000,
    location: 'San Francisco, CA',
    address: '654 Factory Rd, San Francisco, CA 94101',
    type: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 2000,
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    agent: { name: 'Emily White', phone: '555-1122', email: 'emily.white@urbanabode.com' },
    features: ['High Ceilings', 'Exposed Brick', 'Rooftop Deck Access'],
  },
  {
    id: '6',
    title: 'Rustic Countryside Estate',
    description: 'Expansive estate with acres of land, offering privacy and tranquility.',
    price: 3200000,
    location: 'Nashville, TN',
    address: '987 Country Ln, Nashville, TN 37201',
    type: 'House',
    bedrooms: 6,
    bathrooms: 5,
    area: 5500,
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    agent: { name: 'Michael Black', phone: '555-3344', email: 'michael.black@urbanabode.com' },
    features: ['Private Land', 'Horse Stables', 'Lake Access'],
  },
  {
    id: '7',
    title: 'Affordable Starter Home',
    description: 'Perfect for first-time homebuyers, this cozy home is ready to move in.',
    price: 350000,
    location: 'Denver, CO',
    address: '111 Mountain View, Denver, CO 80201',
    type: 'House',
    bedrooms: 3,
    bathrooms: 2,
    area: 1600,
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
    agent: { name: 'Sarah Blue', phone: '555-5566', email: 'sarah.blue@urbanabode.com' },
    features: ['Updated Kitchen', 'Fenced Yard', 'Quiet Street'],
  },
];

// Functions to interact with mock data (simulating API/DB)
export const getProperties = async (): Promise<Property[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockProperties.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())), 500));
};

export const getPropertyById = async (id: string): Promise<Property | undefined> => {
  return new Promise((resolve) => setTimeout(() => resolve(mockProperties.find(p => p.id === id)), 300));
};

export const addProperty = async (propertyData: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newProperty: Property = {
        ...propertyData,
        id: String(mockProperties.length + 1 + Math.random()), // Ensure unique ID
        createdAt: new Date().toISOString(),
      };
      mockProperties.unshift(newProperty); // Add to the beginning to appear as newest
      resolve(newProperty);
    }, 500);
  });
};

export const updateProperty = async (id: string, updates: Partial<Property>): Promise<Property | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProperties.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProperties[index] = { ...mockProperties[index], ...updates, updatedAt: new Date().toISOString() } as Property;
        resolve(mockProperties[index]);
      } else {
        resolve(null);
      }
    }, 500);
  });
};

export const deleteProperty = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProperties.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProperties.splice(index, 1);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};
