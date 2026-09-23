# Catálogo multiasignatura: flujo de datos de Fase 1

La web pública sigue mostrando Actividades de Ciencias y conserva sus rutas actuales. Esta fase cambia la infraestructura de datos, no el producto visible.

## Fuente de verdad

`data/catalogo-actividades.xlsx` es la fuente editable activa. `data/Actividades_Ciencias_para_Sites.xlsx` se conserva intacto como origen histórico de la migración.

El libro general contiene:

- `ASIGNATURAS`: configuración y presentación de cada asignatura.
- `TEMAS`: temas asociados a una asignatura, con assets y metadatos legados cuando existen.
- `MIGRACIÓN_TEMAS`: mapa auditable de los once IDs `SEC-xx` a los nuevos `TopicId`.
- `TIPOS_ACTIVIDAD`: vocabulario de tipos estable.
- `PLATAFORMAS`: plataformas externas y hosts conocidos.
- `ACTIVIDADES`: entidad única, fechas, estado editorial y origen external/native; incluye los campos mínimos del motor nativo aunque permanezcan vacíos en las 65 filas externas actuales.
- `ACTIVIDAD_TEMA`: relaciones muchos-a-muchos.
- `CRÉDITOS`: autoría, procedencia y licencia de assets.
- `CONTROL_DE_CALIDAD`: incidencias que no deben perderse durante la generación.
- `INFORMACIÓN`: reglas del libro y procedencia.

Las celdas multivalor usan ` | ` como separador. Las etiquetas y palabras clave se convierten a arrays en el JSON.

## Archivos generados

`scripts/generate-catalog.py` lee el Excel, valida sus relaciones y escribe de manera determinista:

- `data/generated/catalog.json`;
- `data/generated/generation-report.json`.

El informe incluye la huella SHA-256 del libro, recuentos, distribución por plataforma e idioma, actividades multitema, errores y avisos. No contiene un timestamp de ejecución porque impediría comprobar un diff limpio sin aportar una fecha editorial válida.

Los JSON son artefactos. No deben editarse a mano.

## Comandos

Instalación:

```bash
npm ci
python -m pip install --requirement requirements.txt
```

Mantenimiento normal:

```bash
npm run catalog:generate
npm run catalog:validate
npm test
npm run lint
```

Repetir o comprobar la migración inicial:

```bash
npm run catalog:migrate
npm run catalog:migrate:check
```

`catalog:migrate` reconstruye `data/catalogo-actividades.xlsx` desde el libro histórico y sobrescribe el libro general. No debe usarse después de añadir nuevas actividades directamente al catálogo general. `catalog:migrate:check` solo demuestra la reproducibilidad del estado inicial de Fase 1.

La comprobación de migración compara semánticamente el libro versionado con uno temporal: orden y nombres de hojas, dimensiones, valores, tipos y fórmulas de celdas, estilos, anchos y altos, filtros, paneles inmovilizados y propiedades deliberadas del documento. Un XLSX es un contenedor ZIP/XML, por lo que diferencias irrelevantes de serialización o metadatos ZIP se diagnostican pero no provocan un fallo si el libro lógico es idéntico.

## Contrato y validación

`lib/catalog/schema.ts` define el contrato TypeScript explícito. `data.ts` carga el catálogo e `indexes.ts` ofrece índices por ID y slug.

El generador bloquea, entre otros casos:

- IDs o slugs duplicados;
- colisiones de slugs históricos;
- referencias huérfanas;
- asignatura o tema principal fuera de sus arrays;
- plataformas, tipos o idiomas inválidos;
- actividades publicadas sin fecha;
- fuentes externas o nativas incompletas;
- cronologías incoherentes;
- URL canónicas o recursos de plataforma duplicados;
- imágenes sin crédito.

Los avisos no bloquean la generación. El estado inicial avisa de 65 fechas de creación desconocidas, el enlace limitado `EP-28734734` y dos actividades distintas que comparten el título “The European Union”.

## Compatibilidad temporal

`lib/science-data.ts` adapta el catálogo general a la forma que esperan los componentes actuales. Convierte:

- `TopicId` a los IDs históricos `SEC-xx`;
- `es` y `en` a `Español` e `Inglés`;
- IDs de plataforma y tipo a sus nombres públicos;
- arrays de etiquetas a las cadenas usadas por el buscador actual;
- estados de enlace generales a las etiquetas existentes.

La UI no importa el fixture antiguo. `tests/fixtures/science-data.legacy.json` solo permite demostrar paridad durante esta migración.

## Añadir datos en fases posteriores

Una nueva asignatura se añadirá mediante filas en `ASIGNATURAS`, `TEMAS`, `ACTIVIDADES` y `ACTIVIDAD_TEMA`, más créditos cuando use imágenes. En Fase 1 todavía no se añaden asignaturas ni se modifican rutas, navegación, búsqueda o diseño.
