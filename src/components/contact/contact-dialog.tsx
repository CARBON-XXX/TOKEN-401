"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { SLOW } from "@/components/site/motion-primitives";
import { PillButton } from "@/components/site/pill";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTACT_EMAIL,
  CONTACT_TOPICS,
  validateContact,
  type ContactField,
  type ContactResponse,
  type ContactTopic,
} from "@/lib/contact";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "failed";

type ContactDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTopic: ContactTopic;
};

const fieldClass =
  "h-11 rounded-none border-0 border-b border-stone bg-transparent px-0 font-serif text-[1.0625rem] text-soot shadow-none transition-colors duration-500 focus-visible:border-soot focus-visible:ring-0 aria-invalid:border-destructive aria-invalid:ring-0 md:text-[1.0625rem]";

export function ContactDialog({ open, onOpenChange, initialTopic }: ContactDialogProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [topic, setTopic] = useState<ContactTopic>(initialTopic);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const letter = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      organisation: String(data.get("organisation") ?? ""),
      message: String(data.get("message") ?? ""),
      topic,
    };

    const found = validateContact(letter);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(letter),
      });
      const json = (await res.json()) as ContactResponse;
      if (json.ok) {
        setStatus("sent");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setStatus(json.errors ? "idle" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto rounded-none bg-bone p-0 text-soot ring-0 sm:max-w-[38rem]"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-plaster px-7 py-5 sm:px-11">
          <span className="type-label text-stone">A letter to TOKEN/401</span>
          <DialogClose className="type-label -mr-2 px-2 py-1 text-stone transition-colors duration-500 hover:text-soot">
            Close
          </DialogClose>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: SLOW }}
              className="flex flex-col items-center px-7 pt-14 pb-14 text-center sm:px-11"
            >
              <CamelliaBloom className="aspect-[317/325] w-24 text-soot" strokeWidth={1.8} spread={1.3} />
              <DialogTitle className="mt-10 font-display text-[2.5rem] leading-[1.06] font-light tracking-[-0.012em]">
                Your letter is on its way.
              </DialogTitle>
              <DialogDescription className="type-body mt-4 max-w-[22em] text-graphite">
                A person — not a model — will read it, and reply within two working days.
              </DialogDescription>
              <DialogClose className="type-ui group relative mt-10 pb-1 text-soot">
                Return to the page
                <span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current opacity-50" />
              </DialogClose>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={onSubmit}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="px-7 pt-10 pb-9 sm:px-11 sm:pt-12"
            >
              <DialogTitle className="font-display text-[2.75rem] leading-[1.02] font-light tracking-[-0.012em]">
                Write to us.
              </DialogTitle>
              <DialogDescription className="type-body mt-4 max-w-[26em] text-graphite">
                Tell us what you are working on, or wondering about. A few sentences is plenty.
              </DialogDescription>

              <fieldset className="mt-10">
                <legend className="type-label mb-4 text-stone">Regarding</legend>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={topic === t}
                      onClick={() => setTopic(t)}
                      className={cn(
                        "rounded-[4px] border px-3.5 py-2 font-sans text-[0.875rem] transition-colors duration-500 active:bg-plaster/60",
                        topic === t
                          ? "border-soot bg-soot text-chalk"
                          : "border-plaster text-graphite hover:border-stone hover:text-soot",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-9 grid gap-7 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    className={fieldClass}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    className={fieldClass}
                  />
                </Field>
              </div>
              <div className="mt-7">
                <Field id="organisation" label="Organisation" hint="Optional">
                  <Input id="organisation" name="organisation" autoComplete="organization" className={fieldClass} />
                </Field>
              </div>
              <div className="mt-7">
                <Field id="message" label="Your letter" error={errors.message}>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    aria-invalid={Boolean(errors.message)}
                    className={cn(fieldClass, "min-h-32 resize-none py-2.5 leading-[1.65]")}
                  />
                </Field>
              </div>

              <AnimatePresence>
                {status === "failed" ? (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="type-caption mt-7 text-destructive"
                  >
                    Something interrupted the letter. Please try again, or write to{" "}
                    <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <div className="mt-10 flex flex-col-reverse items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="type-caption text-stone">Replies within two working days.</p>
                <PillButton type="submit" disabled={status === "sending"} className="disabled:opacity-70">
                  {status === "sending" ? "Sending…" : "Send letter"}
                </PillButton>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="type-label flex items-baseline justify-between text-stone">
        {label}
        {hint ? <span className="type-caption tracking-normal normal-case">{hint}</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: SLOW }}
            className="type-caption mt-2 text-destructive"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
