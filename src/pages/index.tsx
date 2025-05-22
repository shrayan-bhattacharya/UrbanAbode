import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaBuilding, FaEnvelope, FaPhone, FaInfoCircle, FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

gsap.registerPlugin(ScrollTrigger);

interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  bhk: number;
  area: string;
  image_url: string;
  rera_id: string;
  video_url?: string;
}

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const heroRef = useRef(null);
  const overlayRef = useRef(null);
  const headingRef = useRef(null);
  const subheadingRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) {
        console.error("Error fetching properties:", error.message);
      } else {
        setProperties(data);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }
    );

    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 }
    );

    gsap.fromTo(
      subheadingRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: 0.6 }
    );

    gsap.to(heroRef.current, {
      scrollTrigger: {
        trigger: heroRef.current,
        scrub: true,
        start: 'top top',
        end: 'bottom top',
      },
    });
  }, []);

  return (
    <div className="min-h-screen">
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center text-center px-4 z-0">
        <video
          className="video-background"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="https://cdn.pixabay.com/video/2022/03/16/110923-689949643_large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div ref={overlayRef} className="hero-glass-overlay p-8 max-w-3xl">
          <h1 ref={headingRef} className="text-5xl md:text-7xl font-bold mb-4 text-navy text-overlay">
            Discover Your Dream Home
          </h1>
          <p ref={subheadingRef} className="text-lg md:text-2xl text-navy text-overlay">
            Direct from Developers. Zero Brokerage. 100% Transparency.
          </p>
        </div>
      </section>
      <section className="py-20 px-4 md:px-16">
        <h2 className="text-4xl font-bold text-navy mb-12 text-center text-overlay">Featured Properties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`} className="block">
              <div className="glass-card overflow-hidden">
                <img
                  src={property.image_url}
                  alt={property.title}
                  className="h-60 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-navy mb-2">{property.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <FaBuilding className="mr-2 text-navy" /> {property.location}
                  </p>
                  <p className="font-bold text-lg text-navy">₹ {property.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <footer className="bg-navy text-gold py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaInfoCircle className="mr-2" /> About UrbanAbode
            </h3>
            <p className="text-gold text-opacity-90">
              UrbanAbode connects you directly with developers, offering zero brokerage and 100% transparency in finding your dream home.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaFacebook className="mr-2" /> Follow Us
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.facebook.com/people/UrbanAbode/61575812930422/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition duration-300 flex items-center">
                  <FaFacebook className="mr-2" /> Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/urban_abodee/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition duration-300 flex items-center">
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/urbanabode/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition duration-300 flex items-center">
                  <FaLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@UrbanAbode-z4d" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition duration-300 flex items-center">
                  <FaYoutube className="mr-2" /> YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <FaEnvelope className="mr-2" /> Contact Us
            </h3>
            <p className="text-gold text-opacity-90 flex items-center mb-2">
              <FaEnvelope className="mr-2" /> urban.abodeee@gmail.com
            </p>
            <p className="text-gold text-opacity-90 flex items-center">
              <FaPhone className="mr-2" /> +91 9330413315
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-gold text-opacity-70">
          <p>© {new Date().getFullYear()} UrbanAbode. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}