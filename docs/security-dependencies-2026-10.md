# Dependencias: revisión del 4 de octubre de 2026

El upstream partía de `dd2f8b33430226f61b4e18b4aaaff1961abc92c8` y el fork de Hostinger de `58c34d0847e748e8beaf9084aa0356bb40bdd868`. Sus árboles y los blobs de ambos manifests eran idénticos. La causa era conservar versiones directas fijadas y resoluciones transitivas anteriores a los avisos, no una modificación del fork.

## Cambios

Solo se actualizan cuatro entradas de `package.json` y las resoluciones necesarias de `package-lock.json`, mediante npm. No se usa `audit fix --force`, ni overrides, ni se cambia React, el catálogo, las actividades, el Worker o la configuración de Next.

| Paquete | Antes | Después | Origen / uso |
| --- | --- | --- | --- |
| next | 16.2.6 | 16.3.8 | Directa de producción; compilación del sitio estático |
| eslint-config-next | 16.2.6 | 16.3.8 | Directa de desarrollo; lint |
| serve | 14.2.5 | 14.2.6 | Directa de producción; utilidad de servidor estático, no usada por el Worker ni `npm start` |
| vite | 8.0.13 | 8.3.2 | Directa de desarrollo; preview local |
| sharp | 0.34.5 | 0.35.5 | Opcional de Next; procesamiento de imágenes en Node |
| brace-expansion | 1.1.14 / 5.0.6 | 1.1.21 / 5.0.12 | Transitiva de minimatch; serve-handler y herramientas de lint |
| js-yaml | 4.1.1 | 4.3.2 | Transitiva de @eslint/eslintrc; desarrollo |
| browserslist | 4.28.2 | 4.29.3 | Transitiva de @babel/helper-compilation-targets; desarrollo |
| @babel/core | 7.29.0 | 7.29.7 | Transitiva de eslint-plugin-react-hooks; desarrollo |
| baseline-browser-mapping | 2.10.30 | 2.11.27 | Transitiva de Next y Browserslist; build |
| postcss | 8.4.31 / 8.5.14 | 8.5.23 / 8.5.28 | Next y Tailwind usan 8.5.23; Vite introduce 8.5.28; build |
| nanoid | 3.3.12 | 3.3.19 | Transitiva de PostCSS; build |
| ajv (rama serve) | 8.12.0 | 8.18.0 | Fijada por serve; ajv 6.15.0 de ESLint no está en este rango afectado |
| serve-handler | 6.1.6 | 6.1.7 | Fijada por serve; corrige su minimatch 3.1.2 a 3.1.5 |

