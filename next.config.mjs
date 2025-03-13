/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1jn39u3umq5qg.cloudfront.net",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb'
    }
  }
};

export default nextConfig;
