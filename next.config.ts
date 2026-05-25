import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dvo9sykwq/image/upload/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/copa",
        destination: "https://copa.c3.com.sv",
        permanent: true,
      },
      {
        source: "/copa/:path*",
        destination: "https://copa.c3.com.sv/:path*",
        permanent: true,
      },
      {
        source: "/hackathon",
        destination: "https://hackathon.c3.com.sv",
        permanent: true,
      },
      {
        source: "/hackathon/:path*",
        destination: "https://hackathon.c3.com.sv/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    const noIndexHeaders = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive",
      },
    ];

    return [
      {
        source: "/admin/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/internal/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/private/:path*",
        headers: noIndexHeaders,
      },
      {
        source: "/api/:path*",
        headers: noIndexHeaders,
      },
    ];
  },
};

export default nextConfig;
