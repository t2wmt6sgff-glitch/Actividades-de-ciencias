import { ActivityCatalog } from "@/components/activity-catalog";

export default function ActivitiesPage() {
  return (
    <main id="main-content" className="catalog-page site-container">
      <div className="page-heading"><p className="eyebrow">Catálogo</p><h1>Todas las actividades</h1><p>Busca por tema o concepto y combina los filtros para encontrar el recurso que necesitas.</p></div>
      <ActivityCatalog />
    </main>
  );
}
