import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint in production builds
  },
  typescript: {
    ignoreBuildErrors: isProd, // Skip TypeScript errors in production builds
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blr1.digitaloceanspaces.com",
      },
    ],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve("src"),
      "@components": path.resolve("src/components"),
      "@lib": path.resolve("src/lib"),
    };

    // Suppress source map warnings for vendor chunks
    config.ignoreWarnings = [
      { module: /node_modules\/react-toastify/ },
    ];

    return config;
  },
};

export default nextConfig;



// import type { NextConfig } from 'next';

// const isProd = process.env.NODE_ENV === 'production';

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: isProd, // Skip ESLint in production builds
//   },
//   typescript: {
//     ignoreBuildErrors: isProd, // Skip TypeScript errors in production builds
//   },
//   images: {
//     domains: ['blr1.digitaloceanspaces.com'],
//   },
// };

// export default nextConfig;

// import path from 'path';

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   webpack(config) {
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       '@': path.resolve('src'),
//       '@components': path.resolve('src/components'),
//       '@lib': path.resolve('src/lib'),
//     };
//     return config;
//   },

//   async headers() {
//     return [
//       {
//         source: '/(.*)', // Apply to all routes
//         headers: [
//           {
//             key: 'Content-Security-Policy',
//             value:
//               "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
//           },
//           { key: 'X-Frame-Options', value: 'DENY' },
//           { key: 'X-XSS-Protection', value: '1; mode=block' },
//           {
//             key: 'Strict-Transport-Security',
//             value: 'max-age=63072000; includeSubDomains; preload',
//           },
//           {
//             key: 'Referrer-Policy',
//             value: 'strict-origin-when-cross-origin',
//           },
//           {
//             key: 'Permissions-Policy',
//             value: 'camera=(), microphone=(), geolocation=()',
//           },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;
