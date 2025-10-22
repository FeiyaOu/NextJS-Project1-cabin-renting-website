/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["xlhpbkvylcshnauizakg.supabase.co"],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xlhpbkvylcshnauizakg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/public/**',
      },
    ],
    
  },
  // output: 'export',
};

export default nextConfig;
