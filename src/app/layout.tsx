import type { Metadata, Viewport } from "next";
import { Geist_Mono, Instrument_Sans, Newsreader } from "next/font/google";

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

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TOKEN/401 — Autonomous cyber defense that asks before it acts",
    template: "%s — TOKEN/401",
  },
  description:
    "TOKEN/401 is an AI research company building autonomous cyber defense: Tacit, a millisecond reflex layer, and a team of agents that investigates, contains, repairs and verifies every incident.",
  openGraph: {
    title: "TOKEN/401",
    description: "Autonomous cyber defense that asks before it acts.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#eee9df",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${instrument.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          <ContactProvider>{children}</ContactProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
