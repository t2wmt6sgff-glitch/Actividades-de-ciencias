import {
  ArrowDownUp,
  BookOpenCheck,
  CircleHelp,
  Columns3,
  Group,
  ListChecks,
  MapPinned,
  MousePointerClick,
  Network,
  Puzzle,
  Rows3,
  Tags,
} from "lucide-react";
import type { Activity } from "@/lib/science-data";
import type { Section } from "@/lib/science-data";
import { sectionById } from "@/lib/science-data";
import { getSectionMedia } from "@/lib/section-media";

const iconByType = {
  "Cuestionario": CircleHelp,
  "Mapa interactivo": MapPinned,
  "Clasificar por grupos": Group,
  "Relacionar columnas": Columns3,
  "Diagrama con etiquetas": Tags,
  "Completar frases": BookOpenCheck,
  "Relacionar grupos": Network,
  "Emparejar": Puzzle,
  "Juego de preguntas": MousePointerClick,
  "Ordenar secuencia": ArrowDownUp,
  "Concurso de preguntas": ListChecks,
  "Ordenar palabras": Rows3,
} as const;

export function ActivityThumbnail({ activity, section: sectionOverride }: { activity: Activity; section?: Section }) {
  const section = sectionOverride ?? sectionById.get(activity.primarySectionId);
  const media = getSectionMedia(section);
  const Icon = iconByType[activity.type as keyof typeof iconByType] ?? BookOpenCheck;
  return (
    <div className={`activity-thumbnail section-theme-${section?.order ?? 1}`} aria-hidden="true">
      {media ? <img src={media.src} alt="" style={{ objectPosition: media.objectPosition }} /> : null}
      <div className="thumbnail-shade" />
      <div className="thumbnail-icon"><Icon /></div>
      <span>{section?.name}</span>
      <small className="image-signature">Alejandro Castaño Medina</small>
    </div>
  );
}
