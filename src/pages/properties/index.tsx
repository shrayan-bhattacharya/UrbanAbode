import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Link from 'next/link';
import Modal from '../../components/Modal';
import EditPropertyForm from '../../components/EditPropertyForm';
import DeleteConfirmation from '../../components/DeleteConfirmation';
import { supabase } from '../../lib/supabaseClient';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  image_url: string;
  video_url?: string;
}

export default function Properties({ properties: initialProperties }: { properties: Property[] }) {
  const [properties, setProperties] = useState(initialProperties);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const handleEdit = (property: Property): void => {
    setSelectedProperty(property);
    setEditModalOpen(true);
  };

  const handleDelete = (property: Property): void => {
    setSelectedProperty(property);
    setDeleteModalOpen(true);
  };

  const refreshProperties = async () => {
    const { data } = await supabase.from('properties').select('*');
    setProperties(data || []);
  };

  // Convert YouTube URL to embeddable format, handling both standard and Shorts URLs
  const getYouTubeEmbedUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;

    // Handle standard YouTube URLs (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
    if (url.includes('watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }

    // Handle YouTube Shorts URLs (e.g., https://youtube.com/shorts/VIDEO_ID)
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : undefined;
    }

    return undefined;
  };

  return (
    <section className="py-20 px-4 md:px-16">
      <h2 className="text-4xl font-bold text-navy mb-12 text-center text-overlay">All Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {properties.map((property) => (
          <div key={property.id} className="relative bg-white bg-opacity-90 p-4 rounded-lg shadow-lg">
            <Link href={`/properties/${property.id}`} className="block">
              <img
                src={property.image_url}
                alt={property.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              {property.video_url && (
                <iframe
                  src={getYouTubeEmbedUrl(property.video_url)}
                  title={property.title}
                  className="w-full h-48 mt-2 rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
              <h3 className="text-xl font-bold text-[#00032e] mt-2">{property.title}</h3>
              <p className="text-gray-600">{property.location}</p>
              <p className="text-[#00032e] font-bold">₹ {property.price}</p>
            </Link>
            <div className="absolute top-2 right-2 flex gap-2" onClick={(e) => e.stopPropagation()}>
              <FaEdit
                className="icon-button"
                onClick={() => handleEdit(property)}
              />
              <FaTrash
                className="icon-button"
                onClick={() => handleDelete(property)}
              />
            </div>
          </div>
        ))}
      </div>
      <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
        {selectedProperty && (
          <EditPropertyForm
            property={selectedProperty}
            onClose={() => setEditModalOpen(false)}
            onUpdate={refreshProperties}
          />
        )}
      </Modal>
      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DeleteConfirmation
          onConfirm={async () => {
            if (selectedProperty) {
              await supabase.from('properties').delete().eq('id', selectedProperty.id);
            }
            setDeleteModalOpen(false);
            refreshProperties();
          }}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </Modal>
    </section>
  );
}

export async function getServerSideProps() {
  const { data } = await supabase.from('properties').select('*');
  return { props: { properties: data } };
}