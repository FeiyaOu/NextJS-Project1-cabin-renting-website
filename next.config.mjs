/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['xlhpbkvylcshnauizakg.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xlhpbkvylcshnauizakg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/public/**',
      },
    ],
  },
  // Allow builds to succeed on Vercel while we iteratively fix lint/format issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  // output: 'export',
};

export default nextConfig;
