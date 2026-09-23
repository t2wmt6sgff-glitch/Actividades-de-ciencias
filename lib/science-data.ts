/**
 * Temporary compatibility adapter for the current Science UI.
 *
 * The active source of truth is data/catalogo-actividades.xlsx, represented at
 * runtime by data/generated/catalog.json. Phase 2 can replace this legacy shape
 * without changing the catalog contract introduced in Phase 1.
 */

import { activities as catalogActivities, qualityIssues as catalogQualityIssues, topics } from "@/lib/catalog/data";
import { activityTypeById, platformById, subjectById, topicById } from "@/lib/catalog/indexes";
import type { ExternalSource } from "@/lib/catalog/schema";

export type Section = {
  id: string;
  order: number;
  name: string;
  slug: string;
  originalName: string;
  historicalCourse: string;
  note?: string;
  declaredCount: number;
  count: number;
};

export type Activity = {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  platform: string;
  url: string;
  canonicalUrl: string;
  language: string;
  type: string;
  course: string;
  subject: string;
  tags: string;
  keywords: string;
  slug: string;
  status: string;
  verifiedTitle: string;
  verifiedAt: string;
  sectionIds: string[];
  primarySectionId: string;
};

const languageLabels: Record<string, string> = {
  es: "Español",
  en: "Inglés",
  fr: "Francés",
};

const linkStatusLabels: Record<string, string> = {
  unverified: "Requiere revisión",
  verified: "Verificado",
  limited: "Accesible pero información limitada",
  redirected: "Redirección problemática",
  broken: "No accesible",
};

const legacySectionIdByTopicId = new Map(
  topics.map((topic) => [topic.id, topic.legacy?.sourceId ?? topic.id]),
);

const baseSections = topics.map((topic) => ({
  id: topic.legacy?.sourceId ?? topic.id,
  order: topic.order,
  name: topic.name,
  slug: topic.slug,
  originalName: topic.legacy?.originalName ?? topic.name,
  historicalCourse: topic.legacy?.historicalCourse ?? "Curso de origen desconocido",
  note: topic.description,
  declaredCount: topic.legacy?.declaredCount ?? 0,
}));

function isPublishedExternal(
  activity: (typeof catalogActivities)[number],
): activity is (typeof catalogActivities)[number] & { source: ExternalSource } {
  return activity.publicationStatus === "published" && activity.source.kind === "external";
}

export const activities: Activity[] = catalogActivities
  .filter(isPublishedExternal)
  .map((activity) => {
    const source = activity.source;
    const sectionIds = activity.topicIds.map((topicId) => legacySectionIdByTopicId.get(topicId) ?? topicId);
    const subject = subjectById.get(activity.primarySubjectId);
    return {
      id: activity.id,
      title: activity.title,
      originalTitle: activity.sourceTitle ?? activity.title,
      description: activity.description,
      platform: platformById.get(source.platformId)?.name ?? source.platformId,
      url: source.url,
      canonicalUrl: source.canonicalUrl ?? source.url,
      language: languageLabels[activity.language] ?? activity.language,
      type: activityTypeById.get(activity.typeId)?.name ?? activity.typeId,
      course: activity.originCourseLabel ?? "Curso de origen desconocido",
      subject: activity.legacy?.subjectLabel ?? subject?.name ?? activity.primarySubjectId,
      tags: activity.tags.join(", "),
      keywords: activity.keywords.join(", "),
      slug: activity.slug,
      status: activity.legacy?.linkStatusLabel ?? linkStatusLabels[source.linkStatus] ?? source.linkStatus,
      verifiedTitle: source.titleVerified ? "Sí" : "No",
      verifiedAt: source.lastVerifiedAt ?? "",
      sectionIds,
      primarySectionId: legacySectionIdByTopicId.get(activity.primaryTopicId ?? "") ?? sectionIds[0],
    };
  });

const sectionCounts = new Map<string, number>();
for (const activity of activities) {
  for (const sectionId of activity.sectionIds) {
    sectionCounts.set(sectionId, (sectionCounts.get(sectionId) ?? 0) + 1);
  }
}

export const sections: Section[] = baseSections.map((section) => ({
  ...section,
  count: sectionCounts.get(section.id) ?? 0,
}));

export const verifiedAt = activities
  .map((activity) => activity.verifiedAt)
  .filter(Boolean)
  .sort()
  .at(-1) ?? "";

export const qualityIssues = catalogQualityIssues.map((issue) => ({
  "ID de actividad": issue.activityId,
  URL: issue.url,
  "Tipo de incidencia": issue.issueType,
  Explicación: issue.explanation,
  "Acción recomendada": issue.recommendedAction,
}));

function counts(values: string[]) {
  return values.reduce<Record<string, number>>((result, value) => {
    result[value] = (result[value] ?? 0) + 1;
    return result;
  }, {});
}

const multiSectionActivities = activities.filter((activity) => activity.sectionIds.length > 1);

export const summary = {
  activities: activities.length,
  sections: sections.length,
  relations: activities.reduce((total, activity) => total + activity.sectionIds.length, 0),
  multiSectionActivities: multiSectionActivities.length,
  platformCounts: counts(activities.map((activity) => activity.platform)),
  languageCounts: counts(activities.map((activity) => activity.language)),
  typeCounts: counts(activities.map((activity) => activity.type)),
  courseCounts: counts(activities.map((activity) => activity.course)),
  multiSectionIds: multiSectionActivities.map((activity) => activity.id),
};

export const sectionById = new Map(sections.map((section) => [section.id, section]));
export const sectionBySlug = new Map(sections.map((section) => [section.slug, section]));
export const activityBySlug = new Map(activities.map((activity) => [activity.slug, activity]));

export const activityTypes = Object.entries(summary.typeCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

export function getActivitySections(activity: Activity) {
  return activity.sectionIds
    .map((id) => sectionById.get(id))
    .filter((section): section is Section => Boolean(section));
}

export function formatCourse(course: string) {
  return course === "Curso de origen desconocido" ? "no lo recuerdo con certeza" : course;
}

export function shouldShowOriginalTitle(activity: Activity) {
  const simplify = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  return simplify(activity.title) !== simplify(activity.originalTitle);
}

// Used by future phases and kept here to make the adapter's dependency explicit.
export const topicForLegacySection = (sectionId: string) =>
  topics.find((topic) => topic.legacy?.sourceId === sectionId) ?? topicById.get(sectionId);
