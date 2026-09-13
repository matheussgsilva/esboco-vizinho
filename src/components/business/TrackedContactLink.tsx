"use client";

import type { ReactNode } from "react";

type TrackedEventType = "CLICK_PHONE" | "CLICK_WHATSAPP" | "CLICK_SOCIAL";

interface TrackedContactLinkProps {
  businessId: string;
  type: TrackedEventType;
  href: string;
  children: ReactNode;
  className?: string;
}

export function TrackedContactLink({
  businessId,
  type,
  href,
  children,
  className,
}: TrackedContactLinkProps) {
  const isExternal = type !== "CLICK_PHONE";

  return (
    <a
      href={href}
      className={className}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      onClick={() => {
        fetch("/api/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId, type }),
          keepalive: true,
        }).catch(() => {});
      }}
    >
      {children}
    </a>
  );
}
