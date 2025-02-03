import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { Providers } from "@/providers/providers";

const inter = Inter({ subsets: ["latin"] });

// OpenGraph image configuration
const openGraphImage = {
  images: [
    {
      url: "https://siren.network/bus.svg",
      width: 1200,
      height: 630,
      alt: "Siren - Decentralized Data Infrastructure",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sirenwatch.xyz"),
  title: {
    default: "Siren | Decentralized Data Infrastructure",
    template: "%s | Siren",
  },
  description:
    "Building the largest decentralized sensor network on BnB Greenfield. Contribute environmental data, earn rewards, and drive community-powered insights.",
  keywords: [
    "decentralized data",
    "IoT platform",
    "environmental monitoring",
    "noise tracking",
    "BNB Greenfield",
    "blockchain data",
    "community data",
    "zero knowledge proofs",
    "data privacy",
    "SIRN token",
  ],
  authors: [{ name: "Siren Network" }],
  creator: "Siren Network",
  publisher: "Siren Network",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Siren Network",
    title: "Siren | Data for the People, by the People",
    description:
      "Building the largest decentralized sensor network on BnB Greenfield. Contribute environmental data, earn rewards, and drive community-powered insights.",
    url: "https://sirenwatch.xyz",
    images: openGraphImage.images,
  },
  twitter: {
    card: "summary_large_image",
    title: "Siren | Decentralized Data Infrastructure",
    description:
      "Building the largest decentralized sensor network on BNB Greenfield. Contribute environmental data, earn rewards, and drive community-powered insights.",
    creator: "@Siren_watch",
    images: ["https://sirenwatch.xyz/bus.svg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  applicationName: "Siren",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers> {children} </Providers>
      </body>
    </html>
  );
}
