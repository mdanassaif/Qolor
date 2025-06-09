import { Jost, Nunito } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata = {
  title: "Qolor Palettes",
  description: "Handcurated color palettes for developers",
  metadataBase: new URL('https://qolor.vercel.app'),
  openGraph: {
    title: 'Qolor Palettes',
    description: 'Handcurated color palettes for developers',
    url: 'https://qolor.vercel.app',
    siteName: 'Qolor',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Qolor - Handcurated color palettes',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qolor Palettes',
    description: 'Handcurated color palettes for developers',
    images: ['/og.png'],
    creator: '@mdanassaif',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${jost.variable} ${nunito.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
