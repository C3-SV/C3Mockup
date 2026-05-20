import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/lib/structured-data";
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
  title: {
    default: "C3 | Competitive Coding Club — Compite. Crea. Conecta.",
    template: "%s | C3",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.fullName }],
  creator: siteConfig.fullName,
  publisher: siteConfig.fullName,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.domain,
    siteName: siteConfig.displayName,
    title: "C3 | Competitive Coding Club — Compite. Crea. Conecta.",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        alt: siteConfig.displayName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "C3 | Competitive Coding Club — Compite. Crea. Conecta.",
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
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
  const structuredData = [getOrganizationJsonLd(), getWebsiteJsonLd()];

  return (
    <html
      lang={siteConfig.language}
      className={`${montserrat.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
