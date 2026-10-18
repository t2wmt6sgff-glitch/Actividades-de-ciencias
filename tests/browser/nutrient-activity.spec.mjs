import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const content = JSON.parse(await readFile(new URL('../../data/native/how-do-living-things-get-nutrients.json', import.meta.url), 'utf8'));
const route = '/actividad/how-do-living-things-get-nutrients/';

async function click(page, locator) {
  if (test.info().project.use.hasTouch) await locator.tap();
  else await locator.click();
}

async function answer(page, question) {
  if (question.kind === 'single-choice' || question.kind === 'multiple-choice') {
    for (const id of question.correctIds) await click(page, page.locator(`.native-choice:has(input[value="${id}"])`));
  } else if (question.kind === 'ordering') {
    for (let position = 0; position < question.correctOrder.length; position += 1) {
      const id = question.correctOrder[position];
      const label = question.items.find(item => item.id === id).label;
      let current = await page.locator('.native-order li > span[lang="en"]').allTextContents();
      while (current.indexOf(label) > position) {
        await click(page, page.getByRole('button', { name: `Subir ${label}`, exact: true }));
        current = await page.locator('.native-order li > span[lang="en"]').allTextContents();
      }
    }
  } else if (question.kind === 'classification') {
    for (const item of question.items) {
      await page.getByRole('combobox', { name: `Category for ${item.label}`, exact: true }).selectOption(question.correctCategories[item.id]);
    }
  } else if (question.kind === 'matching') {
    for (const item of question.left) {
      const concept = page.getByRole('region', { name: 'Concepts' }).getByRole('button').filter({ has: page.getByText(item.label, { exact: true }) });
      const responseLabel = question.right.find(response => response.id === question.correctMatches[item.id]).label;
      const response = page.getByRole('region', { name: 'Responses' }).getByRole('button').filter({ has: page.getByText(responseLabel, { exact: true }) });
      await click(page, concept);
      await click(page, response);
    }
  } else if (question.kind === 'diagram-label') {
    for (const slot of question.slots) {
      await page.getByRole('combobox', { name: `${slot.number}. ${slot.label}`, exact: true }).selectOption(question.correctBySlot[slot.id]);
    }
  }
}

test('actividad completa: diagramas numerados, corrección, controles táctiles y diseño estrecho', async ({ page }) => {
  await page.goto(route);
  await expect(page.getByRole('heading', { name: 'How Do Living Things Get Nutrients?', exact: true })).toBeVisible();
  for (const [index, question] of content.questions.entries()) {
    await expect(page.locator('.native-question h2')).toHaveText(question.prompt);
    if (question.kind === 'diagram-label') {
      await expect(page.locator('.native-flow-svg')).toBeVisible();
      await expect(page.locator('.native-diagram-slots li')).toHaveCount(question.slots.length);
      await expect(page.locator('.native-diagram-figure figcaption')).toBeVisible();
    }
    await answer(page, question);
    expect(await page.locator('body').evaluate(element => element.scrollWidth <= window.innerWidth)).toBeTruthy();
    await click(page, page.getByRole('button', { name: 'Comprobar', exact: true }));
    await expect(page.locator('.native-verdict')).toHaveText('Correcta');
    await expect(page.locator('.native-explanation')).toContainText(question.explanation);
    if (question.kind === 'diagram-label') await expect(page.locator('.native-item-review li')).toHaveCount(question.slots.length);
    await click(page, page.getByRole('button', { name: index === content.questions.length - 1 ? 'Ver resultados' : 'Continuar', exact: true }));
  }
  await expect(page.locator('.native-score')).toContainText(`${content.questions.length} / ${content.questions.length}`);
});
