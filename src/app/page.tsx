import { Closing } from "@/components/sections/closing";
import { Essay } from "@/components/sections/essay";
import { Hero } from "@/components/sections/hero";
import { JournalIndex } from "@/components/sections/journal-index";
import { Maps } from "@/components/sections/maps";
import { Principles } from "@/components/sections/principles";
import { Product } from "@/components/sections/product";
import { Safeguards } from "@/components/sections/safeguards";
import { Statement } from "@/components/sections/statement";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Product />
        <Safeguards />
        <Maps />
        <Statement />
        <Principles />
        <JournalIndex />
        <Essay />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
