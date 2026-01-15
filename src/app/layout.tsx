import type { Metadata } from "next";
import { Pixelify_Sans, Inter } from "next/font/google";
import "./globals.css";

const pixelifySans = Pixelify_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HobbyScope - Learn Any Hobby Without Overwhelm",
  description: "Get a focused 5-8 technique learning plan for any hobby. No information overload, just practical skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground min-h-screen font-body">
        {children}
      </body>
    </html>
  );
}
