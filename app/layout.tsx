import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { organizationJsonLd } from "@/lib/structured-data";
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
    template: "%s",
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
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
  return (
    <html
      lang={siteConfig.language}
      className={`${montserrat.variable} ${poppins.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Analytics />
      </body>
    </html>
  );
}
