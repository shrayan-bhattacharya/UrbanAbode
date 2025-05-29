'use client';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addProperty as serverAddProperty, type Property } from '@/lib/mock-data'; // Renamed to avoid conflict
import { useRouter } from 'next/navigation'; // For redirecting after success

const propertySchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  location: z.string().min(3, 'Location is required.'),
  address: z.string().min(10, 'Full address is required.'),
  type: z.enum(['Apartment', 'House', 'Condo', 'Townhouse', 'Land']),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms cannot be negative.'),
  bathrooms: z.coerce.number().min(0.5, 'Bathrooms must be at least 0.5.').step(0.5),
  area: z.coerce.number().positive('Area must be a positive number.'),
  imageUrl: z.string().url('Must be a valid URL for the image.'),
  videoUrl: z.string().url('Must be a valid URL for the video.').optional().or(z.literal('')),
  agentName: z.string().min(2, "Agent name is required."),
  agentEmail: z.string().email("Invalid agent email."),
  agentPhone: z.string().min(7, "Agent phone is required."),
  features: z.string().optional().transform(val => val ? val.split(',').map(s => s.trim()).filter(Boolean) : []),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function AddPropertyForm() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      location: '',
      address: '',
      type: 'House',
      bedrooms: 0,
      bathrooms: 0,
      area: 0,
      imageUrl: '',
      videoUrl: '',
      agentName: '',
      agentEmail: '',
      agentPhone: '',
      features: '',
    },
  });

  async function onSubmit(data: PropertyFormValues) {
    // Simulate server action or API call
    // TODO: Implement GSAP animations for form submission feedback
    try {
      const propertyDataToSave = {
        title: data.title,
        description: data.description,
        price: data.price,
        location: data.location,
        address: data.address,
        type: data.type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl || undefined,
        agent: {
          name: data.agentName,
          email: data.agentEmail,
          phone: data.agentPhone,
        },
        features: data.features,
      };

      const newProperty = await serverAddProperty(propertyDataToSave);
      toast({
        title: 'Property Added!',
        description: `"${newProperty.title}" has been successfully listed.`,
      });
      form.reset();
      router.push(`/properties/${newProperty.id}`); // Redirect to the new property's page
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add property. Please try again.',
        variant: 'destructive',
      });
      console.error("Failed to add property:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 sm:p-8 rounded-lg glassmorphism-deep data-[ai-hint=form-animation]">
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
                <FormLabel className="text-primary-foreground">Price (USD)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 750000" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
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
                <FormLabel className="text-primary-foreground">Location (City, State)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Miami, FL" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Full Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 123 Ocean Drive, Miami, FL 33139" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Property Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-input text-foreground">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-popover text-popover-foreground">
                    {['Apartment', 'House', 'Condo', 'Townhouse', 'Land'].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Bedrooms</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 3" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bathrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Bathrooms</FormLabel>
                <FormControl>
                  <Input type="number" step="0.5" placeholder="e.g., 2.5" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Area (sqft)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 1800" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
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
        
        <FormField
            control={form.control}
            name="features"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Features (comma-separated)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Swimming Pool, Garage, Garden" {...field} className="bg-input text-foreground placeholder:text-muted-foreground"/>
                </FormControl>
                <FormDescription className="text-muted-foreground">List key features separated by commas.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

        <h3 className="text-xl font-semibold text-accent pt-4 border-t border-accent/30">Agent Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
           <FormField
            control={form.control}
            name="agentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Agent Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Doe" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Agent Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="e.g., agent@example.com" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground">Agent Phone</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., (555) 123-4567" {...field} className="bg-input text-foreground placeholder:text-muted-foreground" />
                </FormControl>
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
