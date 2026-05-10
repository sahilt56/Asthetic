import type { Metadata } from "next";
import Script from 'next/script';
import Link from 'next/link';
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
  title: "Aesthetic Finds ✨ | Curated Coquette Treasures (Official Site of Content Hub)",
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Google AdSense Dynamic Injection */}
        <Script id="adsense-init" strategy="afterInteractive">
          {`
            (function() {
              var script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3881909791011190';
              script.async = true;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            })();
          `}
        </Script>
        
        {/* JSON-LD Search Engine Structured Data */}
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
        
        {/* Decorative Animated Background Orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 select-none">
          {/* Richer Glow Top Right */}
          <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#FFE4E6] blur-[120px] opacity-85 animate-float-1" />
          
          {/* Stronger Lavender Left Center */}
          <div className="absolute top-[25%] left-[-15%] w-[50vw] h-[50vw] rounded-full bg-[#EDE9FE] blur-[140px] opacity-75 animate-float-2" />
          
          {/* Richer Peach Bottom Right */}
          <div className="absolute bottom-[-15%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-[#FFEDD5] blur-[120px] opacity-90 animate-float-3" />
          
          {/* Added soft accent mid-center */}
          <div className="absolute top-[50%] left-[30%] w-[30vw] h-[30vw] rounded-full bg-[#FAE8FF] blur-[100px] opacity-60 animate-float-1" />

          {/* Subtle Texture Overlay */}
          <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-multiply" />
        </div>

        {/* Floating Mobile Action Button (Moved Outside Header to bypass containment) */}
        <Link 
          href="https://in.pinterest.com/sahil620476" 
          target="_blank"
          rel="noopener noreferrer"
          className="md:hidden fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#E60023] hover:bg-[#bd081c] text-white rounded-full flex items-center justify-center shadow-[0_6px_25px_rgba(230,0,35,0.5)] transition-all active:scale-90 border-2 border-white"
          aria-label="Visit Pinterest"
        >
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.63 11.16-.1-.95-.19-2.41.04-3.45.21-.93 1.35-5.74 1.35-5.74s-.34-.69-.34-1.71c0-1.6 1.05-2.8 2.09-2.8.98 0 1.46.74 1.46 1.63 0 .99-.63 2.47-.96 3.84-.27 1.15.58 2.09 1.71 2.09 2.05 0 3.63-2.17 3.63-5.29 0-2.76-1.99-4.7-4.83-4.7-3.29 0-5.22 2.47-5.22 5.02 0 .99.38 2.06.86 2.64.09.11.11.21.08.33l-.32 1.3c-.05.21-.17.26-.39.16-1.46-.68-2.37-2.82-2.37-4.54 0-3.69 2.69-7.09 7.74-7.09 4.06 0 7.22 2.89 7.22 6.77 0 4.04-2.54 7.29-6.08 7.29-1.19 0-2.31-.62-2.69-1.35l-.73 2.79c-.26 1.02-.98 2.3-1.46 3.08C10.15 23.83 11.06 24 12 24c6.63 0 12-5.37 12-12S18.63 0 12 0z"/>
          </svg>
        </Link>

        {children}
      </body>
    </html>
  );
}
