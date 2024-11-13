/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avataaars.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",  // Add Firebase Storage
        port: "",
        pathname: "/**", // Allow all paths
      },
    ],
    dangerouslyAllowSVG: true, // Enable support for SVG images
  }
};

export default nextConfig;
