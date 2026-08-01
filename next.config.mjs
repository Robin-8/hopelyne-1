/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Disable static generation — this app relies on database queries and session state */
  output: undefined,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
