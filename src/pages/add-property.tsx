import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";

interface FormState {
  title: string;
  description: string;
  price: string;
  location: string;
  bhk: string;
  area: string;
  image_url: string;
  rera_id: string;
  video_url: string;
}

export default function AddProperty() {
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: "",
    location: "",
    bhk: "",
    area: "",
    image_url: "",
    rera_id: "",
    video_url: "",
  });

  const formRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('gsap').then(({ default: gsap }) => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
      );

      gsap.fromTo(
        headingRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1.2, ease: 'power3.out' }
      );
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { error } = await supabase.from("properties").insert([{
      title: form.title || null,
      description: form.description || null,
      price: form.price ? parseFloat(form.price) : null,
      location: form.location || null,
      bhk: form.bhk ? parseInt(form.bhk) : null,
      area: form.area || null,
      image_url: form.image_url || null,
      rera_id: form.rera_id || null,
      video_url: form.video_url || null,
    }]);

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("✅ Property added!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div ref={formRef} className="glass-card w-full max-w-lg p-8">
        <h1 ref={headingRef} className="text-4xl font-bold text-navy mb-6 text-overlay">Add a Property</h1>
        {(["title", "description", "price", "location", "bhk", "area", "image_url", "rera_id", "video_url"] as (keyof FormState)[]).map((field) => (
          <div key={field} className="mb-4">
            <label className="block text-navy mb-2 capitalize">{field.replace('_', ' ')}</label>
            {field === "description" ? (
              <textarea
                name={field}
                className="w-full p-3 rounded-lg"
                value={form[field]}
                onChange={handleChange}
              />
            ) : (
              <input
                name={field}
                type={field === "price" || field === "bhk" ? "number" : "text"}
                className="w-full p-3 rounded-lg"
                value={form[field]}
                onChange={handleChange}
                placeholder={field === "video_url" ? "https://www.youtube.com/watch?v=..." : ""}
              />
            )}
          </div>
        ))}
        <button
          className="w-full bg-navy text-gold font-semibold py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
          onClick={handleSubmit}
        >
          Submit Property
        </button>
      </div>
    </div>
  );
}