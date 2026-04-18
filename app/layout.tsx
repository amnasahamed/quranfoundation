import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HifzFlow — Every ayah, closer to heart",
  description: "A psychologically optimized Quran memorization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" translate="no">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Scheherazade+New:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="google" content="notranslate" />
      </head>
      <body className={`${inter.className} bg-bg text-text-primary antialiased`}>{children}</body>
    </html>
  );
}
