'use client'; // For modal interactions

import { useEffect, useState } from 'react';
import { PropertyCard } from '@/components/property/property-card';
import { getProperties, type Property } from '@/lib/mock-data'; // Assuming direct import for client-side updates
import { Skeleton } from '@/components/ui/skeleton';
import { EditPropertyModal } from '@/components/property/edit-property-modal';
import { DeletePropertyModal } from '@/components/property/delete-property-modal';
import { useToast } from '@/hooks/use-toast';

// Helper functions for mock data manipulation (would be API calls in a real app)
// These are simplified and assume mockProperties is accessible and mutable here or via imported functions.
// For a real app, you'd re-fetch or use a state management library after mutations.

// Mock deleteProperty function for client-side simulation
async function clientDeleteProperty(id: string): Promise<boolean> {
  // In a real app, this would be an API call.
  // For now, we'll filter out the property from the local state.
  console.log(`Simulating delete for property ID: ${id}`);
  return true; // Simulate successful deletion
}

// Mock updateProperty function for client-side simulation
async function clientUpdateProperty(id: string, updates: Partial<Property>): Promise<Property | null> {
  console.log(`Simulating update for property ID: ${id} with`, updates);
  // For now, we'll just return a modified property or null.
  const dummyUpdatedProperty = { ...updates, id } as Property;
  return dummyUpdatedProperty; // Simulate successful update
}


export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const fetchedProperties = await getProperties();
      setProperties(fetchedProperties);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
  };

  const handleDelete = (propertyId: string) => {
    setDeletingPropertyId(propertyId);
  };

  const onEditSubmit = async (updatedPropertyData: Property) => {
    if (!editingProperty) return;
    
    const updated = await clientUpdateProperty(editingProperty.id, updatedPropertyData);
    if (updated) {
      setProperties(prev => prev.map(p => p.id === updated.id ? { ...p, ...updated } : p)); // Optimistic update
      toast({ title: "Success", description: "Property updated successfully." });
    } else {
      toast({ title: "Error", description: "Failed to update property.", variant: "destructive" });
    }
    setEditingProperty(null);
  };

  const onDeleteConfirm = async () => {
    if (!deletingPropertyId) return;
    
    const success = await clientDeleteProperty(deletingPropertyId);
    if (success) {
      setProperties(prev => prev.filter(p => p.id !== deletingPropertyId)); // Optimistic update
      toast({ title: "Success", description: "Property deleted successfully." });
    } else {
      toast({ title: "Error", description: "Failed to delete property.", variant: "destructive" });
    }
    setDeletingPropertyId(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          All Properties
        </h1>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glassmorphism-deep p-4 rounded-lg">
              <Skeleton className="h-56 w-full" />
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-2 h-4 w-1/2" />
              <Skeleton className="mt-2 h-8 w-1/3" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="mt-4 h-10 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-12 text-center text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
        Explore Our Listings
      </h1>
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {properties.map((property) => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              onEdit={handleEdit}
              onDelete={handleDelete}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-muted-foreground">No properties found. Check back soon!</p>
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          onSubmit={onEditSubmit}
        />
      )}

      {deletingPropertyId && (
        <DeletePropertyModal
          isOpen={!!deletingPropertyId}
          onClose={() => setDeletingPropertyId(null)}
          onConfirm={onDeleteConfirm}
          propertyName={properties.find(p => p.id === deletingPropertyId)?.title || 'this property'}
        />
      )}
    </div>
  );
}
