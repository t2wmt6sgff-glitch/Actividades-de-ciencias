# Actividades de Ciencias

Web educativa creada por Alejandro Castaño Medina. Reúne 65 actividades propias de Ciencias y Conocimiento del Medio, organizadas en 11 secciones y publicadas originalmente en Wordwall y Educaplay.

## Tecnología

- Next.js y React para el código fuente.
- Exportación estática a HTML, CSS y JavaScript.
- Sin base de datos, servidor, credenciales ni servicios de ChatGPT Sites.
- La carpeta de producción generada es `out/`.

## Requisitos

- Node.js 20.9 o posterior. Se recomienda Node.js 22.
- npm.

## Desarrollo local

```bash
npm ci
npm run build
npm run dev
```

La dirección local predeterminada es `http://localhost:5173`. El servidor de desarrollo muestra la exportación estática generada en `out/`.

## Compilación de producción

```bash
npm ci
npm run build
```

Next.js genera la web estática completa en `out/`. Puede servirse localmente con:

```bash
npm start
```

## Comprobaciones

```bash
npm test
```

La prueba compila la web y comprueba los recuentos, relaciones, rutas, imágenes, enlaces externos y archivos exportados.

## Despliegue en Hostinger desde GitHub

En hPanel, añade una web mediante **Deploy Web App** y selecciona este repositorio privado mediante **Connect with GitHub**.

Usa estos valores si Hostinger no los detecta automáticamente:

- Versión de Node.js: `22.x`
- Comando de instalación: `npm ci`
- Comando de compilación: `npm run build`
- Directorio de salida: `out`
- Archivo de entrada: ninguno; el resultado es estático

No se necesitan variables de entorno.

También puedes ejecutar `npm run build` en un ordenador y subir el contenido de `out/` al directorio `public_html` de un hosting web tradicional.

## Datos y recursos

- `data/Actividades_Ciencias_para_Sites.xlsx`: fuente tabular original.
- `lib/science-data.generated.json`: datos usados por la web.
- `public/sections/`: once imágenes temáticas reutilizadas por las actividades.
- La página **Sobre el proyecto** contiene los créditos y las licencias de las imágenes.

No se incluye una licencia para el código del repositorio.
