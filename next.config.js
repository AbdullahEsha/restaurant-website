/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  images : {
    domains : ['res.cloudinary.com'] // <== Domain name
  }
}

module.exports = nextConfig
