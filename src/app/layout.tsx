import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Newsreader } from "next/font/google";

import { ContactProvider } from "@/components/contact/contact-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TOKEN/401 — Intelligence, unfolding with care",
  description:
    "TOKEN/401 is an AI research company building systems that reason one token at a time — and know when to pause and ask.",
  openGraph: {
    title: "TOKEN/401 — Intelligence, unfolding with care",
    description:
      "An AI research company building systems designed to earn trust, never to assume it.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3f1ec",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${geist.variable} ${plexMono.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          <ContactProvider>{children}</ContactProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
