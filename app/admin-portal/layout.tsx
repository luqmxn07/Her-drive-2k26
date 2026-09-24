import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HERDRIVE Admin Console",
  description: "Secure Internal Administrative Management Portal",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function AdminPortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0F0524] text-[#FFFAFC] antialiased selection:bg-[#F472B6] selection:text-white font-sans flex flex-col">
      {children}
    </div>
  );
}
