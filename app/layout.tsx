import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Actividades de Ciencias",
  description: "65 actividades de repaso de Ciencias organizadas por temas, disponibles en Wordwall y Educaplay.",
  authors: [{ name: "Alejandro Castaño Medina" }],
  creator: "Alejandro Castaño Medina",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es"><body><a className="skip-link" href="#main-content">Saltar al contenido</a><SiteHeader />{children}<SiteFooter /></body></html>
  );
}
