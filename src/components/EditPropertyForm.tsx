import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabaseClient';

interface Property {
  id: number;
  title: string;
  location: string;
  price: number;
  video_url?: string;
  // Add other fields as needed
}

interface EditPropertyFormProps {
  property: Property;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditPropertyForm({ property, onClose, onUpdate }: EditPropertyFormProps) {
  const { register, handleSubmit } = useForm({ defaultValues: property });

const onSubmit = async (data: PropertyUpdateData) => {
    const { error } = await supabase.from("properties").update(data).eq("id", property.id);
    if (error) {
        alert("Error updating property: " + error.message);
    } else {
        alert("Property updated successfully!");
        onUpdate();
        onClose();
    }
};

interface PropertyUpdateData {
title?: string;
location?: string;
price?: number;
video_url?: string;
// Add other optional fields as needed
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-[#00032e]">Title</label>
        <input {...register("title")} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-[#00032e]">Location</label>
        <input {...register("location")} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-[#00032e]">Price</label>
        <input {...register("price", { valueAsNumber: true })} type="number" className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-[#00032e]">YouTube Video URL</label>
        <input {...register("video_url")} className="w-full p-2 border rounded" placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      {/* Add other fields as needed */}
      <button type="submit" className="w-full bg-[#edbf6d] text-[#00032e] py-2 rounded">Update Property</button>
    </form>
  );
}