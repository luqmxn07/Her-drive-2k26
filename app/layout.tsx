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
  openGraph: {
    title: "HERDRIVE — Move Freely. Ride Confidently.",
    description:
      "A women-focused mobility platform built around safety, comfort, trust, and opportunity.",
    url: "https://herdrive.com",
    siteName: "HERDRIVE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HERDRIVE — Move Freely. Ride Confidently.",
    description:
      "A women-focused mobility platform built around safety, comfort, trust, and opportunity.",
  },
};

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
      <body className="min-h-screen bg-[#F8F7F5] text-[#171717] font-sans selection:bg-[#7C3AED] selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
