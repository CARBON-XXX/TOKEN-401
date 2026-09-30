"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { useContact } from "@/components/contact/contact-provider";
import { Rise, SLOW } from "@/components/site/motion-primitives";
import { Arrow, PillButton } from "@/components/site/pill";
import type { ContactTopic } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Product = {
  name: string;
  kind: string;
  lede: string;
  body: string;
  facts: [string, string][];
  topic: ContactTopic;
  action: string;
};

const CAMELLIA: Product = {
  name: "Camellia",
  kind: "Model family",
  lede: "Language models that reason in layers, like petals around a centre.",
  body: "Built for depth, candour and the grace to say “I’m not sure.” Camellia shows its working, cites its sources, and declines plainly when a question sits outside what it can responsibly answer.",
  facts: [
    ["Form", "A family of language models"],
    ["Reads", "Text, images and code"],
    ["Access", "Private preview, by letter"],
  ],
  topic: "Camellia models",
  action: "Request access",
};

const THRESHOLD: Product = {
  name: "Threshold",
  kind: "Infrastructure",
  lede: "A permission layer for autonomous systems that act in the world.",
  body: "Every consequential action — a payment, a deletion, a message sent on your behalf — pauses at a threshold and waits for an explicit, recorded yes. Our answer to 401, made into infrastructure.",
  facts: [
    ["Form", "Permissions for AI agents"],
    ["Keeps", "A signed, append-only record"],
    ["Access", "Early access"],
  ],
  topic: "Threshold",
  action: "Join early access",
};

export function Products() {
  return (
    <section
      id="products"
      data-surface="bone"
      aria-labelledby="products-title"
      className="section-y scroll-mt-[var(--nav-h)]"
    >
      <div className="frame">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <Rise className="col-span-12 lg:col-span-3">
            <p className="type-label text-stone">Products</p>
          </Rise>
          <Rise as="header" className="col-span-12 lg:col-span-9" delay={0.1}>
            <h2 id="products-title" className="type-display-2 max-w-[12em] text-soot">
              Two instruments, one intention: to be worth trusting.
            </h2>
          </Rise>
        </div>

        <ProductPlate index={1} product={CAMELLIA} specimen={<ReplySpecimen />} />

        <ProductPlate index={2} product={THRESHOLD} mirrored specimen={<PermissionSlip />} />
      </div>
    </section>
  );
}

