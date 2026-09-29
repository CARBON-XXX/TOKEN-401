import { NextResponse } from "next/server";

import { CONTACT_TOPICS, validateContact, type ContactResponse } from "@/lib/contact";

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json<ContactResponse>(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const letter = {
    name: text(body.name),
    email: text(body.email),
    organisation: text(body.organisation),
    topic: CONTACT_TOPICS.find((t) => t === body.topic) ?? "Something else",
    message: text(body.message),
  };

  const errors = validateContact(letter);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json<ContactResponse>({ ok: false, errors }, { status: 422 });
  }

  // No mail provider is configured in this build; letters are logged server-side.
  console.info("[contact]", letter);
  await new Promise((resolve) => setTimeout(resolve, 900));

  return NextResponse.json<ContactResponse>({ ok: true });
}
