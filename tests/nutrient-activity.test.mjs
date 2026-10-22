import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { validateContent, createAttempt, isComplete, gradeQuestion, correctAnswer, normalizeText } from '../lib/native/core.mjs';
import { rankSearchEntries } from '../lib/catalog/search-core.mjs';

const content = validateContent(JSON.parse(await readFile('data/native/how-do-living-things-get-nutrients.json', 'utf8')));
const catalog = JSON.parse(await readFile('data/generated/catalog.json', 'utf8'));
const search = JSON.parse(await readFile('data/generated/search-index.json', 'utf8'));

test('el catálogo conserva la ruta, el curso y los metadatos buscables', () => {
  const activity = catalog.activities.find(item => item.id === content.id);
  assert.equal(activity.slug, 'how-do-living-things-get-nutrients');
  assert.equal(activity.originCourseLabel, '1.º ESO');
  assert.equal(activity.source.kind, 'native');
  assert.equal(activity.source.native.contentPath, 'data/native/how-do-living-things-get-nutrients.json');
  assert.ok(rankSearchEntries(search.entries, 'photosynthesis').some(result => result.id === content.id));
  assert.ok(rankSearchEntries(search.entries, 'mitochondrion').some(result => result.id === content.id));
});

test('actividad de nutrición usa el ID canónico y tipos de pregunta compatibles', () => {
  assert.equal(content.id, 'LUMI-1PCQ0H');
  assert.equal(content.questions.length, 8);
  assert.deepEqual(content.questions.map(question => question.kind), [
    'matching', 'classification', 'single-choice', 'diagram-label', 'single-choice', 'diagram-label', 'single-choice', 'ordering',
  ]);
  const nutrients = content.questions.find(question => question.id === 'heterotrophic-organic-nutrients');
  assert.deepEqual(nutrients.correctIds, ['carbohydrates-proteins-lipids']);
  assert.equal(gradeQuestion(nutrients, ['carbohydrates-proteins-lipids']), true);
  assert.equal(gradeQuestion(nutrients, ['water-salts-co2']), false);
});

test('las pistas previas no enumeran las respuestas de clasificación ni explican los códigos visuales del flujo', () => {
  const examples = content.questions.find(question => question.id === 'nutrition-examples');
  assert.doesNotMatch(examples.note, /plants|algae|bacteria|animals|fungi|microorganisms/i);
  for (const question of content.questions.filter(item => item.kind === 'diagram-label')) {
    assert.equal(question.note, undefined);
  }
});

test('Q6 cellular respiration explanation does not call the explanation a simplified school model', () => {
  const question = content.questions.find(item => item.id === 'cellular-respiration-flow');
  assert.doesNotMatch(question.explanation, /in the simplified school model/i);
  assert.match(question.explanation, /^Cellular respiration uses oxygen and organic matter\\./);
});

test('diagramas: todas las etiquetas correctas se validan; huecos y respuestas erróneas no', () => {
  for (const question of content.questions.filter(item => item.kind === 'diagram-label')) {
    const solution = correctAnswer(question);
    assert.equal(isComplete(question, solution), true);
    assert.equal(gradeQuestion(question, solution), true);
    assert.equal(isComplete(question, {}), false);
    const wrong = { ...solution, [question.slots[0].id]: question.options.find(option => option.id !== solution[question.slots[0].id]).id };
    assert.equal(gradeQuestion(question, wrong), false);
    const attempt = createAttempt(content, [question.id], () => 0.5);
    assert.deepEqual(attempt.answers[question.id], {});
  }
});

test('flechas y números de los diagramas están dentro del viewBox y son únicos', () => {
  for (const question of content.questions.filter(item => item.kind === 'diagram-label')) {
    assert.equal(new Set(question.slots.map(slot => slot.number)).size, question.slots.length);
    for (const slot of question.slots) {
      for (const [x, y] of [slot.from, slot.to, slot.marker]) {
        assert.ok(x >= 0 && x <= 1000 && y >= 0 && y <= 420, `${question.id}:${slot.id}`);
      }
    }
  }
});

test('la normalización del motor acepta espacios inocuos y mayúsculas sin aceptar respuestas distintas', () => {
  assert.equal(normalizeText('  Organic   biomolecules  '), 'organic biomolecules');
  assert.equal(normalizeText('ORGANIC BIOMOLECULES'), normalizeText('Organic biomolecules'));
  assert.notEqual(normalizeText('Organic matter'), normalizeText('Inorganic matter'));
});

