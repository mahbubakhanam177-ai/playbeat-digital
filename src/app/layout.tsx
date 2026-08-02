import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://playbeat.digital"),
  title: {
    default: "Playbeat Digital — Premium Digital Marketplace",
    template: "%s | Playbeat Digital",
  },
  description:
    "Software, AI Tools, Streaming Services, Gift Cards, Games & Digital Bundles with Instant Delivery. The premium global digital marketplace.",
  keywords: [
    "digital marketplace",
    "software licenses",
    "AI tools",
    "streaming services",
    "gift cards",
    "games",
    "digital bundles",
    "Playbeat Digital",
  ],
  authors: [{ name: "Playbeat Digital" }],
  creator: "Playbeat Digital",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Playbeat Digital — Premium Digital Marketplace",
    description:
      "Software, AI Tools, Streaming Services, Gift Cards, Games & Digital Bundles with Instant Delivery.",
    url: "https://playbeat.digital",
    siteName: "Playbeat Digital",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playbeat Digital — Premium Digital Marketplace",
    description:
      "Software, AI Tools, Streaming Services, Gift Cards, Games & Digital Bundles with Instant Delivery.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
