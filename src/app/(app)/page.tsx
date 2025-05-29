'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import type { Property } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react'; // Using MapPin instead of FaBuilding for consistency

// GSAP will be dynamically imported
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('properties') // Assuming your table is named 'properties'
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        console.error('Error fetching properties:', error.message);
      } else if (data) {
        // Map Supabase data to our Property type
        const fetchedProperties = data.map((p: any) => ({
          ...p,
          id: String(p.id), // Ensure id is string
          imageUrl: p.image_url, // Map image_url to imageUrl
          videoUrl: p.video_url, // Map video_url to videoUrl
          createdAt: p.created_at,
          bedrooms: p.bhk || p.bedrooms, // Handle 'bhk' or 'bedrooms'
          // area: typeof p.area === 'string' ? parseFloat(p.area) : p.area, // Example: Convert area string to number
        })) as Property[];
        setProperties(fetchedProperties);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    Promise.all([
      import('gsap').then(m => m.default),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger)
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger);

      if (overlayRef.current) {
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
        );
      }
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 }
        );
      }
      if (subheadingRef.current) {
        gsap.fromTo(
          subheadingRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: 0.6 }
        );
      }

      // Example of scroll-triggered animation for property cards if desired
      // gsap.utils.toArray('.property-card-item').forEach((card: any) => {
      //   gsap.fromTo(card, 
      //     { opacity: 0, y: 50 },
      //     {
      //       opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      //       scrollTrigger: {
      //         trigger: card,
      //         start: 'top 85%', // Start animation when card is 85% from top of viewport
      //         toggleActions: 'play none none none', // Play animation once
      //       }
      //     }
      //   );
      // });

      // Note: The ScrollTrigger for heroRef.current seems to be missing a .to() target for an animation.
      // If it's for parallax or other effects, ensure the .to() part is correctly defined.
      // For example, to create a parallax effect on the video:
      // if (heroRef.current && heroRef.current.querySelector('.video-background')) {
      //   gsap.to(heroRef.current.querySelector('.video-background'), {
      //     yPercent: 30, // Move video 30% down as user scrolls
      //     ease: "none",
      //     scrollTrigger: {
      //       trigger: heroRef.current,
      //       scrub: true,
      //       start: 'top top',
      //       end: 'bottom top',
      //     },
      //   });
      // }

    }).catch(error => console.error("Failed to load GSAP modules", error));
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[70vh] md:min-h-screen flex items-center justify-center text-center px-4 z-0 overflow-hidden">
        <video
          className="video-background"
          autoPlay
          loop
          muted
          playsInline
          poster="https://placehold.co/1920x1080.png?text=Loading+Video..."
          data-ai-hint="cityscape modern architecture"
        >
          <source src="https://cdn.pixabay.com/video/2022/03/16/110923-689949643_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div ref={overlayRef} className="relative z-10 p-6 sm:p-8 glassmorphism-deep max-w-3xl mx-auto">
          <h1 ref={headingRef} className="text-4xl font-extrabold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl drop-shadow-md">
            Discover Your <span className="text-accent">Dream Home</span>
          </h1>
          <p ref={subheadingRef} className="mt-6 max-w-xl mx-auto text-lg text-gray-300 sm:text-xl md:text-2xl drop-shadow-sm">
            Direct from Developers. Zero Brokerage. 100% Transparency.
          </p>
           <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
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
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {properties.map((property: Property) => (
                <Link key={property.id} href={`/properties/${property.id}`} className="block group property-card-item">
                  <div className="glassmorphism-deep rounded-lg overflow-hidden shadow-xl flex flex-col h-full transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:scale-105">
                    <div className="relative w-full h-60">
                      <Image
                        src={property.imageUrl || "https://placehold.co/600x400.png?text=Property+Image"}
                        alt={property.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        className="rounded-t-lg"
                        data-ai-hint="property exterior"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-primary-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2 h-[3em]">{property.title}</h3>
                      <div className="text-sm text-muted-foreground mb-2 flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-accent" /> {property.location}
                      </div>
                      <p className="font-bold text-lg text-accent mt-auto">
                        {property.price ? `₹ ${property.price.toLocaleString()}` : 'Price on request'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Loading properties or no featured properties available...</p>
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
    </div>
  );
}
