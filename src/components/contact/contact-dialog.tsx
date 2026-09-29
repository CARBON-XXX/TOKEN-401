"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type FormEvent, type ReactNode } from "react";

import { CamelliaBloom } from "@/components/brand/camellia-bloom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  "h-11 rounded-none border-0 border-b border-rule-strong bg-transparent px-0 font-serif text-lg text-ink shadow-none placeholder:text-ink-4 focus-visible:border-ink focus-visible:ring-0 aria-invalid:border-destructive aria-invalid:ring-0 md:text-lg";

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
        className="max-h-[calc(100svh-2rem)] gap-0 overflow-y-auto rounded-[3px] bg-paper p-0 text-ink shadow-[0_40px_120px_-40px_rgba(20,20,19,0.45)] ring-rule-strong sm:max-w-[36rem]"
        data-lenis-prevent
      >
        <div className="flex items-center justify-between border-b border-rule px-7 py-4 sm:px-10">
          <span className="eyebrow text-ink-3">Correspondence — N° 401</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {status === "sent" ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center px-7 pt-12 pb-12 text-center sm:px-10"
            >
              <CamelliaBloom className="size-28 text-ink" strokeWidth={1.6} spread={1.3} />
              <DialogTitle className="mt-8 font-serif text-3xl font-light tracking-tight">
                Your letter is on its way.
              </DialogTitle>
              <DialogDescription className="mt-3 max-w-sm font-serif text-lg leading-relaxed text-ink-3">
                A person — not a model — will read it and reply within two working days.
              </DialogDescription>
              <DialogClose
                render={
                  <Button
                    variant="outline"
                    className="mt-10 h-11 rounded-full border-rule-strong bg-transparent px-6 text-sm"
                  />
                }
              >
                Return to the page
              </DialogClose>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              noValidate
              onSubmit={onSubmit}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-7 pt-8 pb-8 sm:px-10 sm:pt-10"
            >
              <DialogTitle className="font-serif text-[2.25rem] leading-[1.05] font-light tracking-[-0.02em]">
                Write to us.
              </DialogTitle>
              <DialogDescription className="mt-3 max-w-md font-serif text-[1.0625rem] leading-relaxed text-ink-3">
                Tell us what you are exploring. We read every letter and answer the ones we can help
                with, carefully.
              </DialogDescription>

              <fieldset className="mt-8">
                <legend className="eyebrow mb-3 text-ink-3">Regarding</legend>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_TOPICS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={topic === t}
                      onClick={() => setTopic(t)}
                      className={cn(
                        "rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-300",
                        topic === t
                          ? "border-ink bg-ink text-paper"
                          : "border-rule-strong text-ink-2 hover:border-ink",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <Field id="name" label="Your name" error={errors.name}>
                  <Input
                    id="name"
                    name="name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
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
                    placeholder="ada@analytical.engine"
                    aria-invalid={Boolean(errors.email)}
                    className={fieldClass}
                  />
                </Field>
              </div>
              <div className="mt-6">
                <Field id="organisation" label="Organisation" hint="Optional">
                  <Input
                    id="organisation"
                    name="organisation"
                    autoComplete="organization"
                    placeholder="Where you work, study, or wonder"
                    className={fieldClass}
                  />
                </Field>
              </div>
              <div className="mt-6">
                <Field id="message" label="Your letter" error={errors.message}>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="A few sentences is plenty."
                    aria-invalid={Boolean(errors.message)}
                    className={cn(fieldClass, "min-h-28 resize-none py-2.5 leading-relaxed")}
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
                    className="caption mt-6 text-destructive"
                  >
                    Something interrupted the letter. Please try again, or write to{" "}
                    <a className="underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                    .
                  </motion.p>
                ) : null}
              </AnimatePresence>

              <div className="mt-9 flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="eyebrow text-ink-4">Replies within two working days</p>
                <Button
                  type="submit"
                  disabled={status === "sending"}
                  className="h-12 rounded-full bg-ink px-7 text-[0.9375rem] font-normal text-paper hover:bg-ink-2 disabled:opacity-80"
                >
                  {status === "sending" ? (
                    <span className="inline-flex items-center gap-3">
                      Sending
                      <span className="relative block h-px w-8 overflow-hidden bg-paper/25">
                        <motion.span
                          className="absolute inset-y-0 left-0 w-1/2 bg-paper"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </span>
                    </span>
                  ) : (
                    "Send letter"
                  )}
                </Button>
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
      <Label htmlFor={id} className="eyebrow flex justify-between font-normal text-ink-3">
        {label}
        {hint ? <span className="text-ink-4">{hint}</span> : null}
      </Label>
      <div className="mt-1">{children}</div>
      <AnimatePresence>
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="caption mt-2 text-[0.875rem] text-destructive"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