function ProductPlate({
  index,
  product,
  specimen,
  mirrored = false,
}: {
  index: number;
  product: Product;
  specimen: ReactNode;
  mirrored?: boolean;
}) {
  const { openContact } = useContact();

  return (
    <article className="mt-[clamp(88px,11vw,168px)] border-t border-plaster pt-6">
      <Rise className={cn("flex items-baseline justify-between", mirrored && "flex-row-reverse")}>
        <span className="type-label text-stone">
          {String(index).padStart(2, "0")}
        </span>
        <span className="type-label text-stone">{product.kind}</span>
      </Rise>

      <Rise delay={0.05}>
        <h3 className={cn("type-marque mt-8 text-soot sm:mt-4", mirrored && "sm:text-right")}>
          {product.name}
        </h3>
      </Rise>

      <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14 lg:mt-20">
        <Rise
          delay={0.1}
          className={cn(
            "col-span-12 sm:col-span-9",
            mirrored ? "lg:order-2 lg:col-start-8" : "",
            "lg:col-span-5",
          )}
        >
          {specimen}
        </Rise>

        <Rise
          delay={0.15}
          className={cn(
            "col-span-12",
            mirrored ? "lg:order-1" : "lg:col-start-8",
            "lg:col-span-5",
          )}
        >
          <p className="type-lede max-w-[20em] text-soot">{product.lede}</p>
          <p className="type-body mt-6 max-w-[28em] text-graphite">{product.body}</p>

          <dl className="mt-12 max-w-[32em] border-t border-plaster">
            {product.facts.map(([term, detail]) => (
              <div key={term} className="grid grid-cols-[7rem_1fr] items-baseline border-b border-plaster py-4">
                <dt className="type-label text-stone">{term}</dt>
                <dd className="font-serif text-base text-soot">{detail}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() => openContact(product.topic)}
            className="type-ui group mt-10 inline-flex items-center gap-4 text-soot"
          >
            <span className="relative pb-1">
              {product.action}
              <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current opacity-50 transition-transform duration-500 ease-[var(--ease-slow)] group-hover:scale-x-0" />
            </span>
            <Arrow />
          </button>
        </Rise>
      </div>
    </article>
  );
}

/** Products are shown working, set in type rather than drawn as UI chrome. */
function Specimen({
  label,
  status,
  description,
  children,
}: {
  label: string;
  status: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-soot p-6 sm:p-9" role="group" aria-label={description}>
      <div className="flex items-baseline justify-between gap-6">
        <span className="type-label text-soot">{label}</span>
        <span className="type-label flex items-center gap-2.5 text-stone" aria-live="polite">
          {status === "Awaiting you" ? (
            <span aria-hidden className="size-1.5 rounded-full bg-soot [animation:breathe_3.2s_ease-in-out_infinite]" />
          ) : null}
          {status}
        </span>
      </div>
      {children}
    </div>
  );
}

const WORKING = [
  "Ibuprofen is known to interact with several kinds of blood-pressure medicine.",
  "How much it matters depends on the medicine, and the question doesn’t say which.",
  "A wrong guess could do harm, and the missing fact is easy to get. So: ask.",
] as const;

const ROMAN = ["i", "ii", "iii"] as const;

const ANSWER = [
  {
    className: "type-lede text-soot",
    words: "Possibly not — it depends on the tablets. With several common ones, ibuprofen can weaken their effect and strain the kidneys.".split(" "),
  },
  {
    className: "type-body mt-4 text-graphite",
    words: "I don’t know which you take, so I won’t guess. What does the box say? A pharmacist can also check in a minute.".split(" "),
  },
];
const ANSWER_OFFSETS = [0, ANSWER[0].words.length];
const ANSWER_TOTAL = ANSWER[0].words.length + ANSWER[1].words.length;
const PAUSE_MS = 2000;
const TOKEN_MS = 55;

type ReplyPhase = "waiting" | "pausing" | "answering" | "done";

function ReplySpecimen() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<ReplyPhase>("waiting");
  const [shown, setShown] = useState(0);
  const [showWorking, setShowWorking] = useState(false);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // The reply takes its time on purpose: a visible pause, then the answer one word at a time.
  const play = () => {
    clearTimers();
    setShowWorking(false);
    setShown(0);
    setPhase("pausing");
    timers.current.push(
      window.setTimeout(() => {
        setPhase("answering");
        for (let i = 1; i <= ANSWER_TOTAL; i++) {
          timers.current.push(
            window.setTimeout(() => {
              setShown(i);
              if (i === ANSWER_TOTAL) setPhase("done");
            }, i * TOKEN_MS),
          );
        }
      }, PAUSE_MS),
    );
  };

  const current: ReplyPhase = reduce ? "done" : phase;
  const visible = reduce ? ANSWER_TOTAL : shown;
  const status = {
    waiting: "\u2014",
    pausing: "Considering",
    answering: "Answering",
    done: showWorking ? "Working shown" : "Unsure of one thing",
  }[current];

  return (
    <motion.div viewport={{ once: true, amount: 0.6 }} onViewportEnter={() => (reduce ? null : play())}>
      <Specimen label="Reply 2291" status={status} description="An example reply from Camellia">
        <p className="type-caption mt-10 text-stone">
          “Can I take ibuprofen with my blood-pressure tablets?”
        </p>

        <div className="relative mt-4" aria-busy={current === "pausing" || current === "answering"}>
          <AnimatePresence>
            {current === "pausing" ? (
              <motion.div
                key="pause"
                aria-hidden
                className="absolute inset-x-0 top-3 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: SLOW }}
              >
                <span className="type-label shrink-0 text-stone">A pause</span>
                <span className="relative h-px flex-1 overflow-hidden bg-plaster">
                  <motion.span
                    className="absolute inset-0 origin-left bg-soot/40"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: PAUSE_MS / 1000, ease: [0.45, 0, 0.55, 1] }}
                  />
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {ANSWER.map((para, pi) => (
            <p key={pi} className={para.className}>
              {para.words.map((w, wi) => {
                const on = ANSWER_OFFSETS[pi] + wi < visible;
                return (
                  <span
                    key={wi}
                    className="transition-[opacity,filter] duration-700 ease-[var(--ease-slow)]"
                    style={{ opacity: on ? 1 : 0, filter: on ? "none" : "blur(3px)" }}
                  >
                    {w}{" "}
                  </span>
                );
              })}
            </p>
          ))}
        </div>

        <AnimatePresence initial={false}>
          {showWorking ? (
            <motion.ol
              key="working"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: SLOW }}
              className="overflow-hidden"
            >
              {WORKING.map((step, i) => (
                <li
                  key={step}
                  className="type-body grid grid-cols-[2.25rem_1fr] border-plaster pt-4 text-graphite first:mt-8 first:border-t first:pt-6"
                >
                  <span className="text-stone">{ROMAN[i]}.</span>
                  {step}
                </li>
              ))}
            </motion.ol>
          ) : null}
        </AnimatePresence>

        <div
          className={cn(
            "mt-10 flex min-h-12 items-center justify-between gap-6 border-t border-plaster pt-6 transition-opacity duration-700",
            current === "done" ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <button
            type="button"
            aria-expanded={showWorking}
            disabled={current !== "done"}
            onClick={() => setShowWorking((v) => !v)}
            className="type-ui group relative py-2 text-soot"
          >
            {showWorking ? "Hide the working" : "Show the working"}
            <span className="absolute inset-x-0 bottom-1 h-px origin-right bg-current opacity-50 transition-transform duration-500 ease-[var(--ease-slow)] group-hover:scale-x-0" />
          </button>
          {reduce ? null : (
            <button
              type="button"
              disabled={current !== "done"}
              onClick={play}
              className="type-label text-stone transition-colors duration-500 hover:text-soot"
            >
              Ask again
            </button>
          )}
        </div>
      </Specimen>
    </motion.div>
  );
}

type Decision = { kind: "allowed" | "declined"; at: string } | null;

function PermissionSlip() {
  const [decision, setDecision] = useState<Decision>(null);

  const decide = (kind: "allowed" | "declined") =>
    setDecision({
      kind,
      at: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    });

  return (
    <Specimen
      label="Request 0412"
      status={decision === null ? "Awaiting you" : decision.kind === "allowed" ? "Allowed" : "Held"}
      description="An example Threshold request"
    >
      <p className="type-lede mt-10 text-soot">
        Your assistant would like to pay £2,400 to Harbour Joinery Ltd.
      </p>
      <p className="type-body mt-4 text-graphite">
        For invoice 118, due on Friday. A payment cannot be taken back once sent.
      </p>

      <div className="mt-10 flex min-h-12 items-center border-t border-plaster pt-6">
        <AnimatePresence mode="wait" initial={false}>
          {decision === null ? (
            <motion.div
              key="ask"
              className="flex w-full flex-wrap items-center justify-between gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: SLOW }}
            >
              <button
                type="button"
                onClick={() => decide("declined")}
                className="type-ui group relative py-2 text-graphite transition-colors duration-500 hover:text-soot"
              >
                Not yet
                <span className="absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-[var(--ease-slow)] group-hover:origin-left group-hover:scale-x-100" />
              </button>
              <PillButton onClick={() => decide("allowed")}>Allow once</PillButton>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="flex w-full flex-wrap items-baseline justify-between gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: SLOW }}
            >
              <p className="type-caption text-graphite">
                {decision.kind === "allowed"
                  ? `Allowed by you at ${decision.at}. Signed and kept on record.`
                  : `Held at ${decision.at}. Nothing was sent; the agent will wait.`}
              </p>
              <button
                type="button"
                onClick={() => setDecision(null)}
                className="type-label text-stone transition-colors duration-500 hover:text-soot"
              >
                Ask again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Specimen>
  );
}
