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
  env: {
    GOOGLE_MAP_API: process.env.GOOGLE_MAP_API,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    ENVIRONMENT: process.env.ENVIRONMENT,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
  },
};

module.exports = nextConfig;
