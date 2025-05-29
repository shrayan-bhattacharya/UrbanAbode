
'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Property } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const propertyEditSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  price: z.string().min(1, 'Price is required (e.g., "50,00,000", "3600/sq.ft.", or "Price on Request").'),
  location: z.string().min(3, 'Location is required.'),
  bedrooms: z.coerce.number().int().min(0, 'Bedrooms (BHK) cannot be negative.'),
  area: z.string().min(1, 'Area is required (e.g., "1200 sqft").'),
  imageUrl: z.string().url('Must be a valid URL for the image.'),
  videoUrl: z.string().url('Must be a valid URL for the video.').optional().or(z.literal('')),
  rera_id: z.string().optional(),
});

type PropertyEditFormValues = z.infer<typeof propertyEditSchema>;

interface EditPropertyModalProps {
  property: Property; 
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyEditFormValues) => Promise<void>; 
}

export function EditPropertyModal({ property, isOpen, onClose, onSubmit }: EditPropertyModalProps) {
  const form = useForm<PropertyEditFormValues>({
    resolver: zodResolver(propertyEditSchema),
    defaultValues: {
      title: property.title || '',
      description: property.description || '',
      price: property.price || '', // Now a string
      location: property.location || '',
      bedrooms: property.bedrooms || 0,
      area: String(property.area || ''),
      imageUrl: property.imageUrl || '',
      videoUrl: property.videoUrl || '',
      rera_id: property.rera_id || '',
    },
  });

  useEffect(() => {
    if (property && isOpen) { // Ensure reset happens when modal is opened with new property
      form.reset({
        title: property.title,
        description: property.description,
        price: property.price, // Now a string
        location: property.location,
        bedrooms: property.bedrooms,
        area: String(property.area),
        imageUrl: property.imageUrl,
        videoUrl: property.videoUrl || '',
        rera_id: property.rera_id || '',
      });
    }
  }, [property, form, isOpen]);

  async function handleFormSubmit(data: PropertyEditFormValues) {
    await onSubmit(data); 
    onClose(); 
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] glassmorphism-deep text-foreground">
        <DialogHeader>
          <DialogTitle className="text-accent text-2xl">Edit Property</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Make changes to "{property.title}". Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input placeholder:text-muted-foreground"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} className="bg-input placeholder:text-muted-foreground"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} placeholder="e.g., 50,00,000 or 3600/sq.ft." className="bg-input placeholder:text-muted-foreground"/>
                    </FormControl>
                    <FormDescription className="text-muted-foreground">Enter amount, unit, or "Price on Request".</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (e.g. City, Area)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-input placeholder:text-muted-foreground"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="bedrooms" render={({ field }) => ( <FormItem><FormLabel>Bedrooms (BHK)</FormLabel><FormControl><Input type="number" {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="area" render={({ field }) => ( <FormItem><FormLabel>Area</FormLabel><FormControl><Input type="text" {...field} placeholder="e.g., 1200 sqft" className="bg-input placeholder:text-muted-foreground"/></FormControl> <FormDescription className="text-muted-foreground">Enter area with units.</FormDescription><FormMessage /></FormItem>)} />
            </div>
             <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="videoUrl" render={({ field }) => ( <FormItem><FormLabel>Video URL (Optional, YouTube)</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="rera_id" render={({ field }) => ( <FormItem><FormLabel>RERA ID (Optional)</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
            
             <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="border-muted-foreground text-muted-foreground hover:border-accent hover:text-accent">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/80" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
