import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ActivityThumbnail } from "@/components/activity-thumbnail";
import type { Activity, Section } from "@/lib/science-data";
import { getActivitySections } from "@/lib/science-data";

export function ActivityCard({ activity, currentSection }: { activity: Activity; currentSection?: Section }) {
  const related = getActivitySections(activity);
  const primary = currentSection ?? related[0];
  return (
    <article className="activity-card">
      <Link className="thumbnail-link" href={`/actividad/${activity.slug}`} aria-label={`Ver información sobre ${activity.title}`}>
        <ActivityThumbnail activity={activity} section={currentSection} />
      </Link>
      <div className="card-content">
        <div className="badge-row">
          <span className={`platform-badge platform-${activity.platform.toLowerCase()}`}>{activity.platform}</span>
          <span className="language-badge" lang={activity.language === "Inglés" ? "en" : "es"}>{activity.language}</span>
        </div>
        <h3><Link href={`/actividad/${activity.slug}`} lang={activity.language === "Inglés" ? "en" : "es"}>{activity.title}</Link></h3>
        <p className="card-description">{activity.description}</p>
        <dl className="card-meta">
          <div><dt>Tipo</dt><dd>{activity.type}</dd></div>
          <div><dt>Tema</dt><dd>{primary?.name}{related.length > 1 ? <span className="more-themes"> +{related.length - 1} tema</span> : null}</dd></div>
        </dl>
        <a className="external-button" href={activity.url} target="_blank" rel="noopener noreferrer">
          Abrir actividad <ExternalLink aria-hidden="true" />
          <span className="sr-only"> en {activity.platform}; se abre en una pestaña nueva</span>
        </a>
      </div>
    </article>
  );
}
