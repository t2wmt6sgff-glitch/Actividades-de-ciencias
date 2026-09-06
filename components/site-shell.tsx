"use client";

import Link from "next/link";
import { Menu, Microscope, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/actividades", label: "Actividades" },
  { href: "/sobre-el-proyecto", label: "Sobre el proyecto" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-container header-inner">
        <Link href="/" className="brand" aria-label="Actividades de Ciencias, inicio">
          <span className="brand-mark" aria-hidden="true"><Microscope /></span>
          <span>Actividades de Ciencias</span>
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {nav.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="mobile-menu-button" variant="outline" size="icon-lg" aria-label="Abrir menú">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="mobile-nav-sheet" showCloseButton={false}>
            <SheetHeader>
              <SheetTitle>Actividades de Ciencias</SheetTitle>
              <SheetDescription>Navegación principal</SheetDescription>
            </SheetHeader>
            <SheetClose className="sheet-close-button" aria-label="Cerrar menú"><X /></SheetClose>
            <nav className="mobile-nav" aria-label="Navegación móvil">
              {nav.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div>
          <strong>Actividades de Ciencias</strong>
          <p>Actividades, recopilación y web creadas por <strong>Alejandro Castaño Medina</strong>.</p>
        </div>
        <nav aria-label="Enlaces del pie">
          <Link href="/actividades">Catálogo</Link>
          <Link href="/sobre-el-proyecto">Sobre el proyecto</Link>
          <Link href="/sobre-el-proyecto#creditos-imagenes">Créditos</Link>
        </nav>
        <p className="footer-note"><span className="footer-signature">Alejandro Castaño Medina</span> Datos revisados el 5 de septiembre de 2026. Las actividades se abren en Wordwall o Educaplay.</p>
      </div>
    </footer>
  );
}
