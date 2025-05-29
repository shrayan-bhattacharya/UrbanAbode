
import Link from 'next/link';
import { Home, ListCollapse, PlusCircle, Building2 } from 'lucide-react';
import { ThemeToggleButton } from '@/components/theme-toggle-button';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-accent/30 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-accent" />
          <span className="text-2xl font-bold text-foreground">UrbanAbode</span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'default' }),
              'flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent/20 hover:text-accent'
            )}
          >
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Home</span>
          </Link>

          <Link
            href="/properties"
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'default' }),
              'flex items-center gap-1 sm:gap-2 text-foreground hover:bg-accent/20 hover:text-accent'
            )}
          >
            <ListCollapse className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Properties</span>
          </Link>

          <Link
            href="/add-property"
            className={cn(
              buttonVariants({ variant: 'default', size: 'default' }),
              'flex items-center gap-1 sm:gap-2 bg-accent text-accent-foreground hover:bg-accent/80'
            )}
          >
            <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Add Property</span>
          </Link>
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
}
