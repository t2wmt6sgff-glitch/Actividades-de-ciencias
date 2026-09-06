import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { ActivityThumbnail } from "@/components/activity-thumbnail";
import { BackToResults } from "@/components/back-to-results";
import { activities, activityBySlug, formatCourse, getActivitySections, shouldShowOriginalTitle } from "@/lib/science-data";

export function generateStaticParams() { return activities.map((activity) => ({ slug: activity.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const activity = activityBySlug.get((await params).slug);
  return activity ? { title: `${activity.title} | Actividades de Ciencias`, description: activity.description } : {};
}

export default async function ActivityPage({ params }: { params: Promise<{ slug: string }> }) {
  const activity = activityBySlug.get((await params).slug);
  if (!activity) notFound();
  const related = getActivitySections(activity);
  return (
    <main id="main-content" className="detail-page site-container">
      <nav className="breadcrumbs" aria-label="Migas de pan"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><Link href="/actividades">Actividades</Link><span aria-hidden="true">/</span><span aria-current="page">{activity.title}</span></nav>
      <BackToResults />
      <article className="detail-layout">
        <div className="detail-main">
          <ActivityThumbnail activity={activity} />
          <div className="detail-badges"><span className={`platform-badge platform-${activity.platform.toLowerCase()}`}>{activity.platform}</span><span className="language-badge" lang={activity.language === "Inglés" ? "en" : "es"}>{activity.language}</span><span className="type-badge">{activity.type}</span></div>
          <h1 lang={activity.language === "Inglés" ? "en" : "es"}>{activity.title}</h1>
          <p className="detail-description">{activity.description}</p>
          {shouldShowOriginalTitle(activity) ? <p className="original-title"><strong>Título original:</strong> <span lang={activity.language === "Inglés" ? "en" : "es"}>{activity.originalTitle}</span></p> : null}
          <section className="detail-section"><h2>Temas relacionados</h2><div className="theme-links">{related.map((section) => <Link key={section.id} href={`/seccion/${section.slug}`}>{section.name}</Link>)}</div></section>
        </div>
        <aside className="detail-aside">
          <a className="detail-external-button" href={activity.url} target="_blank" rel="noopener noreferrer">Abrir actividad en {activity.platform} <ExternalLink aria-hidden="true" /></a>
          <p className="new-tab-note">La actividad se abrirá en una pestaña nueva en un sitio externo.</p>
          <section className="course-context" aria-labelledby="context-heading"><Info aria-hidden="true" /><div><h2 id="context-heading">Contexto de la actividad</h2><p><strong>Curso en que la creé:</strong> {formatCourse(activity.course)}.</p><p>Es un dato histórico personal; no indica el curso, la edad o el nivel para los que se recomienda la actividad.</p></div></section>
        </aside>
      </article>
    </main>
  );
}
