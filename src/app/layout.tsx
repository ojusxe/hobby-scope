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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hobbyscope.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "HobbyScope - Master Your Hobbies Without Overwhelm",
    template: "%s | HobbyScope",
  },
  description:
    "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes. Learn smarter with AI-curated resources.",
  keywords: [
    "hobby learning",
    "skill development",
    "learning plan",
    "tutorial finder",
    "hobby tracker",
    "personalized learning",
    "YouTube tutorials",
    "beginner guide",
  ],
  authors: [{ name: "HobbyScope" }],
  creator: "HobbyScope",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "HobbyScope",
    title: "HobbyScope - Master Your Hobbies Without Overwhelm",
    description:
      "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes.",
    images: [
      {
        url: "/opengraph.webp",
        width: 1200,
        height: 630,
        alt: "HobbyScope - Master Your Hobbies Without Overwhelm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HobbyScope - Master Your Hobbies Without Overwhelm",
    description:
      "Get a focused 5-8 technique plan tailored to your skill level. No more endless YouTube rabbit holes.",
    images: ["/opengraph.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/default.png",
    apple: "/default.png",
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
