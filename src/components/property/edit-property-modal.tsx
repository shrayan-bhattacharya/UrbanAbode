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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Property } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const propertyEditSchema = z.object({
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

type PropertyEditFormValues = z.infer<typeof propertyEditSchema>;

interface EditPropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Property) => Promise<void>; // Expects full property for optimistic updates
}

export function EditPropertyModal({ property, isOpen, onClose, onSubmit }: EditPropertyModalProps) {
  const form = useForm<PropertyEditFormValues>({
    resolver: zodResolver(propertyEditSchema),
    defaultValues: {
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      address: property.address,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      imageUrl: property.imageUrl,
      videoUrl: property.videoUrl || '',
      agentName: property.agent.name,
      agentEmail: property.agent.email,
      agentPhone: property.agent.phone,
      features: property.features?.join(', ') || '',
    },
  });

  useEffect(() => {
    if (property) {
      form.reset({
        title: property.title,
        description: property.description,
        price: property.price,
        location: property.location,
        address: property.address,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        area: property.area,
        imageUrl: property.imageUrl,
        videoUrl: property.videoUrl || '',
        agentName: property.agent.name,
        agentEmail: property.agent.email,
        agentPhone: property.agent.phone,
        features: property.features?.join(', ') || '',
      });
    }
  }, [property, form]);

  async function handleFormSubmit(data: PropertyEditFormValues) {
    const updatedPropertyData: Property = {
      ...property, // Spread existing property to keep id, createdAt etc.
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
    await onSubmit(updatedPropertyData);
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
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="bg-input placeholder:text-muted-foreground"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City, State)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-input placeholder:text-muted-foreground"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-input placeholder:text-muted-foreground"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-input"><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover text-popover-foreground">
                        {['Apartment', 'House', 'Condo', 'Townhouse', 'Land'].map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField control={form.control} name="bedrooms" render={({ field }) => ( <FormItem><FormLabel>Beds</FormLabel><FormControl><Input type="number" {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="bathrooms" render={({ field }) => ( <FormItem><FormLabel>Baths</FormLabel><FormControl><Input type="number" step="0.5" {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="area" render={({ field }) => ( <FormItem><FormLabel>Area (sqft)</FormLabel><FormControl><Input type="number" {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
            </div>
             <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="videoUrl" render={({ field }) => ( <FormItem><FormLabel>Video URL (Opt.)</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
             <FormField control={form.control} name="features" render={({ field }) => ( <FormItem><FormLabel>Features (comma-sep)</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
            
            <h4 className="text-lg font-semibold text-accent pt-2 border-t border-accent/20">Agent Info</h4>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="agentName" render={({ field }) => ( <FormItem><FormLabel>Agent Name</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="agentEmail" render={({ field }) => ( <FormItem><FormLabel>Agent Email</FormLabel><FormControl><Input type="email" {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
                <FormField control={form.control} name="agentPhone" render={({ field }) => ( <FormItem><FormLabel>Agent Phone</FormLabel><FormControl><Input {...field} className="bg-input placeholder:text-muted-foreground"/></FormControl><FormMessage /></FormItem>)} />
             </div>
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
