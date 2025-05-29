import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-accent/30 bg-primary text-primary-foreground">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="text-lg font-semibold text-accent">About UrbanAbode</h3>
          <p className="mt-4 text-sm text-gray-300">
            UrbanAbode is your premier destination for finding modern and luxurious properties. We are dedicated to helping you discover your dream home.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-accent">Connect With Us</h3>
          <div className="mt-4 flex space-x-4">
            <Link href="#" aria-label="Facebook" className="text-gray-300 hover:text-accent">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-gray-300 hover:text-accent">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-gray-300 hover:text-accent">
              <Linkedin className="h-6 w-6" />
            </Link>
            <Link href="#" aria-label="YouTube" className="text-gray-300 hover:text-accent">
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-accent">Contact Us</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li className="flex items-center gap-2 text-gray-300">
              <Mail className="h-5 w-5 text-accent" />
              <span>info@urbanabode.com</span>
            </li>
            <li className="flex items-center gap-2 text-gray-300">
              <Phone className="h-5 w-5 text-accent" />
              <span>(555) 123-4567</span>
            </li>
            <li className="text-gray-300">
              123 Urban Way, Suite 100, Metropolis, USA
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-accent/20 bg-primary py-6 text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} UrbanAbode. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
