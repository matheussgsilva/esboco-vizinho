"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { PlanType } from "../../../generated/enums";

interface SubscriptionActionsProps {
  mode: "checkout" | "portal";
  planType?: PlanType;
  label: string;
  variant?: "primary" | "secondary";
}

export function SubscriptionActions({
  mode,
  planType,
  label,
  variant = "primary",
}: SubscriptionActionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setIsPending(true);
    setError(null);
    try {
      const res = await fetch(mode === "checkout" ? "/api/checkout" : "/api/billing-portal", {
        method: "POST",
        headers: mode === "checkout" ? { "Content-Type": "application/json" } : undefined,
        body: mode === "checkout" ? JSON.stringify({ planType }) : undefined,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível continuar. Tente novamente.");
        setIsPending(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Não foi possível continuar. Tente novamente.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-1">
      <Button onClick={handleClick} disabled={isPending} variant={variant} className="w-full">
        {isPending ? "Redirecionando..." : label}
      </Button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
