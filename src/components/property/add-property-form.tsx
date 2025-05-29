
'use client';

import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
// GSAP will be dynamically imported
// import { gsap } from 'gsap';


const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  price: z.string().min(1, 'Price is required (e.g., "50,00,000", "3600/sq.ft.", or "Price on Request").'),
  location: z.string().min(3, 'Location is required.'),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms (BHK) cannot be negative.'), // Representing 'bhk'
  area: z.string().min(1, 'Area is required (e.g., "1800 sqft").'), // Changed to string to allow units
  imageUrl: z.string().url('Must be a valid URL for the image.'),
  rera_id: z.string().optional(),
  videoUrl: z.string().url('Must be a valid URL for the video.').optional().or(z.literal('')),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function AddPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: '', // Default to empty string
      location: '',
      bedrooms: 0,
      area: '', // Default to empty string
      imageUrl: '',
      rera_id: '',
      videoUrl: '',
    },
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !formRef.current) return;

    import('gsap').then(m => m.default).then((gsap) => {
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
        );
      }
    }).catch(error => console.error("Failed to load GSAP for form", error));
  }, []);


  async function onSubmit(data: PropertyFormValues) {
    try {
      const propertyDataToSave = {
        title: data.title,
        description: data.description,
        price: data.price, // Price is now a string
        location: data.location,
        bhk: data.bedrooms, 
        area: data.area, // Area is now a string
        image_url: data.imageUrl,
        rera_id: data.rera_id || null,
        video_url: data.videoUrl || null,
      };

      const { data: newPropertyData, error } = await supabase
        .from('properties')
        .insert([propertyDataToSave])
        .select()
        .single(); 

      if (error) {
        throw error;
      }

      toast({
        title: 'Property Added!',
        description: `"${newPropertyData.title}" has been successfully listed.`,
      });
      form.reset();
      router.push(`/properties/${newPropertyData.id}`);
    } catch (error: any) {
      toast({
        title: 'Error Adding Property',
        description: error.message || 'Failed to add property. Please try again.',
        variant: 'destructive',
      });
      console.error("Failed to add property:", error);
    }
  }

  return (
    <Form {...form}>
      <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 sm:p-8 rounded-lg glassmorphism-deep">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Property Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Modern Beachfront Villa" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Price</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g., 50,00,000 or 3600/sq.ft." {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                 <FormDescription className="text-muted-foreground">Enter amount, unit (e.g., /sq.ft.), or "Price on Request".</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary-foreground">Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the property..." {...field} rows={5} className="bg-input text-foreground placeholder:text-muted-foreground" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Location (e.g., City, Area)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Mumbai, Bandra" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="bedrooms" 
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Bedrooms (BHK)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 3" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Area</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="e.g., 1800 sqft" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormDescription className="text-muted-foreground">Enter area with units (e.g. sqft, sqm).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rera_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">RERA ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., A123XYZ" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>


        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Main Image URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com/image.jpg" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormDescription className="text-muted-foreground">Link to the primary image of the property.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Video URL (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://youtube.com/watch?v=..." {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormDescription className="text-muted-foreground">Link to a video tour of the property.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" size="lg" className="w-full md:w-auto bg-accent text-accent-foreground hover:bg-accent/80" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Submitting...' : 'Add Property'}
        </Button>
      </form>
    </Form>
  );
}
