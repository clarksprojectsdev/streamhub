import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AgeGate from "@/components/AgeGate";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "StreamHub | Adult Affiliate Streaming",
    template: "%s | StreamHub",
  },
  description:
    "Browse categories and stream premium adult content. Placeholder streaming site.",
  keywords: ["streaming", "adult", "affiliate", "videos", "categories"],
  openGraph: {
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    "juicyads-site-verification": "498a1d4c40e3a2adeb184d6a8f228f71",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="juicyads-site-verification" content="498a1d4c40e3a2adeb184d6a8f228f71" />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Analytics />
        <AgeGate>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AgeGate>
      </body>
    </html>
  );
}
