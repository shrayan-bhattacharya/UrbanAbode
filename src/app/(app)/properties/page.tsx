
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property/property-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EditPropertyModal } from '@/components/property/edit-property-modal';
import { DeletePropertyModal } from '@/components/property/delete-property-modal';
import { useToast } from '@/hooks/use-toast';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProperties = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error.message);
      toast({ title: "Error", description: "Failed to fetch properties.", variant: "destructive" });
      setProperties([]);
    } else if (data) {
      const mappedData = data.map(p => ({
        id: String(p.id),
        title: p.title,
        description: p.description,
        price: p.price,
        location: p.location,
        bedrooms: p.bhk || p.bedrooms || 0,
        area: p.area ? String(p.area) : "N/A",
        imageUrl: p.image_url || "https://placehold.co/600x400.png?text=Property",
        videoUrl: p.video_url,
        rera_id: p.rera_id,
        createdAt: p.created_at,
      })) as Property[];
      setProperties(mappedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
  };

  const handleDeleteRequest = (propertyId: string) => {
    setDeletingPropertyId(propertyId);
  };

  const onEditSubmit = async (updatedPropertyData: Partial<Property>) => { // Accept partial for updates
    if (!editingProperty) return;

    // Prepare data for Supabase, mapping back if necessary (e.g. bedrooms to bhk)
    const dataToUpdate: any = { ...updatedPropertyData };
    if (updatedPropertyData.bedrooms !== undefined) {
      dataToUpdate.bhk = updatedPropertyData.bedrooms;
      delete dataToUpdate.bedrooms; // Remove if 'bedrooms' is not a direct Supabase column
    }
    if (updatedPropertyData.imageUrl) dataToUpdate.image_url = updatedPropertyData.imageUrl;


    const { error } = await supabase
      .from('properties')
      .update(dataToUpdate)
      .eq('id', editingProperty.id);

    if (error) {
      toast({ title: "Error", description: `Failed to update property: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Property updated successfully." });
      await fetchProperties(); // Re-fetch to get the latest data
    }
    setEditingProperty(null);
  };

  const onDeleteConfirm = async () => {
    if (!deletingPropertyId) return;
    
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', deletingPropertyId);

    if (error) {
      toast({ title: "Error", description: `Failed to delete property: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Property deleted successfully." });
      await fetchProperties(); // Re-fetch
    }
    setDeletingPropertyId(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Loading Properties...
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
              onDelete={handleDeleteRequest} // Use the new handler name
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-muted-foreground">No properties found. Check back soon or add a new listing!</p>
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          isOpen={!!editingProperty}
          onClose={() => setEditingProperty(null)}
          onSubmit={onEditSubmit} // onSubmit now directly takes partial data for update
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
