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
- Python 3.12 y las dependencias de `requirements.txt` para regenerar el catálogo.

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
npm run catalog:generate
npm run catalog:validate
npm test
npm run lint
```

Las pruebas compilan la web y comprueban el contrato, la migración, los recuentos, las relaciones, las rutas, las imágenes, los enlaces externos y los archivos exportados.

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

- `data/Actividades_Ciencias_para_Sites.xlsx`: fuente histórica de Ciencias. No se modifica.
- `data/catalogo-actividades.xlsx`: fuente de verdad editable del catálogo general.
- `data/generated/catalog.json`: catálogo generado usado por la aplicación.
- `data/generated/generation-report.json`: huella, recuentos y avisos de cada generación.
- `tests/fixtures/science-data.legacy.json`: fixture de regresión; no es una fuente activa.
- `public/sections/`: once imágenes temáticas reutilizadas por las actividades.
- La página **Sobre el proyecto** contiene los créditos y las licencias de las imágenes.

Después de editar el libro general, ejecuta:

```bash
python -m pip install --requirement requirements.txt
npm run catalog:generate
npm run catalog:validate
```

No edites los JSON generados a mano. CI vuelve a generarlos y falla si no coinciden con el Excel. La migración inicial desde el libro histórico puede repetirse con `npm run catalog:migrate`; sobrescribe el libro general y no forma parte del mantenimiento habitual.

El esquema, las hojas y el adaptador temporal de compatibilidad están documentados en [`docs/catalogo-multiasignatura.md`](docs/catalogo-multiasignatura.md).

No se incluye una licencia para el código del repositorio.
