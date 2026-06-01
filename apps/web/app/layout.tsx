import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SeoJsonLd from "@/components/SeoJsonLd";
import { getSiteNavigationJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  applicationName: siteConfig.displayName,
  title: siteConfig.homepageTitle,
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.displayName }],
  creator: siteConfig.displayName,
  publisher: siteConfig.displayName,
  category: "technology",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  alternates: {
    canonical: siteConfig.domain,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.domain,
    siteName: siteConfig.displayName,
    title: siteConfig.homepageTitle,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.domain}${siteConfig.defaultOgImage}`,
        width: 3508,
        height: 2481,
        alt: siteConfig.homepageTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.homepageTitle,
    description: siteConfig.description,
    images: [`${siteConfig.domain}${siteConfig.defaultOgImage}`],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.language}
      className={`${montserrat.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SeoJsonLd data={organizationJsonLd} />
        <SeoJsonLd data={websiteJsonLd} />
        <SeoJsonLd data={getSiteNavigationJsonLd()} />
        <Analytics />
      </body>
    </html>
  );
}
