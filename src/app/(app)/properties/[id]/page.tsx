import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { Property } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, BedDouble, Box, Tag,Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getYouTubeEmbedUrl } from '@/lib/utils';

async function getPropertyByIdFromSupabase(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching property by ID:', error.message);
    return null;
  }
  if (!data) return null;

  // Map Supabase data to Property type
  return {
    id: String(data.id),
    title: data.title,
    description: data.description,
    price: data.price,
    location: data.location,
    bedrooms: data.bhk || data.bedrooms || 0,
    area: data.area ? String(data.area) : "N/A",
    imageUrl: data.image_url || "https://placehold.co/1200x800.png?text=Property+Image",
    videoUrl: data.video_url,
    rera_id: data.rera_id,
    createdAt: data.created_at,
    // Map other fields if necessary, ensuring defaults or optional handling
  };
}


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyByIdFromSupabase(params.id);

  if (!property) {
    notFound();
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(property.videoUrl);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 text-primary-foreground">
      <div className="mb-8">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Link>
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-12">
        {/* Image and Video Gallery */}
        <div className="lg:col-span-2">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1 mb-6">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover rounded-md"
              data-ai-hint="property main image"
              priority
            />
          </div>
          {youtubeEmbedUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1">
              <h3 className="text-xl font-semibold mb-2 text-accent p-2">Property Video</h3>
              <iframe
                src={youtubeEmbedUrl}
                title={property.title + " Video"}
                className="w-full h-full rounded-md"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-8 lg:mt-0">
          <div className="p-6 rounded-lg shadow-xl glassmorphism-deep">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-accent">{property.title}</h1>
            <div className="mt-3 flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5 text-accent" />
              <span>{property.location}</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-primary-foreground">₹{property.price.toLocaleString()}</p>
            
            <Separator className="my-6 bg-accent/30" />

            <div className="space-y-3 text-lg">
              {property.bedrooms > 0 && (
                <div className="flex items-center"><BedDouble className="mr-2 h-5 w-5 text-accent" /> {property.bedrooms} Bedrooms</div>
              )}
              <div className="flex items-center"><Box className="mr-2 h-5 w-5 text-accent" /> {property.area}</div>
              {property.rera_id && (
                <div className="flex items-center"><Award className="mr-2 h-5 w-5 text-accent" /> RERA: {property.rera_id}</div>
              )}
            </div>
            
            <Separator className="my-6 bg-accent/30" />
            
            <div>
              <h3 className="text-xl font-semibold text-accent mb-3">Property Description</h3>
              <p className="text-base leading-relaxed">{property.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
