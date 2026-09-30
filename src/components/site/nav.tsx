"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState, type MouseEvent } from "react";

import { CamelliaMark, Wordmark } from "@/components/brand/camellia-mark";
import { useContact } from "@/components/contact/contact-provider";
import { useLenis } from "@/components/providers/smooth-scroll";
import { CONTACT_EMAIL } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { AnchorLink } from "./anchor-link";
import { SLOW } from "./motion-primitives";
import { PillButton } from "./pill";

export const NAV_LINKS = [
  { href: "/#approach", label: "Approach" },
  { href: "/#principles", label: "Principles" },
  { href: "/#products", label: "Products" },
  { href: "/#journal", label: "Journal" },
] as const;

type Surface = "ink" | "bone";

/** Reads the `data-surface` of whichever section is currently beneath the bar. */
function surfaceAt(y: number): Surface {
  let found: Surface = "bone";
  for (const el of document.querySelectorAll<HTMLElement>("[data-surface]")) {
    const r = el.getBoundingClientRect();
    if (r.top <= y && r.bottom > y) found = el.dataset.surface === "ink" ? "ink" : "bone";
  }
  return found;
}

export function Nav() {
  const { openContact } = useContact();
  const lenisRef = useLenis();
  const { scrollY } = useScroll();
  const [surface, setSurface] = useState<Surface>("bone");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setSurface(surfaceAt(36)));
    const onResize = () => setSurface(surfaceAt(36));
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    setSurface(surfaceAt(36));
    setScrolled(y > 24);
    if (y < 640 || menuOpen) setHidden(false);
    else if (delta > 4) setHidden(true);
    else if (delta < -4) setHidden(false);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const lenis = lenisRef.current;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenisRef]);

  const onInk = menuOpen || surface === "ink";

  function goFromMenu(e: MouseEvent<HTMLAnchorElement>, href: string) {
    const hash = href.slice(href.indexOf("#"));
    const target = window.location.pathname === "/" ? document.querySelector<HTMLElement>(hash) : null;
    setMenuOpen(false);
    if (!target) return;
    e.preventDefault();
    requestAnimationFrame(() => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.start();
        lenis.scrollTo(target, { offset: -24, duration: 1.6 });
      } else {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-colors duration-500",
          onInk ? "text-chalk" : "text-soot",
        )}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: SLOW, delay: hidden ? 0 : 0.4 }}
      >
        <div
          aria-hidden
          className={cn(
            "absolute inset-0 border-b transition-[background-color,border-color,opacity] duration-500",
            onInk ? "border-chalk/14 bg-ink" : "border-plaster bg-bone",
            scrolled && !menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <nav className="frame relative flex h-[var(--nav-h)] items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
          <ul className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <AnchorLink
                  href={link.href}
                  className={cn(
                    "type-ui group relative py-2 transition-colors duration-500",
                    onInk ? "text-chalk/62 hover:text-chalk" : "text-graphite hover:text-soot",
                  )}
                >
                  {link.label}
                </AnchorLink>
              </li>
            ))}
          </ul>

          <AnchorLink
            href="/#top"
            className="group flex items-center gap-3 md:justify-self-center"
            aria-label="TOKEN/401 — back to the beginning"
          >
            <CamelliaMark className="h-[22px] w-auto" />
            <Wordmark className="h-[12px] w-auto" />
          </AnchorLink>

          <div className="flex items-center justify-self-end">
            <button
              type="button"
              onClick={() => openContact()}
              className="type-ui group relative hidden py-2 md:inline-block"
            >
              Write to us
              <span className="absolute inset-x-0 bottom-1 h-px origin-left bg-current opacity-50" />
            </button>
            <button
              type="button"
              className="type-label -mr-2 px-2 py-3 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="site-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[var(--nav-h)] text-chalk md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: SLOW }}
          >
            <ul className="frame mt-12 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  className="border-b border-chalk/14"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, delay: 0.2 + i * 0.07, ease: SLOW }}
                >
                  <AnchorLink
                    href={link.href}
                    onClick={(e) => goFromMenu(e, link.href)}
                    className="block py-5 font-display text-[2.75rem] leading-none font-light"
                  >
                    {link.label}
                  </AnchorLink>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="frame mt-auto flex flex-col items-start gap-6 pb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 1.2, ease: SLOW }}
            >
              <PillButton
                surface="ink"
                onClick={() => {
                  setMenuOpen(false);
                  openContact();
                }}
              >
                Write to us
              </PillButton>
              <a href={`mailto:${CONTACT_EMAIL}`} className="type-ui text-chalk/62">
                {CONTACT_EMAIL}
              </a>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
