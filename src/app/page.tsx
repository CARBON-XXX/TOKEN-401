import { Closing } from "@/components/sections/closing";
import { Continuity } from "@/components/sections/continuity";
import { Escalate } from "@/components/sections/escalate";
import { Essay } from "@/components/sections/essay";
import { Hero } from "@/components/sections/hero";
import { JournalIndex } from "@/components/sections/journal-index";
import { Maps } from "@/components/sections/maps";
import { Principles } from "@/components/sections/principles";
import { Reflex } from "@/components/sections/reflex";
import { Safeguards } from "@/components/sections/safeguards";
import { Statement } from "@/components/sections/statement";
import { Verify } from "@/components/sections/verify";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reflex />
        <Escalate />
        <Maps />
        <Safeguards />
        <Continuity />
        <Verify />
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
