
import Link from 'next/link';
import Image from 'next/image';
import type { Property } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, BedDouble, Bath, Sigma, Edit, Trash2 } from 'lucide-react';

interface PropertyCardProps {
  property: Property;
  onEdit?: (property: Property) => void;
  onDelete?: (propertyId: string) => void;
  showActions?: boolean;
}

export function PropertyCard({ property, onEdit, onDelete, showActions = false }: PropertyCardProps) {
  const displayPrice = typeof property.price === 'number'
    ? `₹${property.price.toLocaleString()}`
    : 'Price on request';

  return (
    <Card className="glassmorphism-deep overflow-hidden flex flex-col h-full data-[ai-hint=property-card-animation]">
      <CardHeader className="p-0 relative">
        <Link href={`/properties/${property.id}`} aria-label={`View details for ${property.title}`}>
          <Image
            src={property.imageUrl || "https://placehold.co/400x250.png?text=No+Image"}
            alt={property.title}
            width={400}
            height={250}
            className="w-full h-56 object-cover transition-transform duration-300 hover:scale-105"
            data-ai-hint="property exterior"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/properties/${property.id}`}>
          <CardTitle className="text-xl font-semibold text-primary-foreground hover:text-accent transition-colors line-clamp-2 h-[3em]">
            {property.title}
          </CardTitle>
        </Link>
        <div className="mt-2 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4 text-accent" />
          <span>{property.location}</span>
        </div>
        <p className="mt-2 text-2xl font-bold text-accent">
          {displayPrice}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <BedDouble className="mr-1 h-4 w-4 text-accent" /> {property.bedrooms ?? 'N/A'} Beds
          </div>
          <div className="flex items-center">
            <Bath className="mr-1 h-4 w-4 text-accent" /> {property.bathrooms ?? 'N/A'} Baths
          </div>
          <div className="flex items-center">
            <Sigma className="mr-1 h-4 w-4 text-accent" /> {property.area ?? 'N/A'} sqft
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center mt-auto">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
        {showActions && onEdit && onDelete && (
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(property)} className="text-muted-foreground hover:text-accent">
              <Edit className="h-5 w-5" />
              <span className="sr-only">Edit Property</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(property.id)} className="text-destructive/80 hover:text-destructive">
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Delete Property</span>
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
