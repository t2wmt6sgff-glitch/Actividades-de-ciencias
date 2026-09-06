import type { Section } from "@/lib/science-data";

export type SectionMedia = {
  src: string;
  alt: string;
  objectPosition?: string;
};

const sectionMediaById: Record<string, SectionMedia> = {
  "SEC-01": {
    src: "/sections/historia.webp",
    alt: "Biblia antigua, brújula y mapa histórico sobre una mesa",
    objectPosition: "center 58%",
  },
  "SEC-02": {
    src: "/sections/alimentacion.webp",
    alt: "Platos con verduras, legumbres, frutos secos y otros alimentos",
  },
  "SEC-03": {
    src: "/sections/politica-y-organizacion-de-espana.webp",
    alt: "Una persona deposita un sobre en una urna ante la bandera de España",
  },
  "SEC-04": {
    src: "/sections/sociedad-y-poblacion.webp",
    alt: "Figuras de personas distribuidas sobre un mapa de Europa",
  },
  "SEC-05": {
    src: "/sections/medio-ambiente-y-sostenibilidad.webp",
    alt: "Manos sostienen símbolos de la Tierra, el agua, la energía y las plantas",
  },
  "SEC-06": {
    src: "/sections/la-transicion-espanola.webp",
    alt: "Proclamación de Juan Carlos I como rey de España en 1975",
    objectPosition: "center 38%",
  },
  "SEC-07": {
    src: "/sections/derechos-y-deberes.webp",
    alt: "Puños alzados de distintos tonos de piel como símbolo de igualdad",
    objectPosition: "center 50%",
  },
  "SEC-08": {
    src: "/sections/union-europea.webp",
    alt: "Estrellas de la bandera de la Unión Europea sobre un mapa de Europa",
  },
  "SEC-09": {
    src: "/sections/reproduccion-humana.webp",
    alt: "Ilustración científica de espermatozoides aproximándose a un óvulo",
  },
  "SEC-10": {
    src: "/sections/cuerpo-humano.webp",
    alt: "Ilustración anatómica del esqueleto, los órganos y el sistema circulatorio",
    objectPosition: "center 42%",
  },
  "SEC-11": {
    src: "/sections/relieve-y-geografia.webp",
    alt: "Brújula sobre un mapa físico y político de Europa",
  },
};

export function getSectionMedia(section?: Pick<Section, "id">) {
  return section ? sectionMediaById[section.id] : undefined;
}

const magnificLicense = "Licencia gratuita de Magnific para uso comercial con atribución, según el certificado aportado.";

export const imageCredits = [
  {
    section: "Historia",
    author: "rawpixel.com",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/vieja-biblia-mesa-madera_3012291.htm",
    license: magnificLicense,
  },
  {
    section: "Alimentación",
    author: "jcomp",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/plato-tazon-fuente-buda-verduras-legumbres-vista-superior_13807905.htm",
    license: magnificLicense,
  },
  {
    section: "Política y organización de España",
    author: "Magnific",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/persona-poniendo-sobre-cuadro-votacion-fondo-bandera-espanola_5866126.htm",
    license: magnificLicense,
  },
  {
    section: "Sociedad y población",
    author: "Magnific",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/vista-superior-comunidad-estilo-papel-mapa_25403800.htm",
    license: magnificLicense,
  },
  {
    section: "Medio ambiente y sostenibilidad",
    author: "rawpixel.com",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/presentando-mano-remix-medio-ambiente-sostenible-tierra_17602071.htm",
    license: magnificLicense,
  },
  {
    section: "La Transición española",
    author: "Autoría no indicada en la documentación aportada",
    source: "EL PAÍS",
    url: "https://elpais.com/elpais/2006/02/07/album/1139297868_910215.html",
    license: "La documentación aportada no especifica la licencia de reutilización.",
  },
  {
    section: "Derechos y deberes",
    author: "Magnific",
    source: "Magnific",
    url: "https://www.magnific.com/es/vector-gratis/detener-concepto-racismo_8850000.htm",
    license: magnificLicense,
  },
  {
    section: "Unión Europea",
    author: "Autoría no indicada en la documentación aportada",
    source: "MARCA",
    url: "https://www.marca.com/futbol/primera-division/2025/05/10/bandera-union-europea-lado-marcadores-retransmision-partidos-futbol.html",
    license: "La documentación aportada no especifica la licencia de reutilización.",
  },
  {
    section: "Reproducción humana",
    author: "Autoría no indicada en la documentación aportada",
    source: "Archivo facilitado para el proyecto",
    url: null,
    license: "No se aportó información de procedencia o licencia para esta imagen.",
  },
  {
    section: "Cuerpo humano",
    author: "brgfx",
    source: "Magnific",
    url: "https://www.magnific.com/es/vector-gratis/estructura-anatomica-cuerpos-humanos_26353260.htm",
    license: magnificLicense,
  },
  {
    section: "Relieve y geografía",
    author: "snowing",
    source: "Magnific",
    url: "https://www.magnific.com/es/foto-gratis/ompass-mapa-turistico-enfoque-aguja-brujula_1203158.htm",
    license: magnificLicense,
  },
] as const;
