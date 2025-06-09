import { Jost, Nunito } from "next/font/google";
import "./globals.css";

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
      </body>
    </html>
  );
}
