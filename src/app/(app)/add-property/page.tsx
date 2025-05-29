import { AddPropertyForm } from '@/components/property/add-property-form';

export default function AddPropertyPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
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
