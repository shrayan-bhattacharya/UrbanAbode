import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, Info, Building2 } from 'lucide-react'; // Added Building2 for consistency

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground border-t border-accent/30"> {/* text-primary-foreground ensures themed text */}
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center mb-4">
            <Building2 className="mr-2 h-8 w-8 text-accent" /> {/* Using Building2 like header */}
            <h3 className="text-xl font-semibold text-accent">
              UrbanAbode
            </h3>
          </div>
          <p className="text-primary-foreground/80 text-sm"> {/* Adjusted opacity */}
            UrbanAbode connects you directly with developers, offering zero brokerage and 100% transparency in finding your dream home.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center text-accent">
             Follow Us
          </h3>
          <ul className="space-y-3">
            <li>
              <a href="https://www.facebook.com/people/UrbanAbode/61575812930422/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/90 hover:text-accent transition duration-300 flex items-center text-sm">
                <Facebook className="mr-2 h-5 w-5" /> Facebook
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/urban_abodee/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/90 hover:text-accent transition duration-300 flex items-center text-sm">
                <Instagram className="mr-2 h-5 w-5" /> Instagram
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/urbanabode/" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/90 hover:text-accent transition duration-300 flex items-center text-sm">
                <Linkedin className="mr-2 h-5 w-5" /> LinkedIn
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@UrbanAbode-z4d" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/90 hover:text-accent transition duration-300 flex items-center text-sm">
                <Youtube className="mr-2 h-5 w-5" /> YouTube
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center text-accent">
            <Mail className="mr-2 h-6 w-6" /> Contact Us
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center text-primary-foreground/80"> {/* Adjusted opacity */}
              <Mail className="mr-2 h-5 w-5 text-accent" /> urban.abodeee@gmail.com
            </li>
            <li className="flex items-center text-primary-foreground/80"> {/* Adjusted opacity */}
              <Phone className="mr-2 h-5 w-5 text-accent" /> +91 9330413315
            </li>
             <li className="text-primary-foreground/80"> {/* Adjusted opacity */}
              123 Urban Way, Suite 100, Metropolis, USA
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-accent/20 py-6 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} UrbanAbode. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
