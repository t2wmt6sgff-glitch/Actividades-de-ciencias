import { notFound } from "next/navigation";
import { ActivityCatalog } from "@/components/activity-catalog";
import { sectionBySlug, sections } from "@/lib/science-data";
import { getSectionMedia } from "@/lib/section-media";

export function generateStaticParams() { return sections.map((section) => ({ slug: section.slug })); }

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = sectionBySlug.get(slug);
  if (!section) notFound();
  const media = getSectionMedia(section);
  return (
    <main id="main-content" className="catalog-page site-container">
      <div className={`page-heading section-page-heading section-theme-${section.order}`}>
        {media ? <img src={media.src} alt={media.alt} style={{ objectPosition: media.objectPosition }} /> : null}
        <span className="section-hero-shade" aria-hidden="true" />
        <div className="section-heading-content"><p className="eyebrow">Tema {String(section.order).padStart(2, "0")}</p><h1>{section.name}</h1><p>{section.note ?? `${section.count} actividades de repaso relacionadas con este tema.`}</p></div>
        <small className="image-signature">Alejandro Castaño Medina</small>
      </div>
      <ActivityCatalog lockedSection={section.slug} />
    </main>
  );
}
