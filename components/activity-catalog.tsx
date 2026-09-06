"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  activities,
  activityTypes,
  getActivitySections,
  sectionBySlug,
  sections,
  type Activity,
} from "@/lib/science-data";

type FilterState = {
  sections: string[];
  languages: string[];
  types: string[];
  platforms: string[];
};

const emptyFilters: FilterState = { sections: [], languages: [], types: [], platforms: [] };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

function score(activity: Activity, query: string) {
  if (!query) return 0;
  const title = normalize(activity.title);
  const original = normalize(activity.originalTitle);
  const tags = normalize(`${activity.tags} ${activity.keywords}`);
  const description = normalize(activity.description);
  if (title === query) return 1000;
  if (title.startsWith(query)) return 700;
  if (original === query || original.startsWith(query)) return 600;
  if (tags.includes(query)) return 450;
  if (description.includes(query)) return 300;
  return 100;
}

function readInitialFilters(lockedSection?: string): FilterState {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  const values = (name: string) => (params.get(name) ?? "").split("|").filter(Boolean);
  return {
    sections: lockedSection ? [] : values("section"),
    languages: values("lang"),
    types: values("type"),
    platforms: values("platform"),
  };
}

function FilterGroup({ title, values, selected, onToggle }: { title: string; values: { value: string; label: string; count?: number }[]; selected: string[]; onToggle: (value: string) => void }) {
  const groupId = useId();
  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      <div className="filter-options">
        {values.map((item, index) => {
          const id = `${groupId}-${index}`;
          return (
            <label key={item.value} htmlFor={id}>
              <Checkbox id={id} checked={selected.includes(item.value)} onCheckedChange={() => onToggle(item.value)} />
              <span>{item.label}</span>
              {typeof item.count === "number" ? <span className="filter-count">{item.count}</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ActivityCatalog({ initialQuery = "", lockedSection }: { initialQuery?: string; lockedSection?: string }) {
  const locked = lockedSection ? sectionBySlug.get(lockedSection) : undefined;
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState(initialQuery ? "relevance" : "theme");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get("q") ?? initialQuery);
    setDebouncedQuery(params.get("q") ?? initialQuery);
    setFilters(readInitialFilters(lockedSection));
    setSort(params.get("sort") ?? (params.get("q") ? "relevance" : "theme"));
  }, [initialQuery, lockedSection]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (!lockedSection && filters.sections.length) params.set("section", filters.sections.join("|"));
    if (filters.languages.length) params.set("lang", filters.languages.join("|"));
    if (filters.types.length) params.set("type", filters.types.join("|"));
    if (filters.platforms.length) params.set("platform", filters.platforms.join("|"));
    if (sort !== (debouncedQuery ? "relevance" : "theme")) params.set("sort", sort);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState({ catalog: true }, "", next);
  }, [debouncedQuery, filters, lockedSection, sort]);

  const results = useMemo(() => {
    const terms = normalize(debouncedQuery).split(/\s+/).filter(Boolean);
    return activities
      .filter((activity) => !locked || activity.sectionIds.includes(locked.id))
      .filter((activity) => !filters.sections.length || activity.sectionIds.some((id) => filters.sections.includes(id)))
      .filter((activity) => !filters.languages.length || filters.languages.includes(activity.language))
      .filter((activity) => !filters.types.length || filters.types.includes(activity.type))
      .filter((activity) => !filters.platforms.length || filters.platforms.includes(activity.platform))
      .filter((activity) => {
        if (!terms.length) return true;
        const sectionNames = getActivitySections(activity).map((section) => section.name).join(" ");
        const haystack = normalize(`${activity.title} ${activity.originalTitle} ${activity.description} ${sectionNames} ${activity.tags} ${activity.keywords} ${activity.type} ${activity.language} ${activity.platform}`);
        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => {
        if (sort === "az") return a.title.localeCompare(b.title, "es");
        if (sort === "relevance" && debouncedQuery) {
          return score(b, normalize(debouncedQuery)) - score(a, normalize(debouncedQuery)) || a.title.localeCompare(b.title, "es");
        }
        if (locked) return a.title.localeCompare(b.title, "es");
        const sectionOrder = (getActivitySections(a)[0]?.order ?? 99) - (getActivitySections(b)[0]?.order ?? 99);
        return sectionOrder || a.title.localeCompare(b.title, "es");
      });
  }, [debouncedQuery, filters, locked, sort]);

  function toggle(group: keyof FilterState, value: string) {
    setFilters((current) => ({ ...current, [group]: current[group].includes(value) ? current[group].filter((item) => item !== value) : [...current[group], value] }));
  }

  function clearAll() {
    setQuery("");
    setDebouncedQuery("");
    setFilters(emptyFilters);
    setSort("theme");
  }

  const chips = [
    ...filters.sections.map((id) => ({ group: "sections" as const, value: id, label: sections.find((section) => section.id === id)?.name ?? id })),
    ...filters.languages.map((value) => ({ group: "languages" as const, value, label: value })),
    ...filters.types.map((value) => ({ group: "types" as const, value, label: value })),
    ...filters.platforms.map((value) => ({ group: "platforms" as const, value, label: value })),
  ];

  const filtersUi = (
    <div className="filters-stack">
      {!locked ? <FilterGroup title="Sección" values={sections.map((section) => ({ value: section.id, label: section.name, count: section.count }))} selected={filters.sections} onToggle={(value) => toggle("sections", value)} /> : null}
      <FilterGroup title="Idioma" values={[{ value: "Español", label: "Español", count: 26 }, { value: "Inglés", label: "Inglés", count: 39 }]} selected={filters.languages} onToggle={(value) => toggle("languages", value)} />
      <FilterGroup title="Tipo de actividad" values={activityTypes.map((item) => ({ value: item.name, label: item.name, count: item.count }))} selected={filters.types} onToggle={(value) => toggle("types", value)} />
      <FilterGroup title="Plataforma" values={[{ value: "Wordwall", label: "Wordwall", count: 22 }, { value: "Educaplay", label: "Educaplay", count: 43 }]} selected={filters.platforms} onToggle={(value) => toggle("platforms", value)} />
      <Button variant="outline" className="clear-filter-button" onClick={clearAll}>Limpiar filtros</Button>
    </div>
  );

  return (
    <div className="catalog-shell">
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label htmlFor="catalog-search">Buscar en las actividades</label>
          <div className="catalog-search-field"><Search aria-hidden="true" /><input id="catalog-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tema, concepto o actividad" /></div>
        </div>
        <div className="toolbar-controls">
          <Sheet>
            <SheetTrigger asChild><Button variant="outline" className="mobile-filter-trigger"><Filter /> Filtros{chips.length ? ` (${chips.length})` : ""}</Button></SheetTrigger>
            <SheetContent side="left" className="filter-sheet" showCloseButton={false}>
              <SheetHeader><SheetTitle>Filtrar actividades</SheetTitle><SheetDescription>Combina temas, idiomas, tipos y plataformas.</SheetDescription></SheetHeader>
              <SheetClose className="sheet-close-button" aria-label="Cerrar filtros"><X /></SheetClose>
              <div className="filter-sheet-scroll">{filtersUi}</div>
            </SheetContent>
          </Sheet>
          <div className="sort-control"><SlidersHorizontal aria-hidden="true" /><label htmlFor="sort-results">Ordenar</label><Select value={sort} onValueChange={setSort}><SelectTrigger id="sort-results"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="theme">Por tema</SelectItem>{debouncedQuery ? <SelectItem value="relevance">Relevancia</SelectItem> : null}<SelectItem value="az">Título A–Z</SelectItem></SelectContent></Select></div>
        </div>
      </div>
      {chips.length ? <div className="active-filters" aria-label="Filtros activos">{chips.map((chip) => <button key={`${chip.group}-${chip.value}`} onClick={() => toggle(chip.group, chip.value)}>{chip.label}<X aria-hidden="true" /></button>)}<button className="clear-link" onClick={clearAll}>Limpiar filtros</button></div> : null}
      <div className="catalog-layout">
        <aside className="desktop-filters" aria-label="Filtros"><div className="filter-heading"><Filter aria-hidden="true" /><h2>Filtros</h2></div>{filtersUi}</aside>
        <section className="results-panel" aria-labelledby="results-heading">
          <div className="results-heading"><h2 id="results-heading">{results.length} {results.length === 1 ? "actividad" : "actividades"}</h2>{locked ? <span>en {locked.name}</span> : null}</div>
          <p className="sr-only" aria-live="polite">Se muestran {results.length} resultados.</p>
          {results.length ? <div className="activity-grid">{results.map((activity) => <ActivityCard key={activity.id} activity={activity} currentSection={locked} />)}</div> : <div className="empty-state"><Search aria-hidden="true" /><h3>No hay resultados con esos criterios</h3><p>Prueba otra búsqueda o elimina alguno de los filtros.</p><Button onClick={clearAll}>Limpiar filtros</Button></div>}
        </section>
      </div>
    </div>
  );
}
