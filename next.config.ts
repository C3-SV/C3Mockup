import type { NextConfig } from "next";

const isFestivalPublic = process.env.SHOW_FESTIVAL === "true";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    const redirects = [
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
    ];

    if (isFestivalPublic) {
      redirects.push(
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
      );
    }

    return redirects;
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
