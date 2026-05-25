import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.c3.com.sv",
          },
        ],
        destination: "https://c3.com.sv/:path*",
        permanent: true,
      },
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
};

export default nextConfig;
