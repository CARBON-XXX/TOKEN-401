import { Closing } from "@/components/sections/closing";
import { Cover } from "@/components/sections/cover";
import { Essay } from "@/components/sections/essay";
import { JournalIndex } from "@/components/sections/journal-index";
import { Principles } from "@/components/sections/principles";
import { Products } from "@/components/sections/products";
import { Statement } from "@/components/sections/statement";
import { Footer } from "@/components/site/footer";
import { Nav } from "@/components/site/nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Cover />
        <Statement />
        <Essay />
        <Principles />
        <Products />
        <JournalIndex />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
