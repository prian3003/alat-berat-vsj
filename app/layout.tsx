import type { Metadata } from "next";
import { Geist, Geist_Mono, Kalam } from "next/font/google";
import "./globals.css";
import { ScrollingTitle } from "@/components/shared/scrolling-title";
import { StructuredData } from "@/components/shared/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["monospace"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vaniasugiartajaya.com'),
  title: "Sewa Alat Berat Bali | Rental Excavator, Bulldozer, Crane - VSJ",
  description: "Sewa alat berat di Bali dengan harga kompetitif. Menyediakan excavator, bulldozer, crane, loader, dump truck untuk proyek konstruksi di Denpasar, Badung, Gianyar, Tabanan, Buleleng, Klungkung, Bangli, Karangasem, Jembrana. Tarif per jam, operator berpengalaman, layanan 24/7.",
  keywords: [
    "sewa alat berat Bali",
    "rental alat berat Bali",
    "sewa excavator Bali",
    "sewa bulldozer Bali",
    "sewa crane Bali",
    "sewa alat berat Denpasar",
    "sewa alat berat Badung",
    "sewa alat berat Gianyar",
    "sewa alat berat Tabanan",
    "sewa alat berat Buleleng",
    "sewa alat berat Klungkung",
    "sewa alat berat Bangli",
    "sewa alat berat Karangasem",
    "sewa alat berat Jembrana",
    "rental excavator Denpasar",
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
    icon: '/A.svg',
    apple: '/A.svg',
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
        className={`${geistSans.variable} ${geistMono.variable} ${kalam.variable} antialiased`}
      >
        <ScrollingTitle />
        {children}
      </body>
    </html>
  );
}
