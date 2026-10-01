"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";

import { useContact } from "@/components/contact/contact-provider";
import { useLenis } from "@/components/providers/smooth-scroll";
import { CONTACT_EMAIL } from "@/lib/contact";
import { cn } from "@/lib/utils";

import { AnchorLink } from "./anchor-link";
import { SLOW } from "./motion-primitives";
import { NavLogo } from "./nav-logo";
import { buttonClass, PillButton } from "./pill";

export const NAV_LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#safeguards", label: "Safeguards" },
  { href: "/#approach", label: "Company" },
  { href: "/#journal", label: "Research" },
] as const;

type Surface = "ink" | "bone";

/** The nav section being read: the last one whose top has passed a line a third of the way down, until the closing. */
function sectionAt(probe: number): string | null {
  const past = (id: string) => {
    const el = document.getElementById(id);
    return !!el && el.getBoundingClientRect().top <= probe;
  };
  if (past("contact")) return null;
  let found: string | null = null;
  for (const link of NAV_LINKS) {
    const id = link.href.slice(2);
    if (past(id)) found = id;
  }
  return found;
}

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
  const [section, setSection] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [mark, setMark] = useState({ x: 0, width: 0 });

  const placeMark = useCallback(() => {
    const link = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    if (link) setMark({ x: link.offsetLeft, width: link.offsetWidth });
  }, []);

  useLayoutEffect(placeMark, [section, placeMark]);

  useEffect(() => {
    const read = () => {
      setSurface(surfaceAt(36));
      setSection(sectionAt(window.innerHeight / 3));
    };
    const frame = requestAnimationFrame(read);
    const onResize = () => {
      read();
      placeMark();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [placeMark]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const delta = y - (scrollY.getPrevious() ?? 0);
    setSurface(surfaceAt(36));
    setSection(sectionAt(window.innerHeight / 3));
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
        <nav className="frame relative flex h-[var(--nav-h)] items-center justify-between gap-8">
          <NavLogo />

          <div className="flex items-center gap-8">
            <ul ref={listRef} className="relative hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => {
                const here = section === link.href.slice(2);
                return (
                  <li key={link.href}>
                    <AnchorLink
                      href={link.href}
                      aria-current={here ? "true" : undefined}
                      className={cn(
                        "type-ui py-2 transition-colors duration-500",
                        onInk
                          ? here
                            ? "text-chalk"
                            : "text-chalk/70 hover:text-chalk"
                          : here
                            ? "text-soot"
                            : "text-graphite hover:text-soot",
                      )}
                    >
                      {link.label}
                    </AnchorLink>
                  </li>
                );
              })}
              <motion.li
                aria-hidden
                className="pointer-events-none absolute -bottom-1 left-0 h-px bg-current"
                initial={false}
                animate={{ x: mark.x, width: mark.width, opacity: section ? 1 : 0 }}
                transition={{ duration: 0.8, ease: SLOW }}
              />
            </ul>
            <button
              type="button"
              onClick={() => openContact("Early access")}
              className={buttonClass({
                surface: onInk ? "ink" : "bone",
                tone: "outline",
                className: "hidden h-9 px-4 md:inline-flex",
              })}
            >
              Request access
            </button>
            <button
              type="button"
              className="type-ui -mr-2 px-2 py-3 font-medium md:hidden"
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
                    className="block py-5 font-display text-[2.5rem] leading-none font-medium tracking-[-0.03em]"
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
                  openContact("Early access");
                }}
              >
                Request access
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