Next 16.3.8 y eslint-config-next 16.3.8 eran los tags `latest` estables de npm en esta revisión. Next ahora solicita `sharp ^0.35.4` y PostCSS 8.5.23. El aviso adicional [GHSA-q2hr-2g5m-vwhr](https://github.com/advisories/GHSA-q2hr-2g5m-vwhr) requiere brace-expansion 1.1.21 / 5.0.12; 1.1.20 / 5.0.11 no bastan.

La auditoría inicial agrupaba 19 paquetes afectados (1 crítico, 15 altos, 2 moderados, 1 bajo) y 41 avisos únicos (3 críticos, 25 altos, 12 moderados, 1 bajo). Los contadores de paquetes y de avisos son métricas distintas y pueden diferir del escáner de Hostinger.

## Alcance real y límites

Se conserva `output: "export"`, `trailingSlash: true` e `images.unoptimized: true`. La salida sigue siendo `out/`. No hay imports de `next/og`, `next/image`, Server Actions ni servidor Next dentro de `server/index.mjs` o `worker/index.mjs`; el servidor histórico usa `node:http` y el Worker APIs web y el catálogo estático.

| Aviso | Parche de la rama 16 | Alcance en la arquitectura estática del repositorio |
| --- | --- | --- |
| [GHSA-vcvr-r3jv-pc5j](https://github.com/vercel/next.js/security/advisories/GHSA-vcvr-r3jv-pc5j), next/og RCE | 16.3.6 | Sin import ni ruta ImageResponse; no recibe entradas del público |
| [GHSA-2xp9-vwfh-vxw4](https://github.com/vercel/next.js/security/advisories/GHSA-2xp9-vwfh-vxw4), optimización AVIF RCE | 16.3.3 | No existe API de optimización de imágenes en `out/` |
| [GHSA-p293-qw3h-jr36](https://github.com/vercel/next.js/security/advisories/GHSA-p293-qw3h-jr36), Windows RCE | 16.3.3 | No se ejecuta un servidor Next público sobre Windows |

Los demás avisos iniciales de Next relativos a Server Actions, rewrites, proxy, caché y metadatos necesitan funciones de servidor ausentes aquí. Sharp tampoco procesa uploads públicos: el Worker verifica bytes y el importador de GitHub decodifica con Pillow. Las herramientas de CSS, Babel, YAML y glob trabajan con archivos y configuración del repositorio, no con peticiones públicas. Esto limita la exposición; no justifica conservar versiones corregibles.

**Pendiente sin parche publicado:** [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), alto, CVSS 7.5. La última versión de braces sigue siendo 3.0.3 y GitHub indica «Patched versions: None». Ruta: `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. Toda esta ruta es dev-only. Patrones profundamente anidados no confiables podrían interrumpir Node durante lint; no se ejecuta en el sitio estático ni en el Worker. Mantener el lint de CI limitado a este repositorio y revisar los cambios de configuración/globs. No se sustituye por un fork sin verificar ni se acepta el downgrade mayor de Next 14 que propone npm como solución indirecta.

Resultado: `npm audit --omit=dev --json` devuelve **0 vulnerabilidades**. `npm audit --json` sigue devolviendo **5 altas**, correspondientes a ese único aviso y sus cuatro padres (`braces`, `micromatch`, `fast-glob`, `@next/eslint-plugin-next`, `eslint-config-next`); su código de salida es 1. No es una auditoría completa limpia.

Además, la [lista oficial de Next](https://github.com/vercel/next.js/security/advisories) contiene avisos de septiembre con versiones parcheadas aún expresadas como `16.3.?` y rangos abiertos, entre ellos GHSA-cjq9-62q9-8jv4, GHSA-39w2-rjm5-chcv, GHSA-4jqv-mc3x-m676, GHSA-mcj8-r9mp-w47p y GHSA-f87g-xv8r-7p7x. No se afirma que npm audit certifique su corrección. Sus rutas requieren optimización remota, `next dev`, caché de servidor o rutas dinámicas de imágenes, ausentes aquí. Tampoco se habilitan Cache Components/Draft Mode: GHSA-h694-7cp9-m8p3 y GHSA-3w37-wq28-93x7 requieren esas funciones. Reconsultar los rangos publicados en próximas actualizaciones.

## Validación y publicación

Usar Node 22 actualizado (Vite requiere al menos 22.12 en esa rama), npm y Python con `requirements.txt`. Verificar antes de publicar:

```sh
npm ci
npm run catalog:migrate:check
npm run catalog:generate
npm run catalog:validate
git diff --exit-code -- data/generated data/catalogo-actividades.xlsx
npm test
npx tsc --noEmit
npm run lint
npm run build
npx playwright install --with-deps chromium
npm run test:browser
npm audit --json
npm audit --omit=dev --json
```

`validate.yml` ejecuta catálogo, tests (incluidos Worker, nativas y export), lint, TypeScript y navegador en escritorio/iPad/móvil. `deploy-admin-worker.yml` conserva Node 22 y Wrangler 4.143.0; los secretos y `wrangler.jsonc` no se modifican.

El cambio debe entrar primero en main canónico mediante PR y CI verde. Después fusionar ese main en el main del fork conservando sus commits anteriores, sin reescribir su historia, y comprobar que package.json y package-lock.json tienen exactamente los mismos blobs. Aunque los metadatos declaraban `push: true`, la API rechazó crear un PR en el fork con `403: Resource not accessible by integration`: esta conexión no permite preparar allí la escritura. La fusión local con su main sí está probada, sin conflictos y con el mismo árbol resultante que el cambio canónico. `sync-fork.yml` ya estaba eliminado: las últimas sincronizaciones eran merges de upstream y no hay automatización vigente demostrada. No asumir los intervalos antiguos del README.

Sin acceso a hPanel no se puede verificar la rama configurada, comandos de instalación/build, retención de node_modules, caché ni origen del escaneo. Hostinger debe compilar el commit sincronizado con una instalación limpia y servir `out/`; los manifests actualizados permiten la misma corrección tanto si escanea el lockfile como una instalación nueva. Si persisten alertas antiguas, contrastar SHA del fork y del deploy, limpiar la caché de build/node_modules y solicitar un nuevo escaneo. El aviso dev-only de braces puede seguir apareciendo; no atribuirlo a caché.
