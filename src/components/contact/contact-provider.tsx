"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import type { ContactTopic } from "@/lib/contact";

import { ContactDialog } from "./contact-dialog";

type ContactContextValue = { openContact: (topic?: ContactTopic) => void };

const ContactContext = createContext<ContactContextValue>({ openContact: () => {} });

export function useContact() {
  return useContext(ContactContext);
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [topic, setTopic] = useState<ContactTopic>("Something else");
  const [session, setSession] = useState(0);

  const openContact = useCallback((next?: ContactTopic) => {
    setTopic(next ?? "Something else");
    setSession((s) => s + 1);
    setOpen(true);
  }, []);

  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactContext.Provider value={value}>
      {children}
      <ContactDialog key={session} open={open} onOpenChange={setOpen} initialTopic={topic} />
    </ContactContext.Provider>
  );
}
