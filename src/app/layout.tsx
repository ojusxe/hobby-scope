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

const siteUrl = "https://hobby-scope.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "HobbyScope",
    template: "%s | HobbyScope",
  },
  description:
    "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  keywords: [
    "hobby learning",
    "learning plan",
    "hobby tracker",
    "personalized learning",
    "YouTube tutorials",
    "beginner guide",
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "HobbyScope",
    title: "HobbyScope",
    description:
      "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes.",
    images: [
      {
        url: `/opengraph.webp`,
        width: 1200,
        height: 630,
        alt: "HobbyScope",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HobbyScope",
    description:
      "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes.",
    images: ["/opengraph.webp"],
  },
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
