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
import { activityTypes, platforms } from "@/lib/catalog/data";
import { activityTypeById, platformById, subjectById, topicById } from "@/lib/catalog/indexes";
import { languageLabel, platformLabel, typeLabel } from "@/lib/catalog/presentation";
import {
  activeTopics,
  getActivitySubjects,
  getActivityTopics,
  publicActivities,
  resolveTopicFilter,
} from "@/lib/catalog/selectors";
import type { Activity } from "@/lib/catalog/schema";

type FilterState = {
  topics: string[];
  languages: string[];
  types: string[];
  platforms: string[];
};

const emptyFilters: FilterState = { topics: [], languages: [], types: [], platforms: [] };

function normalize(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

function score(activity: Activity, query: string) {
  if (!query) return 0;
  const title = normalize(activity.title);
  const original = normalize(activity.sourceTitle ?? "");
  const tags = normalize([...activity.tags, ...activity.keywords].join(" "));
  const description = normalize(activity.description);
  if (title === query) return 1000;
  if (title.startsWith(query)) return 700;
  if (original === query || original.startsWith(query)) return 600;
  if (tags.includes(query)) return 450;
  if (description.includes(query)) return 300;
  return 100;
}

function valuesFrom(params: URLSearchParams, name: string) {
  return (params.get(name) ?? "").split("|").filter(Boolean);
}

function resolveConfiguredId(value: string, entries: { id: string; name: string }[]) {
  return entries.find((entry) => entry.id === value || entry.name === value)?.id;
}

function readInitialFilters(lockedTopicId?: string): FilterState {
  if (typeof window === "undefined") return emptyFilters;
  const params = new URLSearchParams(window.location.search);
  const languages = [...new Set(publicActivities.map((activity) => activity.language))];
  return {
    topics: lockedTopicId
      ? []
      : valuesFrom(params, "section")
          .map((value) => resolveTopicFilter(value)?.id)
          .filter((value): value is string => Boolean(value)),
    languages: valuesFrom(params, "lang")
      .map((value) => languages.find((language) => language === value || languageLabel(language) === value))
      .filter((value): value is string => Boolean(value)),
    types: valuesFrom(params, "type")
      .map((value) => resolveConfiguredId(value, activityTypes))
      .filter((value): value is string => Boolean(value)),
    platforms: valuesFrom(params, "platform")
      .map((value) => resolveConfiguredId(value, platforms))
      .filter((value): value is string => Boolean(value)),
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

export function ActivityCatalog({
  initialQuery = "",
  lockedTopicId,
  lockedSubjectId,
}: {
  initialQuery?: string;
  lockedTopicId?: string;
  lockedSubjectId?: string;
}) {
  const lockedTopic = lockedTopicId ? topicById.get(lockedTopicId) : undefined;
  const lockedSubject = lockedSubjectId ? subjectById.get(lockedSubjectId) : undefined;
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState(initialQuery ? "relevance" : "theme");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // The query string is available only in the browser after static hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(params.get("q") ?? initialQuery);
    setDebouncedQuery(params.get("q") ?? initialQuery);
    setFilters(readInitialFilters(lockedTopicId));
    setSort(params.get("sort") ?? (params.get("q") ? "relevance" : "theme"));
  }, [initialQuery, lockedTopicId]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 200);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (!lockedTopicId && filters.topics.length) params.set("section", filters.topics.join("|"));
    if (filters.languages.length) params.set("lang", filters.languages.join("|"));
    if (filters.types.length) params.set("type", filters.types.join("|"));
    if (filters.platforms.length) params.set("platform", filters.platforms.join("|"));
    if (sort !== (debouncedQuery ? "relevance" : "theme")) params.set("sort", sort);
    const next = `${window.location.pathname}${params.size ? `?${params.toString()}` : ""}`;
    window.history.replaceState({ catalog: true }, "", next);
  }, [debouncedQuery, filters, lockedTopicId, sort]);

  const scopedActivities = useMemo(
    () => publicActivities.filter((activity) =>
      (!lockedSubjectId || activity.subjectIds.includes(lockedSubjectId))
      && (!lockedTopicId || activity.topicIds.includes(lockedTopicId))),
    [lockedSubjectId, lockedTopicId],
  );

  const availableTopics = activeTopics.filter((topic) => !lockedSubjectId || topic.subjectId === lockedSubjectId);
  const availableLanguages = [...new Set(scopedActivities.map((activity) => activity.language))].sort();
  const countBy = (predicate: (activity: Activity) => boolean) => scopedActivities.filter(predicate).length;

  const results = useMemo(() => {
    const terms = normalize(debouncedQuery).split(/\s+/).filter(Boolean);
    return scopedActivities
      .filter((activity) => !filters.topics.length || activity.topicIds.some((id) => filters.topics.includes(id)))
      .filter((activity) => !filters.languages.length || filters.languages.includes(activity.language))
      .filter((activity) => !filters.types.length || filters.types.includes(activity.typeId))
      .filter((activity) => !filters.platforms.length || (activity.source.kind === "external" && filters.platforms.includes(activity.source.platformId)))
      .filter((activity) => {
        if (!terms.length) return true;
        const subjectNames = getActivitySubjects(activity).map((subject) => subject.name).join(" ");
        const topicNames = getActivityTopics(activity).map((topic) => topic.name).join(" ");
        const haystack = normalize(`${activity.title} ${activity.sourceTitle ?? ""} ${activity.description} ${subjectNames} ${topicNames} ${activity.tags.join(" ")} ${activity.keywords.join(" ")} ${typeLabel(activity)} ${languageLabel(activity.language)} ${platformLabel(activity)}`);
        return terms.every((term) => haystack.includes(term));
      })
      .sort((a, b) => {
        if (sort === "az") return a.title.localeCompare(b.title, "es");
        if (sort === "relevance" && debouncedQuery) {
          return score(b, normalize(debouncedQuery)) - score(a, normalize(debouncedQuery)) || a.title.localeCompare(b.title, "es");
        }
        if (lockedTopic) return a.title.localeCompare(b.title, "es");
        const topicOrder = (getActivityTopics(a)[0]?.order ?? 99) - (getActivityTopics(b)[0]?.order ?? 99);
        return topicOrder || a.title.localeCompare(b.title, "es");
      });
  }, [debouncedQuery, filters, lockedTopic, scopedActivities, sort]);

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
    ...filters.topics.map((id) => ({ group: "topics" as const, value: id, label: topicById.get(id)?.name ?? id })),
    ...filters.languages.map((value) => ({ group: "languages" as const, value, label: languageLabel(value) })),
    ...filters.types.map((value) => ({ group: "types" as const, value, label: activityTypeById.get(value)?.name ?? value })),
    ...filters.platforms.map((value) => ({ group: "platforms" as const, value, label: platformById.get(value)?.name ?? value })),
  ];

  const filtersUi = (
    <div className="filters-stack">
      {!lockedTopic ? <FilterGroup title="Tema" values={availableTopics.map((topic) => ({ value: topic.id, label: topic.name, count: countBy((activity) => activity.topicIds.includes(topic.id)) }))} selected={filters.topics} onToggle={(value) => toggle("topics", value)} /> : null}
      <FilterGroup title="Idioma" values={availableLanguages.map((language) => ({ value: language, label: languageLabel(language), count: countBy((activity) => activity.language === language) }))} selected={filters.languages} onToggle={(value) => toggle("languages", value)} />
      <FilterGroup title="Tipo de actividad" values={activityTypes.map((item) => ({ value: item.id, label: item.name, count: countBy((activity) => activity.typeId === item.id) })).filter((item) => item.count > 0)} selected={filters.types} onToggle={(value) => toggle("types", value)} />
      <FilterGroup title="Plataforma" values={platforms.map((platform) => ({ value: platform.id, label: platform.name, count: countBy((activity) => activity.source.kind === "external" && activity.source.platformId === platform.id) })).filter((item) => item.count > 0)} selected={filters.platforms} onToggle={(value) => toggle("platforms", value)} />
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
          <div className="results-heading"><h2 id="results-heading">{results.length} {results.length === 1 ? "actividad" : "actividades"}</h2>{lockedTopic ? <span>en {lockedTopic.name}</span> : lockedSubject ? <span>de {lockedSubject.name}</span> : null}</div>
          <p className="sr-only" aria-live="polite">Se muestran {results.length} resultados.</p>
          {results.length ? <div className="activity-grid">{results.map((activity) => <ActivityCard key={activity.id} activity={activity} currentTopic={lockedTopic} currentSubject={lockedSubject} />)}</div> : <div className="empty-state"><Search aria-hidden="true" /><h3>No hay resultados con esos criterios</h3><p>Prueba otra búsqueda o elimina alguno de los filtros.</p><Button onClick={clearAll}>Limpiar filtros</Button></div>}
        </section>
      </div>
    </div>
  );
}
