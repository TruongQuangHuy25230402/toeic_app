/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "img.clerk.com"
        },
        {
          // Add the pattern for utfs.io
          protocol: 'https',
          hostname: 'utfs.io',
          port: '',
          pathname: '/**',
        },
      ]
    }
  };
  
  export default nextConfig;