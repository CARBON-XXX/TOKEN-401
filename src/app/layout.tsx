import type { Metadata, Viewport } from "next";
import { Jost, Newsreader } from "next/font/google";

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

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TOKEN/401 — There is a pause before every good answer",
    template: "%s — TOKEN/401",
  },
  description:
    "TOKEN/401 is an AI research company. We build systems that take their time, say what they don’t know, and ask before they act.",
  openGraph: {
    title: "TOKEN/401",
    description: "There is a pause before every good answer.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0e0d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${jost.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          <ContactProvider>{children}</ContactProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
