"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MapPin, Search } from "lucide-react";
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
      className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-surface p-3 shadow-lg sm:flex-row sm:items-center"
    >
      <div className="flex flex-1 items-center gap-2 px-2">
        <Search className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nome, categoria ou serviço"
          aria-label="O que você procura"
          className="border-none px-0 focus:ring-0"
        />
      </div>
      <div className="hidden h-8 w-px bg-border sm:block" />
      <div className="flex items-center gap-2 px-2 sm:w-52">
        <MapPin className="h-5 w-5 shrink-0 text-ink-muted" strokeWidth={1.75} aria-hidden />
        <Input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Cidade"
          aria-label="Onde"
          className="border-none px-0 focus:ring-0"
        />
      </div>
      <Button type="submit" className="gap-2 sm:w-auto">
        <Search className="h-4 w-4" strokeWidth={2} aria-hidden />
        Buscar
      </Button>
    </form>
  );
}
