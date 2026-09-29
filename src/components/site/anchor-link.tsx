"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type AnchorLinkProps = Omit<ComponentProps<"a">, "href"> & { href: `/#${string}` };

/** On the home page a section link stays a bare hash so smooth scrolling can take it; elsewhere it routes home. */
export function AnchorLink({ href, ...props }: AnchorLinkProps) {
  const pathname = usePathname();
  if (pathname === "/") return <a href={href.slice(1)} {...props} />;
  return <Link href={href} {...props} />;
}
