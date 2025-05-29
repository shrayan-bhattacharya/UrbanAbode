'use client';

import { AddPropertyForm } from '@/components/property/add-property-form';
import { useEffect, useRef } from 'react';
// GSAP will be dynamically imported
// import { gsap } from 'gsap';

export default function AddPropertyPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !headingRef.current) return;

    import('gsap').then(m => m.default).then((gsap) => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 } // Added slight delay
        );
      }
    }).catch(error => console.error("Failed to load GSAP for heading", error));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 ref={headingRef} className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
            List Your Property
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form below to add your property to UrbanAbode.
          </p>
        </header>
        <AddPropertyForm />
      </div>
    </div>
  );
}
