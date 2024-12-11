import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undetectable AI - Text Summarizer",
  description:
    "Effortlessly summarize text with Undetectable AI’s advanced text summarization technology.",
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  keywords: [
    "AI",
    "text summarizer",
    "artificial intelligence",
    "machine learning",
    "AI tools",
    "text analysis",
  ],
  openGraph: {
    title: "Undetectable AI - Text Summarizer",
    description:
      "Effortlessly summarize text with Undetectable AI’s advanced text summarization technology.",
    url: "https://undetectable-ai.com",
    siteName: "Undetectable AI",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Undetectable AI Text Summarizer Open Graph Image",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Undetectable AI - Text Summarizer",
    description:
      "Effortlessly summarize text with Undetectable AI’s advanced text summarization technology.",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Undetectable AI Text Summarizer Open Graph Image",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
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
        <link rel="icon" href="/images/logo.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
