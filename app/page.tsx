import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { HomeSearch } from "@/components/home-search";
import { TopicTile } from "@/components/topic-tile";
import { platforms } from "@/lib/catalog/data";
import { activeTopics, publicActivities } from "@/lib/catalog/selectors";

export default function Home() {
  return (
    <main id="main-content">
      <section className="home-intro site-container">
        <p className="eyebrow">Recursos educativos</p>
        <h1>Actividades de Ciencias</h1>
        <p className="home-subtitle">Recursos de repaso organizados por temas</p>
        <p className="home-description">Una recopilación de actividades de Ciencias creadas para estudiar y repasar, disponibles en {platforms.map((platform) => platform.name).join(" y ")}.</p>
        <p className="home-author">Actividades, recopilación y web creadas por <strong>Alejandro Castaño Medina</strong></p>
        <HomeSearch />
      </section>
      <section className="sections-section site-container" aria-labelledby="themes-heading">
        <div className="section-heading-row">
          <div><p className="eyebrow">Explorar por tema</p><h2 id="themes-heading">¿Qué quieres repasar?</h2></div>
          <Link href="/actividades" className="text-link">Ver catálogo completo <ArrowRight aria-hidden="true" /></Link>
        </div>
        <div className="section-grid">{activeTopics.map((topic) => <TopicTile key={topic.id} topic={topic} />)}</div>
        <div className="home-summary"><span>{publicActivities.length} actividades</span><span>{activeTopics.length} temas</span><span>{platforms.map((platform) => platform.name).join(" y ")}</span></div>
        <Link href="/actividades" className="primary-link-button">Ver todas las actividades <ArrowRight aria-hidden="true" /></Link>
      </section>
      <section className="about-teaser">
        <div className="site-container about-teaser-inner">
          <div className="about-icon" aria-hidden="true"><BookOpen /></div>
          <div><h2>Una biblioteca nacida del estudio</h2><p>Estas actividades fueron creadas a lo largo de distintos cursos para estudiar contenidos de Ciencias y compartirlos con docentes y estudiantes.</p><Link href="/sobre-el-proyecto" className="text-link">Conocer el proyecto <ArrowRight aria-hidden="true" /></Link></div>
          <p className="external-note"><ExternalLink aria-hidden="true" /> Los recursos se abren en sus plataformas originales.</p>
        </div>
      </section>
    </main>
  );
}
