"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

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
                <dd className="font-serif text-[1.0625rem] text-soot">{detail}</dd>
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
        <span className="type-label text-stone" aria-live="polite">
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

function ReplySpecimen() {
  const [showWorking, setShowWorking] = useState(false);

  return (
    <Specimen
      label="Reply 2291"
      status={showWorking ? "Working shown" : "Unsure of one thing"}
      description="An example reply from Camellia"
    >
      <p className="type-caption mt-10 text-stone">
        “Can I take ibuprofen with my blood-pressure tablets?”
      </p>
      <p className="type-lede mt-4 text-soot">
        Possibly not — it depends on the tablets. With several common ones, ibuprofen can weaken
        their effect and strain the kidneys.
      </p>
      <p className="type-body mt-4 text-graphite">
        I don’t know which you take, so I won’t guess. What does the box say? A pharmacist can also
        check in a minute.
      </p>

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

      <div className="mt-10 flex min-h-12 items-center border-t border-plaster pt-6">
        <button
          type="button"
          aria-expanded={showWorking}
          onClick={() => setShowWorking((v) => !v)}
          className="type-ui group relative py-2 text-soot"
        >
          {showWorking ? "Hide the working" : "Show the working"}
          <span className="absolute inset-x-0 bottom-1 h-px origin-right bg-current opacity-50 transition-transform duration-500 ease-[var(--ease-slow)] group-hover:scale-x-0" />
        </button>
      </div>
    </Specimen>
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
