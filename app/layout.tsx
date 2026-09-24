import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://herdrive.com"),
  title: "HERDRIVE — Move Freely. Ride Confidently.",
  description:
    "HERDRIVE is a women-focused mobility platform built around safety, comfort, trust, and flexible earning opportunities. Join the waitlist today.",
  keywords: [
    "women mobility",
    "safe ride hailing",
    "women drivers",
    "HERDRIVE",
    "trusted cabs",
    "women safety",
    "mobility platform",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "HERDRIVE — Move Freely. Ride Confidently.",
    description:
      "A women-focused mobility platform built around safety, comfort, trust, and opportunity.",
    url: "https://herdrive.com",
    siteName: "HERDRIVE",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/Gemini_Generated_Image_cwrx42cwrx42cwrx.png",
        width: 1200,
        height: 1200,
        alt: "HERDRIVE — Move Freely. Ride Confidently.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HERDRIVE — Move Freely. Ride Confidently.",
    description:
      "A women-focused mobility platform built around safety, comfort, trust, and opportunity.",
    images: ["/brand/Gemini_Generated_Image_cwrx42cwrx42cwrx.png"],
  },
};

import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} scroll-smooth antialiased`}
    >
      <body className="min-h-screen bg-[#FAF9F7] text-[#242124] dark:bg-[#211827] dark:text-[#FAF9F7] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
