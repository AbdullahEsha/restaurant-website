/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images: {
    domains: [
      "res.cloudinary.com",
      "cdn-icons-png.flaticon.com",
      "www.flaticon.com",
    ], // <== Domain name
  },
};

module.exports = nextConfig;
