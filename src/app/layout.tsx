import type { Metadata } from "next";
import { Pixelify_Sans, Inter } from "next/font/google";
import "./globals.css";
import StyledComponentsRegistry from "@/lib/registry";

const pixelifySans = Pixelify_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HobbyScope",
  description: "Horoscope for your hobbies, get better at what you enjoy doing"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground min-h-screen font-body">
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
