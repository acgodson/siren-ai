/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/home",
        destination: "https://siren-ai.vercel.app/",
      },
    ];
  },
};

export default nextConfig;
