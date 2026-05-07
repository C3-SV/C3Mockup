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
        source: "/festival",
        destination: "https://festival.c3.com.sv",
        permanent: false,
      },
      {
        source: "/festival/:path*",
        destination: "https://festival.c3.com.sv/:path*",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
