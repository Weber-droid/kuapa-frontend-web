import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/ui/header";
import { BottomNav } from "@/components/ui/bottom-nav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Kuapa - AI Crop Disease Detection",
    template: "%s | Kuapa",
  },
  description:
    "Detect crop diseases instantly using AI. Kuapa helps farmers protect their harvests with smart disease identification and treatment recommendations.",
  keywords: [
    "crop disease",
    "agriculture",
    "farming",
    "AI",
    "Ghana",
    "cocoa",
    "cassava",
    "maize",
    "plant health",
  ],
  authors: [{ name: "Kuapa Team" }],
  creator: "Kuapa",
  publisher: "Kuapa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://kuapa.app",
    siteName: "Kuapa",
    title: "Kuapa - AI Crop Disease Detection",
    description:
      "Detect crop diseases instantly using AI. Kuapa helps farmers protect their harvests.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kuapa - AI Crop Disease Detection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kuapa - AI Crop Disease Detection",
    description:
      "Detect crop diseases instantly using AI. Kuapa helps farmers protect their harvests.",
    images: ["/images/og-image.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kuapa",
  },
  applicationName: "Kuapa",
};

export const viewport: Viewport = {
  themeColor: "#22c55e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/icons/icon-192x192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
          <Header showNotifications />
          <main className="pb-20">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
