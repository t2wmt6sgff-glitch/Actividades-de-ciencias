"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  function submit(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/actividades?q=${encodeURIComponent(value)}` : "/actividades");
  }
  return (
    <form className="home-search" role="search" onSubmit={submit}>
      <label htmlFor="home-search">Buscar actividades</label>
      <div className="search-field">
        <Search aria-hidden="true" />
        <input id="home-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por tema, concepto o actividad" />
        <button type="submit">Buscar</button>
      </div>
    </form>
  );
}
