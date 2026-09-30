export const CONTACT_TOPICS = [
  "Early access",
  "Research",
  "Careers",
  "Press",
  "Something else",
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number];

export type ContactField = "name" | "email" | "message";

export type ContactResponse =
  | { ok: true }
  | { ok: false; error?: string; errors?: Partial<Record<ContactField, string>> };

export const CONTACT_EMAIL = "hello@token401.ai";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: { name: string; email: string; message: string }) {
  const errors: Partial<Record<ContactField, string>> = {};
  if (!input.name.trim()) errors.name = "Please tell us your name.";
  if (!EMAIL.test(input.email.trim())) errors.email = "That address doesn’t look quite right.";
  if (input.message.trim().length < 10) errors.message = "A sentence or two helps us reply well.";
  return errors;
}
