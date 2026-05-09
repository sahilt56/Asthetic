import type { Metadata } from "next";
import Script from 'next/script';
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aesthetic Finds ✨ | Curated Coquette Treasures & Cute Decor",
  description: "Discover a premium, hand-picked collection of coquette style treasures, cute room decor, and aesthetic finds. Shop the best curated lifestyle products.",
  keywords: ["coquette aesthetic", "cute decor", "aesthetic finds", "curated gallery", "premium lifestyle", "pinterest style", "kawaii fashion"],
  authors: [{ name: "Aesthetic Finds" }],
  openGraph: {
    title: "Aesthetic Finds ✨ | Curated Coquette Treasures",
    description: "Discover a premium, hand-picked collection of coquette style treasures and cute room decor.",
    url: "https://your-website-url.com", // Update this when deploying
    siteName: "Aesthetic Finds",
    images: [
      {
        url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop", // Soft aesthetic placeholder
        width: 1200,
        height: 630,
        alt: "Aesthetic Finds Gallery",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Finds ✨ | Curated Coquette Treasures",
    description: "Premium, hand-picked collection of coquette style treasures.",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1200&auto=format&fit=crop"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Aesthetic Finds ✨",
    "description": "A curated gallery of coquette aesthetic products, cute room decor, and premium finds.",
    "url": "https://your-website-url.com",
    "publisher": {
      "@type": "Organization",
      "name": "Aesthetic Finds"
    }
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {/* Google AdSense Placeholder - Replace ca-pub-XXXX with your actual publisher ID */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3881909791011190" 
          crossOrigin="anonymous"
        ></script>
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
