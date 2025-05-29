
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { Property } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, BedDouble, Box, Tag, Award, Video, ImageOff } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { getYouTubeEmbedUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
    price: data.price, // Keep as number or null
    location: data.location,
    bedrooms: data.bhk || data.bedrooms || 0,
    area: data.area ? String(data.area) : "N/A",
    imageUrl: data.image_url || "", // Ensure empty string if null
    videoUrl: data.video_url,
    rera_id: data.rera_id,
    createdAt: data.created_at,
  };
}


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyByIdFromSupabase(params.id);

  if (!property) {
    notFound();
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(property.videoUrl);
  const displayPrice = typeof property.price === 'number' 
    ? `₹${property.price.toLocaleString()}` 
    : 'Price on request';

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 text-primary-foreground">
      <div className="mb-8">
        <Button variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
          <Link href="/properties">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Properties
          </Link>
        </Button>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-x-12 lg:gap-y-8">
        {/* Image and Video Gallery */}
        <div className="lg:col-span-2 space-y-6">
          {property.imageUrl ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1">
              <Image
                src={property.imageUrl}
                alt={property.title}
                fill
                className="object-cover rounded-md"
                data-ai-hint="property main image"
                priority
              />
            </div>
          ) : (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1 flex flex-col items-center justify-center bg-muted/30">
              <ImageOff className="h-24 w-24 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No image available</p>
            </div>
          )}

          {youtubeEmbedUrl && (
            <div className="glassmorphism-deep rounded-lg shadow-xl p-1">
              <div className="flex items-center p-3 border-b border-accent/20">
                <Video className="mr-2 h-6 w-6 text-accent" />
                <h3 className="text-xl font-semibold text-accent">Property Video</h3>
              </div>
              <div className="relative aspect-video w-full overflow-hidden rounded-b-lg p-2">
                <iframe
                  src={youtubeEmbedUrl}
                  title={property.title + " Video"}
                  className="w-full h-full rounded-md"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-8 lg:mt-0 lg:col-span-1">
          <div className="p-6 rounded-lg shadow-xl glassmorphism-deep h-full">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-accent mb-1">{property.title}</h1>
            <div className="mt-2 flex items-center text-lg text-muted-foreground mb-3">
              <MapPin className="mr-2 h-5 w-5 text-accent" />
              <span>{property.location}</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-primary-foreground">{displayPrice}</p>
            
            <Separator className="my-6 bg-accent/30" />

            <div className="space-y-4 text-lg">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <BedDouble className="mr-3 h-5 w-5 text-accent flex-shrink-0" /> 
                  <span className="text-muted-foreground mr-2">Bedrooms:</span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Box className="mr-3 h-5 w-5 text-accent flex-shrink-0" /> 
                <span className="text-muted-foreground mr-2">Area:</span>
                <span className="font-medium">{property.area}</span>
              </div>
              {property.rera_id && (
                <div className="flex items-center">
                  <Award className="mr-3 h-5 w-5 text-accent flex-shrink-0" /> 
                  <span className="text-muted-foreground mr-2">RERA ID:</span>
                  <Badge variant="secondary" className="font-medium">{property.rera_id}</Badge>
                </div>
              )}
            </div>
            
            {property.description && (
              <>
                <Separator className="my-6 bg-accent/30" />
                <div>
                  <h3 className="text-xl font-semibold text-accent mb-3">Property Description</h3>
                  <p className="text-base leading-relaxed text-muted-foreground">{property.description}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
