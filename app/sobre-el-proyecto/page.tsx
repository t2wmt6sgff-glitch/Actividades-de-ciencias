import Link from "next/link";
import { ArrowRight, ExternalLink, History, Layers3, PenLine } from "lucide-react";
import { imageCredits } from "@/lib/section-media";

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page site-container">
      <div className="page-heading about-heading"><p className="eyebrow">Sobre el proyecto</p><h1>Actividades creadas para estudiar y compartir</h1><p>Esta web reúne actividades de Ciencias y Conocimiento del Medio creadas por Alejandro Castaño Medina a lo largo de sus estudios, principalmente en Wordwall y Educaplay.</p></div>
      <section className="author-panel"><div className="about-section-icon" aria-hidden="true"><PenLine /></div><div><p className="eyebrow">Autoría</p><h2>Alejandro Castaño Medina</h2><p>Creador de las actividades y autor de esta web; responsable de su recopilación, organización y revisión.</p></div><span className="author-mark" aria-hidden="true">ACM</span></section>
      <div className="about-grid">
        <section><div className="about-section-icon" aria-hidden="true"><History /></div><h2>De una lista de enlaces a un catálogo</h2><p>El proyecto surgió al reunir las actividades de repaso para que una profesora pudiera encontrarlas y utilizarlas con facilidad. Cada recurso conserva su título, descripción, idioma, formato y enlace original.</p></section>
        <section><div className="about-section-icon" aria-hidden="true"><Layers3 /></div><h2>Organización por temas</h2><p>Las actividades se agrupan en 11 temas. Algunas pertenecen a dos secciones, pero siempre son un único recurso y tienen una sola ficha. El catálogo permite buscarlas y filtrarlas sin duplicarlas.</p></section>
      </div>
      <section className="course-explanation"><h2>Qué significa “Curso en que la creé”</h2><p>Ese dato indica el curso en el que estudié el tema o creé la actividad. Es un contexto histórico personal. No indica la edad, el nivel o el curso para los que se recomienda el recurso. Cuando no recuerdo el curso con certeza, la ficha lo dice expresamente.</p></section>
      <section className="external-explanation"><ExternalLink aria-hidden="true" /><div><h2>Actividades en sitios externos</h2><p>Los recursos se abren en Wordwall o Educaplay, en una pestaña nueva. Esta web no incrusta las actividades ni depende de funciones de pago de esas plataformas.</p></div></section>
      <section className="image-credits" id="creditos-imagenes" aria-labelledby="credits-heading">
        <div className="credits-heading"><p className="eyebrow">Imágenes de las secciones</p><h2 id="credits-heading">Créditos y licencias</h2><p>Las imágenes se reutilizan como referencia visual de cada tema. Todas las imágenes procedentes de Magnific emplean la misma licencia gratuita con atribución indicada en el certificado aportado.</p></div>
        <div className="credits-list">
          {imageCredits.map((credit) => <article className="credit-item" key={credit.section}>
            <h3>{credit.section}</h3>
            <p><strong>Autoría:</strong> {credit.author}</p>
            <p><strong>Procedencia:</strong> {credit.url ? <a href={credit.url} target="_blank" rel="noopener noreferrer">{credit.source}<ExternalLink aria-hidden="true" /></a> : credit.source}</p>
            <p><strong>Licencia:</strong> {credit.license}</p>
          </article>)}
        </div>
        <p className="magnific-attribution"><a href="https://www.magnific.com" target="_blank" rel="noopener noreferrer">designed by rawpixel.com - Magnific.com</a></p>
      </section>
      <div className="about-cta"><p>Explora las 65 actividades y combina tema, idioma, tipo y plataforma.</p><Link href="/actividades" className="primary-link-button">Abrir el catálogo <ArrowRight aria-hidden="true" /></Link></div>
    </main>
  );
}
