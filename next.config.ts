import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/copa",
        destination: "https://copa.c3.com.sv",
        permanent: false,
      },
      {
        source: "/copa/:path*",
        destination: "https://copa.c3.com.sv/:path*",
        permanent: false,
      },
      {
        source: "/hackathon",
        destination: "https://hackathon.c3.com.sv",
        permanent: false,
      },
      {
        source: "/hackathon/:path*",
        destination: "https://hackathon.c3.com.sv/:path*",
        permanent: false,
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
