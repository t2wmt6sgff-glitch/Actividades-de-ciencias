# How Do Living Things Get Nutrients?

## Integration

This native activity keeps the existing catalogue ID `LUMI-1PCQ0H` and route `/actividad/how-do-living-things-get-nutrients/`. Its declarative content is in `data/native/how-do-living-things-get-nutrients.json`; the catalogue keeps the original Lumi link as provenance while serving the local native runner. The unrelated `VITAL FUNCTIONS` activity remains independent.

## Evidence and content choices

The supplied notes image is the primary school-level source. It covers autotrophic nutrition (carbon dioxide, water and mineral salts as inorganic nutrients; photosynthesis; chlorophyll capturing sunlight in chloroplasts; plants, algae and some bacteria), heterotrophic nutrition (organic nutrients from the environment, including carbohydrates, proteins and lipids; animals, fungi and many microorganisms), and cellular respiration in mitochondria in cells of both groups.

The original Lumi/H5P exercise contributes the oxygen route through lungs, blood, body cells and mitochondria; this survives as an ordering item. Nutrition types and examples are recast as matching/classification, and the original respiration and photosynthesis blanks become numbered diagrams. The old claim that only heterotrophs have mitochondria is explicitly corrected. A question about carnivorous plants and the personal/facetious example in the source are not carried into this 1º ESO activity.

The diagrams show the simplified photosynthesis inputs carbon dioxide and water, with light as energy, and outputs organic matter and oxygen. Mineral salts remain in the explanation as plant nutrients from the notes, but are not drawn as direct reactants of the simplified photosynthesis equation. The respiration diagram shows organic matter and oxygen entering, and carbon dioxide, water and usable energy leaving; the energy arrow is dashed and is identified as energy, not matter. These distinctions are checked against [OpenStax Biology 2e: Overview of Photosynthesis](https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis) and [OpenStax Biology 2e: Energy and Metabolism](https://openstax.org/books/biology-2e/pages/6-1-energy-and-metabolism).

## Implementation

`diagram-label` is a reusable native question kind. The custom SVG figures are authored as code in `components/native/diagram-question.tsx`; no third-party image asset is embedded, so there is no image license dependency. A proportional `viewBox` keeps arrows, numbers and organelles aligned while resizing. Solid teal arrows represent matter and dashed gold arrows represent energy; the numbered controls below the figure use native selects with visible labels, keyboard focus, and touch-sized targets. Feedback reports each slot separately.

No external image was reused. The cell animal and plant activities referenced during the audit are Educaplay resources rendered externally, not reusable in-repository native illustrations. `VITAL FUNCTIONS` remains a separate native activity.

## Text answer normalization

The original H5P exercise is external and its fill-in-the-blank runtime is not part of this repository, so its reported spacing issue cannot be reproduced in the current native runner. The shared native text grader already trims, collapses repeated whitespace, and ignores case (with exact normalized comparison). This redesign avoids long typed science terms by using selectable answers; tests retain direct coverage for whitespace normalization.
