import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, EB_Garamond, Jost } from "next/font/google";

import { ContactProvider } from "@/components/contact/contact-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
      className={`${cormorant.variable} ${garamond.variable} ${jost.variable} antialiased`}
    >
      <body>
        <SmoothScroll>
          <ContactProvider>{children}</ContactProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
