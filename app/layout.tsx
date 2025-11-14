import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ScrollingTitle } from "@/components/shared/scrolling-title";
import { StructuredData } from "@/components/shared/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sewa Alat Berat Bali | Rental Excavator, Bulldozer, Crane - VSJ",
  description: "Sewa alat berat di Bali dengan harga kompetitif. Menyediakan excavator, bulldozer, crane, loader, dump truck untuk proyek konstruksi di Denpasar, Gianyar, Badung, Tabanan. Tarif per jam, operator berpengalaman, layanan 24/7.",
  keywords: [
    "sewa alat berat Bali",
    "rental alat berat Bali",
    "sewa excavator Bali",
    "sewa bulldozer Bali",
    "sewa crane Bali",
    "rental excavator Denpasar",
    "sewa alat berat Denpasar",
    "rental heavy equipment Bali",
    "sewa loader Bali",
    "sewa dump truck Bali",
    "jasa alat berat Bali",
    "rental construction equipment Bali",
  ],
  authors: [{ name: "Vania Sugiarta Jaya" }],
  creator: "VSJ - Vania Sugiarta Jaya",
  publisher: "VSJ",
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
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://vaniasugiartajaya.com',
    siteName: 'VSJ - Sewa Alat Berat Bali',
    title: 'Sewa Alat Berat Bali | Rental Excavator, Bulldozer, Crane',
    description: 'Sewa alat berat di Bali dengan harga kompetitif. Excavator, bulldozer, crane, loader tersedia. Operator berpengalaman, tarif per jam, layanan 24/7.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'VSJ Sewa Alat Berat Bali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sewa Alat Berat Bali | Rental Excavator, Bulldozer, Crane',
    description: 'Sewa alat berat di Bali dengan harga kompetitif. Excavator, bulldozer, crane, loader tersedia.',
    images: ['/logo.png'],
  },
  alternates: {
    canonical: 'https://vaniasugiartajaya.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ScrollingTitle />
        {children}
      </body>
    </html>
  );
}
