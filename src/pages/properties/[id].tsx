import { useRouter } from 'next/router';
  import { useEffect, useState } from 'react';
  import { supabase } from '../../lib/supabaseClient';
  import Link from 'next/link';

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

  export default function PropertyDetails() {
    const router = useRouter();
    const { id } = router.query as { id: string };
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!id) return;
      const fetchProperty = async () => {
        try {
          const { data, error } = await supabase.from("properties").select("*").eq("id", id).single();
          if (error) throw error;
          setProperty(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }, [id]);

    if (loading) return <div className="text-center text-[#00032e] p-8">Loading...</div>;
    if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;
    if (!property) return <div className="text-center text-[#00032e] p-8">Property not found</div>;

    const getYouTubeEmbedUrl = (url: string | undefined): string | null => {
      if (!url) return null;
      if (url.includes('watch?v=')) {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      if (url.includes('youtube.com/shorts/')) {
        const videoId = url.split('shorts/')[1]?.split('?')[0];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }
      return null;
    };

    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto glass-card p-6">
          <img
            src={property.image_url}
            alt={property.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
          {property.video_url && (
            <iframe
              src={getYouTubeEmbedUrl(property.video_url) || undefined}
              title={property.title}
              className="w-full h-96 mt-2 rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
          <h1 className="text-4xl font-bold text-[#00032e] mb-4">{property.title}</h1>
          <p className="text-lg text-gray-600 mb-2">{property.location}</p>
          <p className="text-2xl font-bold text-[#00032e] mb-4">₹ {property.price}</p>
          <p className="text-gray-600 mb-6">{property.description || "No description available."}</p>
          <p className="text-gray-600 mb-2"><strong>BHK:</strong> {property.bhk || "N/A"}</p>
          <p className="text-gray-600 mb-2"><strong>Area:</strong> {property.area || "N/A"}</p>
          <p className="text-gray-600 mb-6"><strong>RERA ID:</strong> {property.rera_id || "N/A"}</p>
          <Link href="/properties" className="text-[#edbf6d] hover:text-[#00032e] underline">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }