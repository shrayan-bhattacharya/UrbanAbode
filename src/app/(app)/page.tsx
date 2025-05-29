import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/property/property-card';
import { getProperties } from '@/lib/mock-data';
import type { Property } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const allProperties = await getProperties();
  const featuredProperties = allProperties.slice(0, 6);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center text-center data-[ai-hint=hero-animation]">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Luxury modern cityscape"
          layout="fill"
          objectFit="cover"
          quality={80}
          className="absolute inset-0 z-0 opacity-40"
          data-ai-hint="cityscape modern architecture"
          priority
        />
        <div className="relative z-10 p-6 glassmorphism-deep max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl drop-shadow-md">
            Find Your <span className="text-accent">UrbanAbode</span>
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-lg text-gray-300 sm:text-xl md:text-2xl drop-shadow-sm">
            Discover exceptional properties in prime locations. Your dream home awaits.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/80">
              <Link href="/properties">
                Explore Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/add-property">List Your Property</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 sm:py-24 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">Featured Properties</h2>
            <p className="mt-4 text-lg text-gray-300">
              Handpicked selection of our finest listings.
            </p>
          </div>
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {featuredProperties.map((property: Property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">No featured properties available at the moment.</p>
          )}
          <div className="mt-12 text-center">
            <Button size="lg" variant="outline" asChild className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
              <Link href="/properties">
                View All Properties <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      {/* TODO: Add GSAP animations to elements with data-ai-hint containing 'animation' */}
    </div>
  );
}
