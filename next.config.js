/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  allowedDevOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.0.166:3000",
    
  ],
};

module.exports = nextConfig;
