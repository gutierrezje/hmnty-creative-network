import type { Metadata } from "next";
import { Anton, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Statements are Anton. Anton ships a single weight (400), the display face.
const display = Anton({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

// Sentences are Inter.
const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Facts are JetBrains Mono.
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HMNTY — the reel is the résumé",
  description:
    "San Diego creative work, judged on the work. A wall of local below-the-line and short-form talent, from HMNTY Studios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
