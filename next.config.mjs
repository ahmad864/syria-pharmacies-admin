/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: false },
  images: {
    // Mock advertisement images use picsum.photos as placeholder art.
    // `unoptimized: true` is also set on those <Image> usages, but this
    // is kept too as the standard, explicit way to allow the host.
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
};

export default nextConfig;
