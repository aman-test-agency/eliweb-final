import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://eliweb.in/#organization",
      name: "ELIWEB",
      url: "https://eliweb.in",
      logo: "https://eliweb.in/favicon1.png",
      email: "eliweb.in@gmail.com",
      telephone: "+917973851691",
      foundingDate: "2021",
      areaServed: ["IN", "US", "UK", "AE", "AU"],
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "5",
        reviewCount: "30",
      },
      sameAs: [
        "https://instagram.com/eliwebin",
        "https://linkedin.com/company/eliwebin",
        "https://twitter.com/eliwebin",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://eliweb.in/#website",
      url: "https://eliweb.in",
      name: "ELIWEB",
      publisher: { "@id": "https://eliweb.in/#organization" },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://eliweb.in'),
  
  title: {
    default: 'ELIWEB — Web Development & Digital Marketing Agency India',
    template: '%s | ELIWEB'
  },
  
  description: 'ELIWEB is your end-to-end digital partner — a leading web development and digital marketing agency in India. We build websites, edit videos, and grow brands.',
  
  keywords: [
    'web development India',
    'digital marketing agency India', 
    'Next.js development',
    'SEO agency India',
    'video editing agency',
    'WordPress development',
    'Shopify development',
    'EliWeb'
  ],

  authors: [{ name: 'ELIWEB', url: 'https://eliweb.in' }],
  creator: 'ELIWEB',
  publisher: 'ELIWEB',

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://eliweb.in',
    siteName: 'ELIWEB',
    title: 'ELIWEB — Web Development & Digital Marketing Agency India',
    description: 'We build websites, edit videos, and grow brands.',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'ELIWEB — Digital Agency India'
    }]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ELIWEB — Web Development & Digital Marketing',
    description: 'We build websites, edit videos, and grow brands.',
    creator: '@eliwebin',
    images: ['/og-image.jpg']
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    }
  },

  icons: {
    icon: "/img.png",
    shortcut: "/favicon1.png",
    apple: "/favicon1.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/berlin-sans-fb-demi" rel="stylesheet" />
        <link
          href="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/css/flag-icons.min.css"
          rel="stylesheet"
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}