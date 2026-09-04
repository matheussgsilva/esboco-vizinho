"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("cidade", city);
    router.push(`/buscar?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-2 rounded-xl border border-border bg-surface p-2 shadow-sm sm:flex-row"
    >
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Nome, categoria ou serviço"
        aria-label="O que você procura"
        className="border-none focus:ring-0 sm:flex-1"
      />
      <div className="hidden w-px bg-border sm:block" />
      <Input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Cidade"
        aria-label="Onde"
        className="border-none focus:ring-0 sm:w-48"
      />
      <Button type="submit" className="sm:w-auto">
        Buscar
      </Button>
    </form>
  );
}
