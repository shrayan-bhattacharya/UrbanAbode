import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      { // For Supabase storage, replace with your actual project ref if different
        protocol: 'https',
        hostname: 'rshqnpabbssccnvxglqo.supabase.co', // Extracted from your NEXT_PUBLIC_SUPABASE_URL
        port: '',
        pathname: '/storage/v1/object/public/**', // Common path for public Supabase storage
      },
      // If you use other image providers, add them here
    ],
  },
};

export default nextConfig;
