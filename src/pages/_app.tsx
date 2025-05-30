import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function App({ Component, pageProps }: AppProps) {
  const headerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('gsap').then(({ default: gsap }) => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.fromTo(
          headerRef.current,
          { y: -100, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        );

        gsap.to(headerRef.current, {
          backgroundColor: '#00032e',
          backdropFilter: 'blur(12px)',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top top',
            scrub: true,
          },
        });
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>UrbanAbode</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen">
        <header ref={headerRef} className="sticky top-0 z-50 bg-navy backdrop-blur-lg px-6 py-4 flex justify-between items-center">
          <h1 className="navbar-logo">UrbanAbode</h1>
          <nav className="nav-links">
            <Link href="/" className="text-gold hover:text-navy transition duration-300">Home</Link>
            <Link href="/properties" className="text-gold hover:text-navy transition duration-300">Properties</Link>
            <Link href="/add-property" className="text-gold hover:text-navy transition duration-300">Add Property</Link>
          </nav>
        </header>
        <main>
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}