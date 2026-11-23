/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optional separate build folder (e.g. NEXT_DIST_DIR=.next-qa for QA builds while `next dev` uses .next).
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Brand / 3D assets keep stable names so client originals can replace placeholders in place;
  // cache for a day and revalidate in the background so replacements show up quickly.
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }];
    return ["/brand/:path*", "/models/:path*", "/textures/:path*", "/images/:path*"].map((source) => ({ source, headers: cache }));
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
