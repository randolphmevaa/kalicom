import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
// import "leaflet/dist/leaflet.css";

// Import Google Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Import Custom Header Font
const fontHeader = localFont({
  src: [
    {
      path: "./fonts/font2.woff2",
      // weight: "700", // Uncomment/adjust if your font has weight variants
      style: "normal",
    },
  ],
  variable: "--font-header",
  display: "swap",
});

// Import Custom Body Font
const fontBody = localFont({
  src: [
    {
      path: "./fonts/font1.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});

// Global metadata settings
export const metadata: Metadata = {
  title: "Kalicom | CRM ",
  description:
    "Kalicom est un CRM",
  openGraph: {
    title: "Kalicom | CRM ",
    description:
      "Découvrez nos solutions.",
    url: "https://www.your-domain.com", // Replace with your production domain
    siteName: "Kalicom",
    images: [
      {
        url: "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
        width: 800,
        height: 600,
        alt: "Logo Kalicom",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalicom | CRM ",
    description:
      "Découvrez nos solutions.",
    images: [
      "https://cdn.prod.website-files.com/6619ad18a61a234e323d241a/661ecd30546087aec351f605_Design%20sans%20titre%20(8).png",
    ],
  },
  // Optionally, add other metadata fields like authors, publisher, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fontHeader.variable} ${fontBody.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
