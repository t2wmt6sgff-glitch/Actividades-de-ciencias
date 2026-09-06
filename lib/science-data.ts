import data from "./science-data.generated.json";

export type Section = (typeof data.sections)[number];
export type Activity = (typeof data.activities)[number];

export const sections = data.sections as Section[];
export const activities = data.activities as Activity[];
export const summary = data.summary;
export const qualityIssues = data.qualityIssues;
export const verifiedAt = data.verifiedAt;

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
