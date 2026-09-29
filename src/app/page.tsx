import { Approach } from "@/components/sections/approach";
import { Closing } from "@/components/sections/closing";
import { Hero } from "@/components/sections/hero";
import { Interlude } from "@/components/sections/interlude";
import { Principles } from "@/components/sections/principles";
import { Research } from "@/components/sections/research";
import { Work } from "@/components/sections/work";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Approach />
        <Principles />
        <Interlude />
        <Work />
        <Research />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
