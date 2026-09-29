"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";

import { CamelliaMark, Wordmark } from "@/components/brand/camellia-mark";
import { useContact } from "@/components/contact/contact-provider";
import { useLenis } from "@/components/providers/smooth-scroll";
import { cn } from "@/lib/utils";

import { QUILL } from "./motion-primitives";

export const NAV_LINKS = [
  { href: "#approach", label: "Approach" },
  { href: "#principles", label: "Principles" },
  { href: "#work", label: "Work" },
  { href: "#research", label: "Research" },
] as const;

export function Nav() {
  const { openContact } = useContact();
  const lenisRef = useLenis();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
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

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? "-100%" : 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: QUILL, delay: hidden ? 0 : 0.2 }}
      >
        <div
          className={cn(
            "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-700",
            scrolled
              ? "border-rule bg-paper/78 backdrop-blur-md backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        />
        <nav className="frame relative flex h-[var(--nav-h)] items-center justify-between">
          <a
            href="#top"
            className="group flex items-center gap-3 text-ink"
            aria-label="TOKEN/401 — back to top"
          >
            <CamelliaMark className="h-[22px] w-auto transition-transform duration-[1.2s] ease-[var(--ease-quill)] group-hover:rotate-[60deg]" />
            <Wordmark className="h-[13px] w-auto" />
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative py-2 text-[0.875rem] tracking-[0.01em] text-ink-2 transition-colors duration-300 hover:text-ink"
                >
                  {link.label}
                  <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-quill)] group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openContact()}
              className="hidden h-10 items-center rounded-full border border-ink px-5 text-[0.875rem] text-ink transition-colors duration-500 hover:bg-ink hover:text-paper md:inline-flex"
            >
              Write to us
            </button>
            <button
              type="button"
              className="relative flex size-10 items-center justify-center md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span
                className={cn(
                  "absolute h-px w-6 bg-ink transition-transform duration-500 ease-[var(--ease-quill)]",
                  menuOpen ? "rotate-45" : "-translate-y-[4px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-6 bg-ink transition-transform duration-500 ease-[var(--ease-quill)]",
                  menuOpen ? "-rotate-45" : "translate-y-[4px]",
                )}
              />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-paper pt-[var(--nav-h)] md:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: QUILL }}
          >
            <ul className="frame mt-10 flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  className="border-b border-rule"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease: QUILL }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setMenuOpen(false);
                      requestAnimationFrame(() => {
                        const el = document.querySelector<HTMLElement>(link.href);
                        if (!el) return;
                        const lenis = lenisRef.current;
                        if (lenis) {
                          lenis.start();
                          lenis.scrollTo(el, { offset: -24, duration: 1.6 });
                        } else {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      });
                    }}
                    className="flex items-baseline justify-between py-5"
                  >
                    <span className="display text-[2.75rem]">{link.label}</span>
                    <span className="eyebrow text-ink-4">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="frame mt-auto pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openContact();
                }}
                className="h-14 w-full rounded-full bg-ink text-[0.9375rem] text-paper"
              >
                Write to us
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
