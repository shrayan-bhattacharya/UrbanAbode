import Link from 'next/link';
import Image from 'next/image';
import { getPropertyById, type Property } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, BedDouble, Bath, Sigma, UserCircle, Phone, Mail, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export async function generateStaticParams() {
  // In a real app, fetch all property IDs. For now, let's assume we can't pre-render all.
  // const properties = await getProperties();
  // return properties.map((property) => ({ id: property.id }));
  return []; // Or pre-render a few popular ones if needed.
}


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id);

  if (!property) {
    notFound();
  }

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
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1 mb-6">
            <Image
              src={property.imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              data-ai-hint="property main image"
              priority
            />
          </div>
          {property.videoUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-xl glassmorphism-deep p-1">
              <h3 className="text-xl font-semibold mb-2 text-accent p-2">Property Video Tour</h3>
               {/* Placeholder for video player */}
               <Image
                src={property.videoUrl} // Assuming videoUrl is an image placeholder for now
                alt={`${property.title} video tour`}
                fill
                className="object-cover"
                data-ai-hint="property video"
              />
              {/* In a real app, you would embed a video player here:
              <iframe width="100%" height="100%" src={property.videoUrl} title="Property Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe> 
              */}
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="mt-8 lg:mt-0">
          <div className="p-6 rounded-lg shadow-xl glassmorphism-deep">
            <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground">{property.type}</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{property.title}</h1>
            <div className="mt-3 flex items-center text-lg">
              <MapPin className="mr-2 h-5 w-5 text-accent" />
              <span>{property.address}</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-accent">${property.price.toLocaleString()}</p>
            
            <Separator className="my-6 bg-accent/30" />

            <div className="grid grid-cols-2 gap-4 text-lg">
              <div className="flex items-center"><BedDouble className="mr-2 h-5 w-5 text-accent" /> {property.bedrooms} Bedrooms</div>
              <div className="flex items-center"><Bath className="mr-2 h-5 w-5 text-accent" /> {property.bathrooms} Bathrooms</div>
              <div className="flex items-center col-span-2"><Sigma className="mr-2 h-5 w-5 text-accent" /> {property.area} sq ft</div>
            </div>

            {property.features && property.features.length > 0 && (
              <>
                <Separator className="my-6 bg-accent/30" />
                <h3 className="text-xl font-semibold text-accent mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {property.features.map(feature => (
                    <li key={feature} className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-400" /> {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}
            
            <Separator className="my-6 bg-accent/30" />
            
            <div>
              <h3 className="text-xl font-semibold text-accent mb-3">Property Description</h3>
              <p className="text-base leading-relaxed">{property.description}</p>
            </div>
          </div>

          {/* Agent Information */}
          <div className="mt-8 p-6 rounded-lg shadow-xl glassmorphism-deep">
            <h3 className="text-2xl font-semibold text-accent mb-4">Contact Agent</h3>
            <div className="flex items-center mb-3">
              <UserCircle className="mr-3 h-10 w-10 text-accent" />
              <div>
                <p className="font-semibold text-lg">{property.agent.name}</p>
                <p className="text-sm text-muted-foreground">Listing Agent</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-accent" /> <a href={`tel:${property.agent.phone}`} className="hover:text-accent">{property.agent.phone}</a>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-accent" /> <a href={`mailto:${property.agent.email}`} className="hover:text-accent">{property.agent.email}</a>
              </div>
            </div>
            <Button className="w-full mt-6 bg-accent text-accent-foreground hover:bg-accent/80">
              Request Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
