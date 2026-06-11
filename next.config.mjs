/** @type {import('next').NextConfig} */
const nextConfig = {
  // Produce a fully static site in `out/` (no server runtime required for Vercel).
  output: 'export',
  reactStrictMode: true,
  // Static export cannot use the default (server-based) image optimizer.
  images: {
    unoptimized: true,
  },
  // Emit `path/index.html` so the static host serves clean URLs without rewrites.
  trailingSlash: true,
};

export default nextConfig;
