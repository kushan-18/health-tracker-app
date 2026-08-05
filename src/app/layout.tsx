import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@/components/analytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-RNKFGEGK7C";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vitalxai.netlify.app"),
  title: {
    default: "VitalX AI — AI Health Operating System",
    template: "%s | VitalX AI",
  },
  description: "Your AI-powered health companion for fitness, nutrition, and wellness tracking. Personalized workout plans, meal tracking, and health insights.",
  keywords: ["health", "fitness", "AI", "workout", "nutrition", "wellness", "health tracker", "meal planner", "workout logger"],
  authors: [{ name: "VitalX AI" }],
  creator: "VitalX AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vitalxai.netlify.app",
    siteName: "VitalX AI",
    title: "VitalX AI — AI Health Operating System",
    description: "Your AI-powered health companion for fitness, nutrition, and wellness tracking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VitalX AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VitalX AI — AI Health Operating System",
    description: "Your AI-powered health companion for fitness, nutrition, and wellness tracking.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vitalxai.netlify.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VitalX AI",
              applicationCategory: "HealthApplication",
              operatingSystem: "Web",
              description: "AI-powered health companion for fitness, nutrition, and wellness tracking.",
              url: "https://vitalxai.netlify.app",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Analytics />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
